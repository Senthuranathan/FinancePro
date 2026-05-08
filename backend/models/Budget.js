const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  monthlyIncome: {
    type: Number,
    default: 50000
  },
  categoryBudgets: {
    type: Map,
    of: Number,
    default: {
      'Groceries': 5000,
      'Rent': 15000,
      'Utilities': 3000,
      'Entertainment': 2000,
      'Transportation': 3000,
      'Dining': 4000,
      'Shopping': 5000
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Budget', budgetSchema);
