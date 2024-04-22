import { model, Model, Schema, Document } from 'mongoose';
import { IVariantOptions } from './product.schema';
import { SoftDeleteDocument } from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { VariantOptionsSchema } from './product.schema';
export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    DELIVERED = 'DELIVERED',
}

export interface IOrder extends Document, SoftDeleteDocument {
    _id: Object;
    userId: Object;
    items: Object[];
    total: number;
    status: OrderStatus;
    phone: string;
    address: Object;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IOrderItem extends Document {
    _id: Object;
    productId: Object;
    quantity: number;
    variantOptions: IVariantOptions[];
    price: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderItemSchema = new Schema<IOrderItem>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'product' },
        quantity: { type: Number, required: true },
        variantOptions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'variantOptions',
            },
        ],
        price: { type: Number, required: true },
    },
    { collection: 'orderItem', timestamps: true },
);

export const OrderItemModel: Model<IOrderItem> = model<IOrderItem>(
    'orderItem',
    OrderItemSchema,
);


export const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'user' },
        items: [
            {
                type: Schema.Types.ObjectId,
                ref: 'orderItem',
            },
        ],
        total: { type: Number, required: true },
        phone: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        address: { type: Schema.Types.ObjectId, ref: 'address' },
    },
    { collection: 'order', timestamps: true },
);



OrderSchema.post('findOneAndUpdate', async function(doc) {
    try {
        const order = await OrderModel.findById(doc._id).select('status items').populate({
            path: 'items.productId',
            select: 'variantOptions',
        }); // Chỉ lấy trạng thái và các sản phẩm trong đơn hàng, và chỉ populate các variant options của sản phẩm

        if (order.status === OrderStatus.CONFIRMED) {
            const promises = []; // Sử dụng mảng promises để chờ tất cả các lời hứa được thực hiện trước khi tiếp tục
            for (const item of order.items) {
                for (const variantOption of item.productId.variantOptions) {
                    const orderVariantOption = item.variantOptions.find(v => v.toString() === variantOption._id.toString());
                    if (orderVariantOption) {
                        variantOption.quantity -= orderVariantOption.quantity;
                    }
                }
                promises.push(item.productId.save()); // Thêm lời hứa vào mảng promises
            }
            await Promise.all(promises); // Chờ tất cả các lời hứa trong mảng promises được thực hiện
        }
    } catch (error) {
        console.error('Error updating variant options quantity:', error);
    }
});
export const OrderModel:SoftDeleteModel = model<IOrder>('order', OrderSchema);

