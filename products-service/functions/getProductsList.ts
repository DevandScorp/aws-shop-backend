import { Client } from 'pg';
import { dbOptions } from '../config';

export const getProductsList = async () => {
    const client = new Client(dbOptions);
    try {
        await client.connect();

        const { rows: products } =
            await client.query(`select products.id id, count, price, title, description, image
                                from products
                                        inner join stocks s on products.id = s.product_id;`);
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(products),
        };
    } catch (err) {
        console.log('Error during database request executing: ', err);
        return { statusCode: 500, body: JSON.stringify({ message: 'Error during database request executing' }) }
    } finally {
        await client.end();
    }

}