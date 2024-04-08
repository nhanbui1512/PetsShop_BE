import { ICategory, CategoryModel } from "../../../system/model";

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await CategoryModel.find({}).lean();
            return categories;
        } catch (error) {
            throw error;
        }
    }
    async createCategory(category) {
        try {
            const newCategory = await CategoryModel.create(category);
            return newCategory;
        } catch (error) {
            throw error;
        }
    }
}
export const categoryService = new CategoryService();