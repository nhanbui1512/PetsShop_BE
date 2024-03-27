import { model, Model, Schema, Document, Mongoose } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { SoftDeleteDocument } from 'mongoose-delete';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
export interface IUser extends Document,SoftDeleteDocument {
    _id: Object;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    addresses: Object[];
    profileImage: string;
    refreshToken: string;
    expired: Date;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
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
        profileImage: { type: String, default: 'https://www.shutterstock.com/image-vector/default-avatar-profile-icon-vector-260nw-1725655669.jpg' },
        refreshToken: { type: String },
        isActive: { type: Boolean, default: true },
        expired: { type: Date },
    },
    { collection: 'user', timestamps: true },
);
IUserSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
IUserSchema.plugin(paginate);

export const UserModel: SoftDeleteModel = model<IUser>('user', IUserSchema);
