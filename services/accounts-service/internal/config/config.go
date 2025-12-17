package config

import "os"

type Config struct {
	AWSRegion      string
	DynamoDBTable  string
	SNSTopicARN    string
	Port           string
}

func NewConfig() *Config {
	return &Config{
		AWSRegion:     getEnv("AWS_REGION", "us-east-1"),
		DynamoDBTable: getEnv("DYNAMODB_TABLE", "accounts-table"),
		SNSTopicARN:   getEnv("SNS_TOPIC_ARN", ""),
		Port:          getEnv("PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
