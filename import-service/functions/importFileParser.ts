import { S3Handler } from "aws-lambda";
import { corsWrapper } from "../utils";
import csv from 'csv-parser';

export const importFileParser = (bucket): S3Handler => {
    return async (event, _context) => {
        try {
            for (const record of event.Records) {
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: record.s3.object.key
                }
                const s3Stream = bucket.getObject(params).createReadStream();
                await new Promise((resolve, reject) => {
                    s3Stream.pipe(csv())
                        .on('data', (data) => console.log(data))
                        .on('error', (error) => reject(error))
                        .on('end', () => {
                            resolve();
                        });
                });
                await bucket.copyObject({
                    Bucket: process.env.BUCKET_NAME,
                    CopySource: process.env.BUCKET_NAME + '/' + record.s3.object.key,
                    Key: record.s3.object.key.replace('uploaded', 'parsed')
                }).promise();
                await bucket.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: record.s3.object.key
                }).promise();
            }
            return corsWrapper({
                statusCode: 200,
                body: JSON.stringify({ message: 'OK' })
            })
        } catch(err) {
            return corsWrapper({ statusCode: 500, body: JSON.stringify({ message: 'Error while parsing products file' }) })
        }
    }
}
