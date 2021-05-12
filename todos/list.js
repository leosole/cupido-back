'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.list = (event, context, callback) => {

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    ProjectionExpression: "#id, #email, #message, #name, #createdAt",
    FilterExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#id": "id", 
      "#email": "email", 
      "#message": "message", 
      "#name": "name",
      "#createdAt": "createdAt"
    },
    ExpressionAttributeValues: {
      ":email": event.pathParameters.email
    }
  }
  console.log(event.pathParameters.email)
  dynamoDb.scan(params, (error, result) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 
          'Content-Type': 'text/plain',
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true },
        body: 'Couldn\'t fetch the todos.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify(result.Items.sort((a, b) => parseFloat(b.createdAt) - parseFloat(a.createdAt)))
      
    };
    callback(null, response);
  });
};
