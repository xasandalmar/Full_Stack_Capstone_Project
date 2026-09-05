import { PREDEFINED_CATEGORIES } from '../utils/categories.js';

export const getCategories = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      count: PREDEFINED_CATEGORIES.length,
      categories: PREDEFINED_CATEGORIES,
    });
  } catch (error) {
    next(error);
  }
};
