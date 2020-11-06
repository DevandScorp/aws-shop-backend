import  { getProductById } from './functions/getProductById';
import  { getProductsList } from './functions/getProductsList';
import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';

export const getProductsListHandler: APIGatewayProxyHandler = async (event, _context) => getProductsList();
export const getProductByIdHandler: APIGatewayProxyHandler = async (event, _context) => getProductById(event.path);
