import { APIGatewayProxyHandler } from "aws-lambda";
import { Products } from "../data/products";

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
    return {
        statusCode: 200,
        body: JSON.stringify(Products),
    };
}