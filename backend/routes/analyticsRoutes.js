const express = require('express');
const router = express.Router();
const { getCategoryDistribution, getMonthlyTrends } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/categories', protect, getCategoryDistribution);
router.get('/trends', protect, getMonthlyTrends);

module.exports = router;
