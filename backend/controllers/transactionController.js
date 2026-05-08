const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, type } = req.query;
    
    let query = { userId: req.user._id };
    
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }
    if (category) query.category = category;
    if (type) query.type = type;

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCount: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;
    const transaction = await Transaction.create({
      userId: req.user._id,
      amount, type, category, date, description
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransactions, addTransaction, deleteTransaction };
