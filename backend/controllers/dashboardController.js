import Product from '../models/Product.js';
import Category from '../models/Category.js';

const getStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalCategories,
      lowStock,
      outOfStock,
      stockSum,
      recentProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments({ status: 'Low Stock' }),
      Product.countDocuments({ status: 'Out of Stock' }),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: '$quantity' } } },
      ]),
      Product.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(6),
      Product.find({ status: { $in: ['Low Stock', 'Out of Stock'] } })
        .populate('category', 'name')
        .sort({ quantity: 1 })
        .limit(5),
    ]);

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalStock: stockSum.length > 0 ? stockSum[0].total : 0,
      lowStock,
      outOfStock,
      recentProducts,
      lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

export { getStats };
