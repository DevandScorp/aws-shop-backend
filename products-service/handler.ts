import  { getProductById } from './functions/getProductById';
import  { getProductsList } from './functions/getProductsList';
import 'source-map-support/register';

export const getProductsListHandler = getProductsList;
export const getProductByIdHandler = getProductById;
