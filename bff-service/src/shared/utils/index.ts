import axios from 'axios';
import { memoizeAsync } from 'utils-decorators';

/** Функция для кэширования запроса получения списка продуктов */
class AppUtils {
  @memoizeAsync(1000 * 60 * 2)
  static async getProductsListCache(url) {
    return await axios({
      method: 'GET',
      url,
    });
  }
}

export default AppUtils;
