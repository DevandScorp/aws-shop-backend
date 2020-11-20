import { APIGatewayProxyHandler } from "aws-lambda";
import { corsWrapper } from "../utils";

export const importProductsFile = (bucket): APIGatewayProxyHandler => {
    return async (event, _context) => {
        try {
            if (!event.queryStringParameters || !event.queryStringParameters.name) {
                return corsWrapper({
                    statusCode: 400,
                    body: JSON.stringify({ message: 'You haven\'t passed name parameter' })
                })
            }
            if (event.queryStringParameters.name.indexOf('.csv') === -1) {
                return corsWrapper({
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Your file should be in csv format' })
                })
            }
            const url = await new Promise((resolve, reject) => {
                bucket.getSignedUrl('putObject', {
                    Bucket: process.env.BUCKET_NAME,
                    Key: `uploaded/${event.queryStringParameters.name}`,
                    Expires: 60,
                    ContentType: 'text/csv'
                }, (err, url) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(url)
                })
            })
            return corsWrapper({
                statusCode: 200,
                body: url
            })
        } catch (err) {
            return corsWrapper({ statusCode: 500, body: JSON.stringify({ message: 'Error while importing products file' }) })
        }
    }
}