require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  DYNAMODB_TABLE: process.env.DYNAMODB_TABLE || 'presence-table',
  SNS_TOPIC_ARN: process.env.SNS_TOPIC_ARN || '',
};
