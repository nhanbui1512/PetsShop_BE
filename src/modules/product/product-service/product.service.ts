import PaginationService from '../../../system/service/pagination.service';
import { IUser, UserModel,IProduct,ProductModel, VariantOptionsModel, IVariantOptions } from '../../../system/model';
class ProductService {
    private paginationService: PaginationService<IProduct>;

    constructor(UserModel: any) {
        this.paginationService = new PaginationService<IProduct>(ProductModel);
    }

    async getProducts(productQuery: any) {
        try {
            let query: any = {};
            if (productQuery.search) {
                query.$text = { $search: productQuery.search };
            }

            let sortOptions: any = {};
            if (productQuery.sort) {
                sortOptions = productQuery.sort;
            }

            const options = {
                page: productQuery.page || 1,
                limit: productQuery.limit || 10,
                sort: sortOptions,
                populate: { path: 'variantOptions', select: 'name value price'}
            };

            const paginatedResult = await this.paginationService.paginate(query, options);

            return paginatedResult;
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string) {
        try {
            const product = await ProductModel.findById(id).lean().populate({ path: 'variantOptions', select: 'name value price' });

            return product;
        } catch (error) {
            throw error;
        }
    }
    async updateProduct(id: string, product: any) {
        try {
            const updatedProduct = await ProductModel.findByIdAndUpdate
            (id, product, { new: true });
            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
    async deleteProduct(id: string) {
        try {
            await ProductModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async createProduct(product: any) {
        try {
            const { variantOptions, ...productData } = product;
            const variantOptionPromises = variantOptions.map(variantOptionData =>
                VariantOptionsModel.create(variantOptionData)
            );
    
            const createdVariantOptions = await Promise.all(variantOptionPromises);
    
            const variantOptionsIds = createdVariantOptions.map(variantOption => variantOption._id);
    
            const newProductData = {
                ...productData,
                variantOptions: variantOptionsIds,
            };
            const newProduct = await ProductModel.create(newProductData);

            return this.getById(newProduct._id);
        } catch (error) {
            throw error;
        }
    }
    
}

export const createProductsService = new ProductService(ProductModel);
