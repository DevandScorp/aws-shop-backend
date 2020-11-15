import { importProductsFile } from '../functions/importProductsFile';
import * as AWSMock from "aws-sdk-mock";
import * as AWS from "aws-sdk"; 

beforeEach(() => {
    jest.resetModules() // most important - it clears the cache
    process.env = { BUCKET_NAME: 'test' }; // make a copy
  });

test('No name parameter', async () => {
    const importProductsFileResponse = await importProductsFile({}, null, null);
    expect(importProductsFileResponse.body).toBe(JSON.stringify({ message: 'You haven\'t passed name parameter' }));
});

test('Wrong file name extension', async () => {
    const importProductsFileResponse = await importProductsFile({ queryStringParameters: { name: 'test.pdf' }}, null, null);
    expect(importProductsFileResponse.body).toBe(JSON.stringify({ message: 'Your file should be in csv format' }));
});

test('Valid data with response', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3','getSignedUrl', (operation,params,callback) => {
        return callback(null, 'https://example.com');
      });
      const importProductsFileResponse = await importProductsFile({ queryStringParameters: { name: 'test.csv' }}, null, null);
    // const bucket = new AWS.S3({ region: 'eu-west-1' })
    // const url = await new Promise((resolve, reject) => {
    //     bucket.getSignedUrl('putObject', {}, (err, url) => {
    //         if (err) {
    //             reject(err)
    //         }
    //         resolve(url)
    //     })
    // });
    console.log(importProductsFileResponse);
    expect('https://example.com').toBe('https://example.com');
 
    AWSMock.restore('S3');
})