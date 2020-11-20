import { importProductsFile } from '../functions/importProductsFile';
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk"; 

beforeEach(() => {
    jest.resetModules() // most important - it clears the cache
    process.env = { BUCKET_NAME: 'test' }; // make a copy
  });

test('No name parameter', async () => {
    const importProductsFileHandler = importProductsFile(null);
    const importProductsFileResponse = await importProductsFileHandler({}, null, null);
    expect(importProductsFileResponse.body).toBe(JSON.stringify({ message: 'You haven\'t passed name parameter' }));
});

test('Wrong file name extension', async () => {
    const importProductsFileHandler = importProductsFile(null);
    const importProductsFileResponse = await importProductsFileHandler({ queryStringParameters: { name: 'test.pdf' }}, null, null);
    expect(importProductsFileResponse.body).toBe(JSON.stringify({ message: 'Your file should be in csv format' }));
});

test('Valid data with response', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3','getSignedUrl', (operation,params,callback) => {
        return callback(null, 'https://example.com');
      });
    const bucket = new AWS.S3({ region: 'eu-west-1' })
    const importProductsFileHandler = importProductsFile(bucket);
    const importProductsFileResponse = await importProductsFileHandler({ queryStringParameters: { name: 'test.csv' }}, null, null);
    expect(importProductsFileResponse.body).toBe('https://example.com');
 
    AWSMock.restore('S3');
})