'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  
  const data = JSON.parse(event.body);
  console.log(data.body);
  if (
    typeof data.body.email !== 'string' || 
    typeof data.body.message !== 'string' || 
    typeof data.body.name !== 'string'
    ){
    console.error('Falha de validação');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Erro ao validar a mensagem.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      email: data.body.email,
      name: data.body.name,
      message: data.body.message,
      createdAt: Date.now(),
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Erro ao salvar a mensagem.',
      });
      return;
    }
  
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
      },
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });

  // const outputs = {
  //   output: "\"Mensagem enviada.\"",
  //   taskToken: taskToken,
  // };

  // stepfunctions.sendTaskSuccess(outputs, (err, data) => {
  //   if (err) {
  //       console.error(err.message);
  //       callback(err.message);
  //       return;
  //   }
  //   console.log(data);
  //   callback(null);
  // });
};
