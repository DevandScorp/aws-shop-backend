import { HttpStatus, Injectable } from '@nestjs/common';

import axios from 'axios';
import { ServiceNameEnum } from './shared';
import { response } from 'express';
import AppUtils from './shared/utils';

@Injectable()
export class AppService {
  async redirectRequest(url, method, data) {
    const recipient = url.split('/')[1];
    const recipientUrl = process.env[recipient];
    if (!recipientUrl) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
        data: {
          message: 'Cannot process request',
        },
      };
    }
    let requestUrl = '';
    switch (recipient) {
      case ServiceNameEnum.PRODUCTS_SERVICE:
        requestUrl = `${recipientUrl}${url.replace('product', 'products')}`;
        break;
      case ServiceNameEnum.CART_SERVICE:
        requestUrl = `${recipientUrl}${url.replace('/cart', '')}`;
        break;
    }
    const response =
      url === '/product' && method === 'GET'
        ? await AppUtils.getProductsListCache(requestUrl)
        : await axios({
            method,
            url: requestUrl,
            ...(Object.keys(data || {}).length > 0 && { data }),
          });
    return { statusCode: response.status, data: response.data };
  }
}
