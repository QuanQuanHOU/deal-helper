import axios from 'axios';

export const getLogisticsPrice = async (logisticsCategory,
    totalWeight,
    currency) => {
        console.log('getLogisticsPrice')
    try {
        const response = await axios.post('http://localhost:3000/api/logistics-pricing', {
            logisticsCategory,
            totalWeight,
            currency
        });
        return response.data;

    } catch (error) {
        console.error('Error getting logistics price:', error);
        // 根据需要显示错误信息
    }
};