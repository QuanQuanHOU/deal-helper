const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  // 物流类目，例如：陆运、空运等 yunphguahao， yunddguahao
  category: { type: String, required: true },
  // 计算方式，例如:guahao xvzhong
  calculationMethod: { type: String, required: true },
  // 国家，表示该物流服务适用的国家
  country: { type: String, required: true }, 
  // 重量区间左值（kg）
  weightRangeStart: { type: Number, min: 0 },
  // 重量区间右值（kg），可以设置为null，表示无上限
  weightRangeEnd: { type: Number, min: 0 },
  // 最低计费重量（kg）
  minimumChargeableWeight: { type: Number,  min: 0 },
  // 运费单价（rmb/kg）
  freightRatePerKg: { type: Number,  min: 0 },
  // 挂号费（rmb/票）
  registrationFeePerPiece: { type: Number,  min: 0 },
  // 首重重量，例如：1kg
  firstWeightBracket: { type: Number,  min: 0 },
  // 首重起价，表示首重的价格
  firstWeightPrice: { type: Number,  min: 0 },
  // 续重单价，表示超出首重后每公斤的价格
  additionalWeightRate: { type: Number,  min: 0 },
  // 步进重量，表示续重的计量单位
  incrementWeight: { type: Number,  min: 0 }
});

// 创建物流单价模型
const LogisticsPrice = mongoose.model('LogisticsPrice', logisticsSchema);

module.exports = LogisticsPrice;