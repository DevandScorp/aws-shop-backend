import { importProductsFile } from './functions/importProductsFile';
import { bucket } from './bucket';
import { importFileParser } from './functions/importFileParser';

export const importProductsFileHandler = importProductsFile(bucket);
export const importFileParserHandler = importFileParser(bucket);