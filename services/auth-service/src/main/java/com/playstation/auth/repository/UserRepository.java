package com.playstation.auth.repository;

import com.playstation.auth.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UserRepository {

    private final DynamoDbClient dynamoDbClient;

    @Value("${aws.dynamodb.users-table:users-table}")
    private String tableName;

    public UserRepository(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
            user.setCreatedAt(LocalDateTime.now());
        }
        user.setUpdatedAt(LocalDateTime.now());

        Map<String, AttributeValue> item = new HashMap<>();
        item.put("id", AttributeValue.builder().s(user.getId()).build());
        item.put("email", AttributeValue.builder().s(user.getEmail()).build());
        item.put("username", AttributeValue.builder().s(user.getUsername()).build());
        item.put("passwordHash", AttributeValue.builder().s(user.getPasswordHash()).build());
        item.put("accountId", AttributeValue.builder().s(user.getAccountId()).build());
        item.put("enabled", AttributeValue.builder().bool(user.isEnabled()).build());
        item.put("locked", AttributeValue.builder().bool(user.isLocked()).build());
        item.put("createdAt", AttributeValue.builder().s(user.getCreatedAt().toString()).build());
        item.put("updatedAt", AttributeValue.builder().s(user.getUpdatedAt().toString()).build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":email", AttributeValue.builder().s(email).build());

        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .filterExpression("email = :email")
                .expressionAttributeValues(expressionAttributeValues)
                .build();

        ScanResponse response = dynamoDbClient.scan(scanRequest);
        
        if (response.items().isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(mapToUser(response.items().get(0)));
    }

    public Optional<User> findById(String id) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("id", AttributeValue.builder().s(id).build());

        GetItemRequest request = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);

        if (response.item() == null || response.item().isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(mapToUser(response.item()));
    }

    public void updateLastLogin(String userId) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("id", AttributeValue.builder().s(userId).build());

        Map<String, AttributeValue> expressionAttributeValues = new HashMap<>();
        expressionAttributeValues.put(":lastLogin", 
            AttributeValue.builder().s(LocalDateTime.now().toString()).build());

        UpdateItemRequest request = UpdateItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .updateExpression("SET lastLoginAt = :lastLogin")
                .expressionAttributeValues(expressionAttributeValues)
                .build();

        dynamoDbClient.updateItem(request);
    }

    private User mapToUser(Map<String, AttributeValue> item) {
        return User.builder()
                .id(item.get("id").s())
                .email(item.get("email").s())
                .username(item.get("username").s())
                .passwordHash(item.get("passwordHash").s())
                .accountId(item.get("accountId").s())
                .enabled(item.get("enabled").bool())
                .locked(item.get("locked").bool())
                .createdAt(LocalDateTime.parse(item.get("createdAt").s()))
                .updatedAt(LocalDateTime.parse(item.get("updatedAt").s()))
                .lastLoginAt(item.containsKey("lastLoginAt") ? 
                    LocalDateTime.parse(item.get("lastLoginAt").s()) : null)
                .build();
    }
}
