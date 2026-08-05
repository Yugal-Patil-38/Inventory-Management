import Category from '../models/Category.js';
import Product from '../models/Product.js';

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({
      name: name.trim(),
    }).collation({ locale: 'en', strength: 2 });

    if (categoryExists) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    const counts = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const categoriesWithCount = categories.map((category) => {
      const match = counts.find(
        (item) => String(item._id) === String(category._id)
      );

      return { ...category, productCount: match ? match.count : 0 };
    });

    res.status(200).json(categoriesWithCount);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const duplicate = await Category.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    }).collation({ locale: 'en', strength: 2 });

    if (duplicate) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    category.name = name;
    category.description = description;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const productCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productCount > 0) {
      return res.status(409).json({
        message: `Cannot delete. ${productCount} product(s) use this category`,
      });
    }

    await category.deleteOne();

    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
