import AWS from 'aws-sdk';

export const bucket = new AWS.S3({ region: 'eu-west-1' });