const express = require('express');
const router = express.Router();
const logisticsController = require('../controllers/logisticsController');

// 物流定价查询接口
router.post('/logistics-pricing', logisticsController.calculatePricing);

module.exports = router;