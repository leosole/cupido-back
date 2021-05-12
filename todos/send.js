'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const ses = new AWS.SES({ region: "sa-east-1" });

module.exports.send = (event, context, callback) => {
  // const data = JSON.parse(event.body);
  var response = {};
  event.Records.forEach((record) =>{
    if (record.eventName == 'INSERT') {
      const data = {
        email: record.dynamodb.NewImage.email.S,
        message: record.dynamodb.NewImage.message.S,
        name: record.dynamodb.NewImage.name.S
      }
      console.log(data);
      if (
        typeof data.email !== 'string' || 
        typeof data.message !== 'string' || 
        typeof data.name !== 'string'
        ){
        console.error('Falha de validação');
        callback(null, {
          statusCode: 400,
          headers: { 'Content-Type': 'text/plain' },
          body: 'Erro ao validar a mensagem.',
        });
        return;
      }

      var params = {
        Destination: {
          ToAddresses: [data.email],
        },
        Message: {
          Body: {
            Text: { Data: data.message },
          },

          Subject: { Data: data.name + ", nova mensagem do cupido!" },
        },
        Source: "leosole@poli.ufrj.br",
      };
    
      ses.sendEmail(params, (error) =>{
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Erro ao enviar a e-mail.',
          });
          return;
        }
        console.log("MAIL SENT")
        response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS 
          },
          body: JSON.stringify(params),
        };
        callback(null, response);
      });
    }
  })  
  
};
