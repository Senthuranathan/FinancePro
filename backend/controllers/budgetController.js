const Budget = require('../models/Budget');

const getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ userId: req.user._id });
    if (!budget) {
      // Return default budget if none exists
      budget = new Budget({ userId: req.user._id });
      await budget.save();
    }
    res.json(budget);
  } catch (error) {
    console.error('GET BUDGET ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

const saveBudget = async (req, res) => {
  try {
    const { monthlyIncome, categoryBudgets } = req.body;
    let budget = await Budget.findOne({ userId: req.user._id });

    if (budget) {
      budget.monthlyIncome = monthlyIncome;
      budget.categoryBudgets = categoryBudgets;
      await budget.save();
    } else {
      budget = await Budget.create({
        userId: req.user._id,
        monthlyIncome,
        categoryBudgets
      });
    }
    res.json(budget);
  } catch (error) {
    console.error('SAVE BUDGET ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBudget, saveBudget };
