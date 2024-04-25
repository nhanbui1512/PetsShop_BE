import PaginationService from '../../../system/service/pagination.service';
import {
    IUser,
    UserModel,
    IProduct,
    ProductModel,
    VariantOptionsModel,
    IOrder,
    OrderModel,
    IVariantOptions,
    OrderItemModel,
    IOrderItem,
} from '../../../system/model';
import { logger } from '../../../system/logging/logger';
class OrderService {
    private paginationService: PaginationService<IOrder>;

    constructor(OrderModel: any) {
        this.paginationService = new PaginationService<IOrder>(OrderModel);
    }

    async createOrder(data) {
        try {
            logger.info('Create order: ' + JSON.stringify(data));
            const orderItems = data.items;
    
            // Create all order items concurrently
            const orderItemsPromises = orderItems.map(item => OrderItemModel.create(item));
            const createdOrderItems = await Promise.all(orderItemsPromises);
    
            // Collect IDs of created order items
            const orderItemsIds = createdOrderItems.map(orderItem => orderItem._id);
    
            // Create order without populating items
            const order = await OrderModel.create({
                userId: data.userId || null,
                items: orderItemsIds,
                total: data.total,
                phone: data.phone,
                status: data.status,
                address: data.address,
            });
    
            // Populate items with product data
            return this.getById(order._id);
        } catch (error) {
            throw error;
        }
    }
    
    async getById(id: string) {
        try {
            const order = await OrderModel.findById(id)
                .populate({
                    path: 'items',
                    populate: {
                        path: 'productId variantOptions',
                    },
                })
                .lean()
                .exec();
            // logger.info('Order: ' + JSON.stringify(order));
            return order;
        } catch (error) {
            throw error;
        }
    }
    async getOrders(orderQuery: any) {
        try {
            let query: any = {};
            if (orderQuery.search) {
                query.$text = { $search: orderQuery.search };
            }
    
            let sortOptions: any = {};
            if (orderQuery.sort) {
                sortOptions = orderQuery.sort;
            } else {
                sortOptions = { createdAt: -1 };
            }
    
            const options = {
                page: orderQuery.page || 1,
                limit: orderQuery.limit || 10,
                sort: sortOptions,
                populate: [
                    {
                        path: 'items',
                        populate: {
                            path: 'productId variantOptions',
                        },
                    },
                ],
            };
    
            const paginatedResult = await this.paginationService.paginate(
                query,
                options,
            );
    
            return paginatedResult;
        } catch (error) {
            throw error;
        }
    }
    async updateOrder(id: string, order: any) {
        try {
            return
        } catch (error) {
            throw error;
        }
    }
    async deleteOrder(id: string) {
        try {
            return await OrderModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
    async confirmOrder(id: string, status: string) {
        try {
            return await OrderModel.findByIdAndUpdate(id, { status
            }
            );
        } catch (error) {
            throw error;
        }
    }
    

}

export const createOrderService = new OrderService(OrderModel);