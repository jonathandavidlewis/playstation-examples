package repository

import (
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
	"github.com/aws/aws-sdk-go/service/sns"
	"github.com/google/uuid"
	"github.com/jonathandavidlewis/playstation-examples/services/accounts-service/internal/config"
	"github.com/jonathandavidlewis/playstation-examples/services/accounts-service/internal/models"
)

type Repository interface {
	CreateAccount(account *models.Account) error
	GetAccount(id string) (*models.Account, error)
	UpdateAccount(id string, updates *models.UpdateAccountRequest) (*models.Account, error)
	DeleteAccount(id string) error
	ListAccounts(limit int) ([]*models.Account, error)
}

type DynamoDBRepository struct {
	db     *dynamodb.DynamoDB
	sns    *sns.SNS
	config *config.Config
}

func NewDynamoDBRepository(cfg *config.Config) *DynamoDBRepository {
	sess := session.Must(session.NewSession(&aws.Config{
		Region: aws.String(cfg.AWSRegion),
	}))

	return &DynamoDBRepository{
		db:     dynamodb.New(sess),
		sns:    sns.New(sess),
		config: cfg,
	}
}

func (r *DynamoDBRepository) CreateAccount(account *models.Account) error {
	account.ID = uuid.New().String()
	account.CreatedAt = time.Now()
	account.UpdatedAt = time.Now()
	account.PSNLevel = 1
	account.Trophies = 0
	account.FriendCount = 0

	av, err := dynamodbattribute.MarshalMap(account)
	if err != nil {
		return err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(r.config.DynamoDBTable),
		Item:      av,
	}

	_, err = r.db.PutItem(input)
	if err != nil {
		return err
	}

	// Publish SNS notification
	r.publishAccountEvent("account.created", account.ID)

	return nil
}

func (r *DynamoDBRepository) GetAccount(id string) (*models.Account, error) {
	input := &dynamodb.GetItemInput{
		TableName: aws.String(r.config.DynamoDBTable),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(id),
			},
		},
	}

	result, err := r.db.GetItem(input)
	if err != nil {
		return nil, err
	}

	if result.Item == nil {
		return nil, nil
	}

	account := &models.Account{}
	err = dynamodbattribute.UnmarshalMap(result.Item, account)
	if err != nil {
		return nil, err
	}

	return account, nil
}

func (r *DynamoDBRepository) UpdateAccount(id string, updates *models.UpdateAccountRequest) (*models.Account, error) {
	account, err := r.GetAccount(id)
	if err != nil || account == nil {
		return nil, err
	}

	account.UpdatedAt = time.Now()
	if updates.DisplayName != "" {
		account.DisplayName = updates.DisplayName
	}
	if updates.AvatarURL != "" {
		account.AvatarURL = updates.AvatarURL
	}
	account.IsPSPlus = updates.IsPSPlus

	av, err := dynamodbattribute.MarshalMap(account)
	if err != nil {
		return nil, err
	}

	input := &dynamodb.PutItemInput{
		TableName: aws.String(r.config.DynamoDBTable),
		Item:      av,
	}

	_, err = r.db.PutItem(input)
	if err != nil {
		return nil, err
	}

	// Publish SNS notification
	r.publishAccountEvent("account.updated", account.ID)

	return account, nil
}

func (r *DynamoDBRepository) DeleteAccount(id string) error {
	input := &dynamodb.DeleteItemInput{
		TableName: aws.String(r.config.DynamoDBTable),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {
				S: aws.String(id),
			},
		},
	}

	_, err := r.db.DeleteItem(input)
	if err != nil {
		return err
	}

	// Publish SNS notification
	r.publishAccountEvent("account.deleted", id)

	return nil
}

func (r *DynamoDBRepository) ListAccounts(limit int) ([]*models.Account, error) {
	if limit <= 0 {
		limit = 50
	}

	input := &dynamodb.ScanInput{
		TableName: aws.String(r.config.DynamoDBTable),
		Limit:     aws.Int64(int64(limit)),
	}

	result, err := r.db.Scan(input)
	if err != nil {
		return nil, err
	}

	accounts := make([]*models.Account, 0)
	for _, item := range result.Items {
		account := &models.Account{}
		err = dynamodbattribute.UnmarshalMap(item, account)
		if err != nil {
			continue
		}
		accounts = append(accounts, account)
	}

	return accounts, nil
}

func (r *DynamoDBRepository) publishAccountEvent(eventType, accountID string) {
	if r.config.SNSTopicARN == "" {
		return
	}

	message := map[string]string{
		"eventType": eventType,
		"accountId": accountID,
		"timestamp": time.Now().Format(time.RFC3339),
	}

	// In production, properly marshal the message
	_ = message
	// r.sns.Publish(&sns.PublishInput{...})
}
