import { model, Model, Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    _id: Object;
    productImage: string[];
    name: string;
    description: string;
    variantOptions: IVariantOptions[];
    categoryID: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IVariantOptions extends Document {
    _id: Object;
    name: string;
    value: string;
    prince: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export const VariantOptionsSchema = new Schema<IVariantOptions>(
    {
        name: { type: String, required: true },
        value: { type: String, required: true },
        prince: { type: Number, required: true },
        quantity: { type: Number, required: true },
    },
    { collection: 'variantOptions', timestamps: true },
);
export const VariantOptionsModel: Model<IVariantOptions> = model<IVariantOptions>('variantOptions', VariantOptionsSchema);

// Schema IProductSchema
const IProductSchema = new Schema<IProduct>(
    {
        productImage: [
            {
                type: String,
            },
        ],
        name: { type: String, required: true },
        description: { type: String, required: true },
        categoryID: [{ type: Schema.Types.ObjectId, ref: 'category' }],
        variantOptions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'variantOptions',
            },
        ],
    },
    { collection: 'product', timestamps: true },
);
export const ProductModel: Model<IProduct> = model<IProduct>('product', IProductSchema);
