import { APIGatewayProxyHandler } from "aws-lambda";
import { Products } from "../data/products";

export const getProductsList: APIGatewayProxyHandler = async (event, _context) => {
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(Products),
    };
}