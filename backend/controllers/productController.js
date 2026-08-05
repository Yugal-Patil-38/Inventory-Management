import Product from '../models/Product.js';
import Category from '../models/Category.js';
import getStockStatus from '../utils/stockStatus.js';

const createProduct = async (req, res, next) => {
  try {
    const { name, sku, category, description, quantity, unitPrice, supplier } =
      req.body;

    if (!name || !sku || !category || unitPrice === undefined) {
      return res.status(400).json({
        message: 'Name, SKU, category and unit price are required',
      });
    }

    if (quantity < 0 || unitPrice < 0) {
      return res
        .status(400)
        .json({ message: 'Quantity and unit price cannot be negative' });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: 'Selected category not found' });
    }

    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });

    if (skuExists) {
      return res.status(409).json({ message: 'SKU already exists' });
    }

    const product = await Product.create({
      name,
      sku,
      category,
      description,
      quantity,
      unitPrice,
      supplier,
      status: getStockStatus(quantity),
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const allowedSortFields = ['name', 'unitPrice', 'quantity', 'createdAt'];

const getProducts = async (req, res, next) => {
  try {
    const { search, category, status, sortBy, order } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (status) {
      filter.status = status;
    }

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, sku, category, description, quantity, unitPrice, supplier } =
      req.body;

    if (!name || !sku || !category || unitPrice === undefined) {
      return res.status(400).json({
        message: 'Name, SKU, category and unit price are required',
      });
    }

    if (quantity < 0 || unitPrice < 0) {
      return res
        .status(400)
        .json({ message: 'Quantity and unit price cannot be negative' });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(400).json({ message: 'Selected category not found' });
    }

    const skuOwner = await Product.findOne({
      sku: sku.toUpperCase(),
      _id: { $ne: req.params.id },
    });

    if (skuOwner) {
      return res.status(409).json({ message: 'SKU already exists' });
    }

    product.name = name;
    product.sku = sku;
    product.category = category;
    product.description = description;
    product.quantity = quantity;
    product.unitPrice = unitPrice;
    product.supplier = supplier;
    product.status = getStockStatus(quantity);

    await product.save();

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
