package models

import "time"

type Account struct {
	ID            string    `json:"id" dynamodbav:"id"`
	Email         string    `json:"email" dynamodbav:"email"`
	Username      string    `json:"username" dynamodbav:"username"`
	DisplayName   string    `json:"displayName" dynamodbav:"displayName"`
	AvatarURL     string    `json:"avatarUrl" dynamodbav:"avatarUrl"`
	PSNLevel      int       `json:"psnLevel" dynamodbav:"psnLevel"`
	Trophies      int       `json:"trophies" dynamodbav:"trophies"`
	FriendCount   int       `json:"friendCount" dynamodbav:"friendCount"`
	CreatedAt     time.Time `json:"createdAt" dynamodbav:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt" dynamodbav:"updatedAt"`
	IsVerified    bool      `json:"isVerified" dynamodbav:"isVerified"`
	IsPSPlus      bool      `json:"isPsPlus" dynamodbav:"isPsPlus"`
}

type CreateAccountRequest struct {
	Email       string `json:"email"`
	Username    string `json:"username"`
	DisplayName string `json:"displayName"`
}

type UpdateAccountRequest struct {
	DisplayName string `json:"displayName,omitempty"`
	AvatarURL   string `json:"avatarUrl,omitempty"`
	IsPSPlus    bool   `json:"isPsPlus,omitempty"`
}
