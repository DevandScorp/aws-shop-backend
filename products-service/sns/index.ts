import * as AWS from 'aws-sdk';

export const sns = new AWS.SNS({ region: 'eu-west-1'});