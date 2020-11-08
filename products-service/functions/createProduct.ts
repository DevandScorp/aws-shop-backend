import { Client } from "pg";
import { dbOptions } from "../config";

export const createProduct = async (body: { count: number, price: number, title: string, description: string }) => {
    console.log('Request info: ', body);
    if (!body.count || !body.price || !body.title || !body.description) {
        return { statusCode: 400, body: JSON.stringify({ message: 'Product info is not full' }) };
    }
    if (body.price <= 0) return { statusCode: 400, body: JSON.stringify({ message: 'Price should be >=0' }) };
    if (body.count <= 0) return { statusCode: 400, body: JSON.stringify({ message: 'Count should be >=0' }) };

    const client = new Client(dbOptions);
    try {
        await client.connect();
        const { rows: [result] } =
            await client.query(`insert into products (title, description, price)
                                values ($1, $2, $3)
                                returning id;`, [body.title, body.description, body.price]);
        await client.query(`insert into stocks (product_id, count)
                            values ($1,$2)`, [result.id, body.count]);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: 'OK' }),
        };
    } catch (err) {
        console.log('Error during database request executing: ', err);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error during database request executing' }) }
    } finally {
        await client.end();
    }
}