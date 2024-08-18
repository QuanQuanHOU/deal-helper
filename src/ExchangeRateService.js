import axios from 'axios';

const API_KEY = 'fad8e5c4615b4189274ddee8'; // 需要替换成你的 API 密钥
const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6/' + API_KEY + '/latest/CNY';

export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(EXCHANGE_API_URL);
    return response.data.conversion_rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};