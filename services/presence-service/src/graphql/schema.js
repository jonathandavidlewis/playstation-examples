const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLBoolean } = require('graphql');
const AWS = require('aws-sdk');
const config = require('../config/config');

// Configure AWS
AWS.config.update({ region: config.AWS_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// Define Presence Type
const PresenceType = new GraphQLObjectType({
  name: 'Presence',
  fields: () => ({
    userId: { type: GraphQLString },
    status: { type: GraphQLString },
    lastSeen: { type: GraphQLString },
    isOnline: { type: GraphQLBoolean },
    currentGame: { type: GraphQLString },
  }),
});

// Define Query Type
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    presence: {
      type: PresenceType,
      args: { userId: { type: GraphQLString } },
      resolve(parent, args) {
        // Query DynamoDB for user presence
        const params = {
          TableName: config.DYNAMODB_TABLE,
          Key: { userId: args.userId },
        };
        return dynamodb.get(params).promise()
          .then(data => data.Item)
          .catch(err => {
            console.error('Error fetching presence:', err);
            return null;
          });
      },
    },
    presences: {
      type: new GraphQLList(PresenceType),
      resolve(parent, args) {
        // Scan DynamoDB for all presences (use with caution in production)
        const params = {
          TableName: config.DYNAMODB_TABLE,
          Limit: 100,
        };
        return dynamodb.scan(params).promise()
          .then(data => data.Items)
          .catch(err => {
            console.error('Error fetching presences:', err);
            return [];
          });
      },
    },
  },
});

// Define Mutation Type
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updatePresence: {
      type: PresenceType,
      args: {
        userId: { type: GraphQLString },
        status: { type: GraphQLString },
        isOnline: { type: GraphQLBoolean },
        currentGame: { type: GraphQLString },
      },
      resolve(parent, args) {
        const timestamp = new Date().toISOString();
        const item = {
          userId: args.userId,
          status: args.status,
          isOnline: args.isOnline,
          currentGame: args.currentGame,
          lastSeen: timestamp,
        };

        const params = {
          TableName: config.DYNAMODB_TABLE,
          Item: item,
        };

        return dynamodb.put(params).promise()
          .then(() => {
            // Publish SNS notification
            if (config.SNS_TOPIC_ARN) {
              const snsParams = {
                TopicArn: config.SNS_TOPIC_ARN,
                Message: JSON.stringify(item),
                Subject: 'Presence Update',
              };
              sns.publish(snsParams).promise().catch(err => console.error('SNS Error:', err));
            }
            return item;
          })
          .catch(err => {
            console.error('Error updating presence:', err);
            throw err;
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
