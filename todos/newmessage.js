'use strict';

const AWS = require('aws-sdk')

exports.newmessage = async (event) => {

    const stepFunctions = new AWS.StepFunctions();
    const reqBody = event.body || {};

    const params = {
        stateMachineArn: "arn:aws:states:sa-east-1:661781056568:stateMachine:newMessageStates",
        input: reqBody
    }

    return stepFunctions.startExecution(params).promise()
        .then(async data => {
            console.log('==> data: ', data)
            return stepFunctions.describeExecution({ executionArn: data.executionArn }).promise();
        })
        .then(result => {
           return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin" : "*", 
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "X-Requested-With": "*"
                },
                message: JSON.stringify(result)
            }
        })
        .catch(err => {
            console.error('err: ', err)
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin" : "*", 
                    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,X-Amz-Security-Token,Authorization,X-Api-Key,X-Requested-With,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "X-Requested-With": "*"
                },
                message: JSON.stringify({ message: 'facing error' })
            }
        })
}