const LogisticsPrice = require('../models/logisticsprice');

exports.calculatePricing = async (req, res) => {
  try {
    const { logisticsCategory, totalWeight, currency } = req.body;

    console.log({ logisticsCategory, totalWeight, currency } )
    console.log(req.body )
    // 根据条件查询物流单价模型对象
    const logisticsPrice = await LogisticsPrice.findOne({
        category:logisticsCategory,
      weightRangeStart: { $lt: totalWeight },
      weightRangeEnd: { $gte: totalWeight },
      // 假设币种是模型中的一个字段，用于筛选
      country:currency,
    }).exec();

    if (!logisticsPrice) {
      return res.status(404).json({ message: '物流单价未找到' });
    }


    // 返回物流单价信息
    res.json({
      ...logisticsPrice.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};