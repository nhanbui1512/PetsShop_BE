import { model, Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import { AddressModel } from './address.schema';

export enum userRoleEnum {
    USER = 'user',
    ADMIN = 'admin',
}

export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user',
}

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    addresses: Array<any>; // Change Object[] to Array<any> or specify a specific type
    profileImage: string;
    refreshToken: string;
    expired: Date;
    UserRoles: UserRoles;
    isActive?: boolean;
    role: userRoleEnum;
}

const IUserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            index: true,
            unique: true,
        },
        addresses: [
            {
                type: Schema.Types.ObjectId,
                ref: 'address',
            },
        ],
        password: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        profileImage: {
            type: String,
            default:
                'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg',
        },
        refreshToken: { type: String },
        isActive: { type: Boolean, default: true },
        role: {
            type: String,
            enum: Object.values(userRoleEnum),
            default: userRoleEnum.USER,
        },
        expired: { type: Date },
        UserRoles: {
            type: String,
            enum: Object.values(UserRoles),
            default: UserRoles.USER,
        },
    },
    { collection: 'user', timestamps: true }
);

IUserSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
IUserSchema.plugin(paginate);

IUserSchema.post('findOneAndUpdate', async function (doc) {
    const originalDoc = await this.model.findOne(this.getQuery()).exec();
    const originalAddresses = originalDoc.addresses.map(address => address._id.toString());
    const updatedAddresses = doc.addresses.map(address => address._id.toString());

    // Find addresses to remove
    const addressesToRemove = originalAddresses.filter(addressId => !updatedAddresses.includes(addressId));

    // Find addresses to update
    const addressesToUpdate = updatedAddresses.filter(addressId => !originalAddresses.includes(addressId));

    const addressUpdatePromises = [];

    // Remove user ID from addresses to be removed
    addressesToRemove.forEach(async addressId => {
        const address = await AddressModel.findById(addressId);
        if (address) {
            address.userId.pull(doc._id);
            addressUpdatePromises.push(address.save());
        }
    });

    // Update user ID for addresses to be updated
    addressesToUpdate.forEach(async addressId => {
        const address = await AddressModel.findById(addressId);
        if (address) {
            address.userId = doc._id;
            addressUpdatePromises.push(address.save());
        }
    });

    // Wait for all address update promises to resolve
    await Promise.all(addressUpdatePromises);
});

export const UserModel: SoftDeleteModel<IUser> = model<IUser>('user', IUserSchema);
