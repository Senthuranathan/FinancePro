const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

const getCategoryDistribution = async (req, res) => {
  try {
    const { month, year } = req.query; // optional filtering
    let matchStage = { userId: req.user._id, type: 'expense' };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    const distribution = await Transaction.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMonthlyTrends = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    const trends = await Transaction.aggregate([
      { $match: { userId: req.user._id, date: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Format for frontend
    const formatted = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0
    }));

    trends.forEach(item => {
      formatted[item._id.month - 1][item._id.type] = item.total;
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategoryDistribution, getMonthlyTrends };
