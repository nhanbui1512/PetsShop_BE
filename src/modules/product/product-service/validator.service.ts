import Joi from 'joi';
import { createInboundValidatorByJoi } from '../../../system/factories';

export const productCreateDtoValidator = createInboundValidatorByJoi(
    Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        categoryID: Joi.string().required(), // Assuming categoryID is a string
        variantOptions: Joi.array().items(Joi.object()), // Assuming variantOptions is an array of strings
        productImage: Joi.array().items(Joi.string()), // Assuming productImage is an array of strings
    })
);