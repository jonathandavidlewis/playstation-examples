# S3 Bucket Configuration for PlayStation Family Application

## Purpose

S3 buckets are used for:
1. **User Avatars** - Profile pictures and avatar images
2. **Game Assets** - Thumbnails, icons, and game-related media
3. **Static Assets** - Web assets for any web-based components
4. **Application Logs** - Centralized logging from services

## Bucket Structure

### avatars-bucket
```
playstation-avatars-{environment}/
├── users/
│   ├── {userId}/
│   │   ├── avatar.jpg
│   │   └── thumbnail.jpg
```

**Configuration:**
- Public read access for avatars
- Lifecycle policy: Archive to Glacier after 1 year
- Versioning enabled
- CORS enabled for mobile/web uploads

### game-assets-bucket
```
playstation-game-assets-{environment}/
├── games/
│   ├── {gameId}/
│   │   ├── icon.png
│   │   ├── banner.jpg
│   │   └── screenshots/
```

**Configuration:**
- Public read access
- CloudFront CDN for fast delivery
- Versioning disabled
- Lifecycle policy: Delete after 2 years

### logs-bucket
```
playstation-logs-{environment}/
├── auth-service/
├── accounts-service/
├── presence-service/
└── application/
```

**Configuration:**
- Private access only
- Lifecycle policy: Move to Glacier after 30 days, delete after 1 year
- Encryption at rest enabled

## CloudFormation Example

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: S3 Buckets for PlayStation Family Application

Resources:
  AvatarsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'playstation-avatars-${Environment}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
      CorsConfiguration:
        CorsRules:
          - AllowedOrigins:
              - '*'
            AllowedMethods:
              - GET
              - PUT
              - POST
            AllowedHeaders:
              - '*'
            MaxAge: 3000
      VersioningConfiguration:
        Status: Enabled
      LifecycleConfiguration:
        Rules:
          - Id: ArchiveOldAvatars
            Status: Enabled
            Transitions:
              - TransitionInDays: 365
                StorageClass: GLACIER
      Tags:
        - Key: Application
          Value: PlayStation-Family
        - Key: Environment
          Value: !Ref Environment

  GameAssetsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'playstation-game-assets-${Environment}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false
      LifecycleConfiguration:
        Rules:
          - Id: DeleteOldAssets
            Status: Enabled
            ExpirationInDays: 730
      Tags:
        - Key: Application
          Value: PlayStation-Family
        - Key: Environment
          Value: !Ref Environment

  LogsBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'playstation-logs-${Environment}'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true
      LifecycleConfiguration:
        Rules:
          - Id: ArchiveAndDeleteLogs
            Status: Enabled
            Transitions:
              - TransitionInDays: 30
                StorageClass: GLACIER
            ExpirationInDays: 365
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      Tags:
        - Key: Application
          Value: PlayStation-Family
        - Key: Environment
          Value: !Ref Environment

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues:
      - production
      - staging
      - development

Outputs:
  AvatarsBucketName:
    Value: !Ref AvatarsBucket
    Export:
      Name: !Sub '${AWS::StackName}-AvatarsBucket'

  GameAssetsBucketName:
    Value: !Ref GameAssetsBucket
    Export:
      Name: !Sub '${AWS::StackName}-GameAssetsBucket'

  LogsBucketName:
    Value: !Ref LogsBucket
    Export:
      Name: !Sub '${AWS::StackName}-LogsBucket'
```

## Usage Examples

### Uploading Avatar from Mobile App

```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3();

async function uploadAvatar(userId: string, file: any) {
  const params = {
    Bucket: 'playstation-avatars-production',
    Key: `users/${userId}/avatar.jpg`,
    Body: file,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  };
  
  return await s3.upload(params).promise();
}
```

### Generating Presigned URL for Upload

```typescript
const getUploadUrl = (userId: string) => {
  const params = {
    Bucket: 'playstation-avatars-production',
    Key: `users/${userId}/avatar.jpg`,
    Expires: 3600, // 1 hour
    ContentType: 'image/jpeg',
  };
  
  return s3.getSignedUrl('putObject', params);
};
```
