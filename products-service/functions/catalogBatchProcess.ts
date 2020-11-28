import { SQSHandler } from "aws-lambda";
import { Client } from "pg";
import { dbOptions } from "../config";

export const catalogBatchProcess = (sns): SQSHandler => {
    return async (event) => {
        const client = new Client(dbOptions);
        const products = event.Records.map(({ body }) => body);
        try {
            await client.connect();
            for (const product of products) {
                console.log('Request info: ', product);
                const parsedProduct = JSON.parse(product);
                if (!parsedProduct.count || !parsedProduct.price || !parsedProduct.title || !parsedProduct.description) continue;
                if (parsedProduct.price <= 0 || parsedProduct.count <= 0) continue;
                const { rows: [result] } =
                    await client.query(`insert into products (title, description, price)
                                    values ($1, $2, $3)
                                    returning id;`, [parsedProduct.title, parsedProduct.description, parsedProduct.price]);
                await client.query(`insert into stocks (product_id, count)
                                values ($1,$2)`, [result.id, parsedProduct.count]);
                await sns.publish({
                    Subject: 'This products were added to your shop',
                    Message: JSON.stringify(product),
                    TopicArn: process.env.SNS_ARN,
                    MessageAttributes: {
                        Type: {
                            DataType: 'String',
                            StringValue: parsedProduct.price >= 10 ? 'Expensive' : 'Cheap'
                        }
                    }
                }).promise();
            }
        } catch (err) {
            console.log('Error during database request executing: ', err);
        } finally {
            await client.end();
        }
    }
}