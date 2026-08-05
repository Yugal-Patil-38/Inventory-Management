import Product from '../models/Product.js';
import InventoryTransaction from '../models/InventoryTransaction.js';
import getStockStatus from '../utils/stockStatus.js';

const adjustStock = async (req, res, next) => {
  try {
    const { type, note } = req.body;
    const amount = Number(req.body.quantity);

    if (type !== 'IN' && type !== 'OUT') {
      return res.status(400).json({ message: 'Type must be IN or OUT' });
    }

    if (!amount || amount < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousQuantity = product.quantity;
    const newQuantity =
      type === 'IN' ? previousQuantity + amount : previousQuantity - amount;

    if (newQuantity < 0) {
      return res.status(400).json({
        message: `Cannot remove ${amount}. Only ${previousQuantity} left in stock`,
      });
    }

    product.quantity = newQuantity;
    product.status = getStockStatus(newQuantity);
    await product.save();

    await InventoryTransaction.create({
      product: product._id,
      type,
      quantity: amount,
      previousQuantity,
      newQuantity,
      note,
      createdBy: req.user._id,
    });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getActivity = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const transactions = await InventoryTransaction.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalTransactions = await InventoryTransaction.countDocuments();

    res.status(200).json({
      transactions,
      page,
      totalPages: Math.ceil(totalTransactions / limit),
      totalTransactions,
    });
  } catch (error) {
    next(error);
  }
};

const getHistory = async (req, res, next) => {
  try {
    const transactions = await InventoryTransaction.find({
      product: req.params.productId,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};

export { adjustStock, getActivity, getHistory };
