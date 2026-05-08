const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
require('dotenv').config();

const categories = ['Groceries', 'Rent', 'Utilities', 'Entertainment', 'Transportation', 'Dining', 'Shopping', 'Salary'];

const generateTransactions = (userId, num) => {
  const transactions = [];
  for (let i = 0; i < num; i++) {
    const isExpense = Math.random() > 0.1; // 90% expenses
    const amount = isExpense ? Math.floor(Math.random() * 500) + 10 : Math.floor(Math.random() * 5000) + 1000;
    const category = isExpense ? categories[Math.floor(Math.random() * (categories.length - 1))] : 'Salary';
    
    // Random date in the current year
    const start = new Date(new Date().getFullYear(), 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

    transactions.push({
      userId,
      amount,
      type: isExpense ? 'expense' : 'income',
      category,
      date,
      description: `Mock ${category} transaction`
    });
  }
  return transactions;
};

const seedData = async () => {
  try {

    await User.deleteMany();
    await Transaction.deleteMany();

    const user = new User({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    });
    await user.save();
    console.log('User created:', user.email);

    const transactions = generateTransactions(user._id, 1000);
    await Transaction.insertMany(transactions);
    console.log('Inserted 1000 transactions');

  } catch (error) {
    console.error(error);
  }
};

module.exports = { seedData };
