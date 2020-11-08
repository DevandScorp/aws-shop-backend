import { Client } from "pg";
import { dbOptions } from "../config";

export const getProductById = async (id: string) => {
    console.log('Request info: ', id);
    const client = new Client(dbOptions);
    try {
        await client.connect();
        const { rows: [product] } =
            await client.query(`select products.id id, count, price, title, description, image
                                from products
                                        inner join stocks s on products.id = s.product_id
                                where products.id = $1`, [id]);
        if (!product) return { statusCode: 404, body: JSON.stringify({ message: 'Product not found' }) };
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(product),
        };
    } catch (err) {
        console.log('Error during database request executing: ', err);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error during database request executing' }) }
    } finally {
        await client.end();
    }
}