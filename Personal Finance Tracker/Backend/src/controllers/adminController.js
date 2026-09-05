import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getAdminOverview = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Aggregated financial metrics system-wide
    const totals = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    let systemIncome = 0;
    let systemExpenses = 0;

    totals.forEach((item) => {
      if (item._id === 'income') systemIncome = item.totalAmount;
      if (item._id === 'expense') systemExpenses = item.totalAmount;
    });

    // Top spending categories system-wide
    const topCategories = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          category: '$_id',
          totalAmount: 1,
          count: 1,
        },
      },
    ]);

    // Recent registered users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalTransactions,
        systemIncome,
        systemExpenses,
        systemNetVolume: systemIncome - systemExpenses,
      },
      topSpendingCategories: topCategories,
      recentUsers,
    });
  } catch (error) {
    next(error);
  }
};
