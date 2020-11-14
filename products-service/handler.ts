import  { getProductById } from './functions/getProductById';
import  { getProductsList } from './functions/getProductsList';
import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { createProduct } from './functions/createProduct';



export const getProductsListHandler: APIGatewayProxyHandler = async (event, _context) => await getProductsList();
export const getProductByIdHandler: APIGatewayProxyHandler = async (event, _context) => await getProductById(event.pathParameters.id);
export const createProductHandler: APIGatewayProxyHandler = async (event,_context) => await createProduct(JSON.parse(event.body));