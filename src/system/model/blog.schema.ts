import { model, Model, Schema, Document, Mongoose } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { SoftDeleteDocument } from 'mongoose-delete';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

export interface IBlog extends Document,SoftDeleteDocument {
    _id: Object;
    title: string;
    content: string;
    category: Object;
    createdAt?: Date;
    updatedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        category: { type: Schema.Types.ObjectId, ref: 'category' },
    },
    { collection: 'blog', timestamps: true },
);

BlogSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });
BlogSchema.plugin(paginate);
// index title to search
BlogSchema.index({ title: 'text' });

export const BlogModel:SoftDeleteModel = model<IBlog>('blog', BlogSchema);
