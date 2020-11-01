import { APIGatewayProxyHandler } from "aws-lambda";
import { Products } from "../data/products";

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    const eventPath = event.path;
    const id = eventPath.slice(eventPath.lastIndexOf('/')+1, eventPath.length);
    const [product] = Products.filter(product => product.id === id);
    if (!product) return { statusCode: 404, body: JSON.stringify({ message: 'Product not found' })}
    return {
        statusCode: 200,
        body: JSON.stringify(product),
    };
}