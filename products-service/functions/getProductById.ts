import { Products } from "../data/products";

export const getProductById = (eventPath: string) => {
    if (!eventPath) return { statusCode: 500, body: JSON.stringify({ message: 'Request path was not provided' }) }
    const id = eventPath.slice(eventPath.lastIndexOf('/') + 1, eventPath.length);
    const [product] = Products.filter(product => product.id === id);
    if (!product) return { statusCode: 404, body: JSON.stringify({ message: 'Product not found' }) }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(product),
    };
}