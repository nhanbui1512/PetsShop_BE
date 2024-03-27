import { model, Model, Schema, Document } from 'mongoose';
export interface IBlog extends Document {
    _id: Object;
    title: string;
    content: string;
    category: Object;
    createdAt?: Date;
    updatedAt?: Date;
}

export const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'category' },
    },
    { collection: 'blog', timestamps: true },
);
