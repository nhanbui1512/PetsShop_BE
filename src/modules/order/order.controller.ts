import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
const MODULE_NAME = 'Order';
export const createOrderModule = createModuleFactory({
    path: '/orders',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        //create order
        const CREATE_ORDER_DTO = 'CreateOrderDto';
        swaggerBuilder.addModel({
            name: CREATE_ORDER_DTO,
            properties: {
                userId: PropertyFactory.createProperty({ description: 'User id' }),
                items: PropertyFactory.createArrayProperty({
                    description: 'Order items',
                    items: PropertyFactory.createProperty({ $ref: 'OrderItemDto' }),
                }),
                total: PropertyFactory.createProperty({ description: 'Total price' }),
                phone: PropertyFactory.createProperty({ description: 'Phone number' }),
                status: PropertyFactory.createProperty({ description: 'Order status' }),
                address: PropertyFactory.createProperty({ description: 'Address id' }),
            },
        });
        swaggerBuilder.addRoute({
            description: 'create order',
            route:'/orders',
            tags: [MODULE_NAME],
            method: 'post',
            params: [
                PropertyFactory.createParam({
                    name: 'limit',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Number of items per page (limit)',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'page',
                    paramsIn: 'query',
                    type: 'number?',
                    description: 'Page number',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'search',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Search query',
                    required: false,
                }),
                PropertyFactory.createParam({
                    name: 'sort',
                    paramsIn: 'query',
                    type: 'string?',
                    description: 'Sort query',
                    required: false,
                }),
            ],
        })
    },
});