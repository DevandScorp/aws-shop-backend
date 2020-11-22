import  { getProductById } from './functions/getProductById';
import  { getProductsList } from './functions/getProductsList';
import 'source-map-support/register';
import { APIGatewayProxyHandler, SQSHandler } from 'aws-lambda';
import { createProduct } from './functions/createProduct';
import { catalogBatchProcess } from './functions/catalogBatchProcess';



export const getProductsListHandler: APIGatewayProxyHandler = async (event, _context) => await getProductsList();
export const getProductByIdHandler: APIGatewayProxyHandler = async (event, _context) => await getProductById(event.pathParameters.id);
export const createProductHandler: APIGatewayProxyHandler = async (event,_context) => await createProduct(JSON.parse(event.body));
export const catalogBatchProcessHandler: SQSHandler = catalogBatchProcess;