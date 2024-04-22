import { model, Schema, Document } from 'mongoose';
import { UserModel } from './user.schema';

export interface IAddress extends Document {
    _id: Object;
    street: string;
    city: string;
    userId: any;
    state: string;
    country: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const IAddressSchema = new Schema<IAddress>(
    {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        userId: { type: Schema.Types.ObjectId, ref: 'user', required: true }
    },
    { collection: 'address', timestamps: true }
);

IAddressSchema.post('save', async function (doc) {
    try {
        // Find the user associated with this address
        const user = await UserModel.findById(doc.userId);
        if (!user) {
            throw new Error('User not found for the given address.');
        }

        // Check if the address is already in the user's addresses array
        if (!user.addresses.includes(doc._id)) {
            // Add the address to the user
            user.addresses.push(doc._id);
            await user.save();
        }
    } catch (error) {
        console.error('Error adding address to user:', error);
        // You may want to handle this error differently based on your application's requirements
    }
});

IAddressSchema.post('findOneAndDelete', async function(doc) {
    try {
        // Tìm tất cả các người dùng có tham chiếu tới địa chỉ bị xóa
        const usersToUpdate = await UserModel.find({ addresses: doc._id });

        // Tạo mảng các promise để loại bỏ tham chiếu từ mỗi người dùng
        const updatePromises = usersToUpdate.map(async user => {
            user.addresses.pull(doc._id);
            return user.save();
        });

        // Chờ cho tất cả các promise hoàn thành bằng Promise.all()
        await Promise.all(updatePromises);
    } catch (error) {
        console.error('Error removing address reference from users:', error);
        // Xử lý lỗi tại đây nếu cần thiết
    }
});

export const AddressModel = model<IAddress>('address', IAddressSchema);
