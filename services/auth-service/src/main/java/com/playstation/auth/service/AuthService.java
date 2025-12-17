package com.playstation.auth.service;

import com.playstation.auth.model.AuthRequest;
import com.playstation.auth.model.AuthResponse;
import com.playstation.auth.model.RegisterRequest;
import com.playstation.auth.model.User;
import com.playstation.auth.repository.UserRepository;
import com.playstation.auth.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;
    private final SnsClient snsClient;

    @Value("${aws.sns.topic-arn:}")
    private String snsTopicArn;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    public AuthService(UserRepository userRepository, 
                      JwtTokenProvider jwtTokenProvider,
                      SnsClient snsClient) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.snsClient = snsClient;
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create new user
        String accountId = UUID.randomUUID().toString();
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .accountId(accountId)
                .enabled(true)
                .locked(false)
                .build();

        user = userRepository.save(user);

        // Publish registration event to SNS
        publishEvent("user.registered", user.getId());

        // Generate tokens
        String token = jwtTokenProvider.generateToken(user.getId(), user.getAccountId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .userId(user.getId())
                .accountId(user.getAccountId())
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // Check if account is enabled and not locked
        if (!user.isEnabled() || user.isLocked()) {
            throw new RuntimeException("Account is disabled or locked");
        }

        // Update last login
        userRepository.updateLastLogin(user.getId());

        // Publish login event to SNS
        publishEvent("user.login", user.getId());

        // Generate tokens
        String token = jwtTokenProvider.generateToken(user.getId(), user.getAccountId());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .userId(user.getId())
                .accountId(user.getAccountId())
                .build();
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate new tokens
        String newToken = jwtTokenProvider.generateToken(user.getId(), user.getAccountId());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .userId(user.getId())
                .accountId(user.getAccountId())
                .build();
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    private void publishEvent(String eventType, String userId) {
        if (snsTopicArn == null || snsTopicArn.isEmpty()) {
            return;
        }

        try {
            String message = String.format("{\"eventType\":\"%s\",\"userId\":\"%s\"}", 
                eventType, userId);
            
            PublishRequest publishRequest = PublishRequest.builder()
                    .topicArn(snsTopicArn)
                    .message(message)
                    .subject("Auth Event")
                    .build();

            snsClient.publish(publishRequest);
        } catch (Exception e) {
            // Log error but don't fail the operation
            System.err.println("Failed to publish SNS event: " + e.getMessage());
        }
    }
}
