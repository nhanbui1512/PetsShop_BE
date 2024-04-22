import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';
import { identityGuard } from '../auth/auth-service/service';
import { logger } from '../../system/logging/logger';
import { createAddressesService, AddressNotFoundException } from './address-service/';

import {} from '../../system/model';
const MODULE_NAME = 'Address';

export const createAddressModule = createModuleFactory({
    path: '/address',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        const AddressCreateDTO = 'AddressCreateDTO'
        // create address
        swaggerBuilder.addModel({
            name: 'AddressCreateDTO',
            properties: {
                street: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Address of the user',
                }),
                city: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'City of the user',
                }),
                state: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'State of the user',
                }),
                country: PropertyFactory.createProperty({
                    type: 'string',
                    description: 'Country of the user',
                })
            },
        });
        swaggerBuilder.addRoute({
            description: 'Create address',
            route: '/address',
            method: 'post',
            tags: [MODULE_NAME],
            body: AddressCreateDTO,
            security:true
        })

        router.post(
            '/',
            identityGuard,
            createHandler(async (req, res) => {
                // logger.debug('user ID ' + JSON.stringify(req.user));
                const address = await createAddressesService.createAddress(req.body,req.user.userId);
                return HttpResponseBuilder.buildOK(res, address);
            }),
        );

        // get all addresses
        swaggerBuilder.addRoute({
            description: 'Get all addresses',
            route: '/address',
            method: 'get',
            tags: [MODULE_NAME],
            security:true
        })
        router.get(
            '/',
            identityGuard,
            createHandler(async (req, res) => {
                const addresses = await createAddressesService.getAllAddresses();
                return HttpResponseBuilder.buildOK(res, addresses);
            }),
        );
        swaggerBuilder.addRoute({
            description: 'Get address by ID',
            route: '/address/{id}',
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of address',
                    required: true,
                }),
            ],
            tags: [MODULE_NAME],
            security:true
        })

        // get address by id
        router.get(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                const address = await createAddressesService.getAddressById(req.params.id);
                return HttpResponseBuilder.buildOK(res, address);
            }),
        );
        // get address by user id
        swaggerBuilder.addRoute({
            description: 'Get address by user ID',
            route: '/address/user/{userId}',
            method: 'get',
            params: [
                PropertyFactory.createParam({
                    name: 'userId',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of user',
                    required: true,
                }),
            ],
            tags: [MODULE_NAME],
            security:true
        })
        router.get(
            '/user/:userId',
            identityGuard,
            createHandler(async (req, res) => {
                const address = await createAddressesService.getAddressByUserId(req.params.userId);
                return HttpResponseBuilder.buildOK(res, address);
            }),
        );
        // update address 
        swaggerBuilder.addRoute({
            description: 'Update address',
            route: '/address/{id}',
            method: 'patch',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of address',
                    required: true,
                }),
            ],
            tags: [MODULE_NAME],
            security:true,
            body: AddressCreateDTO,
        })
        router.patch(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                const address = await createAddressesService.updateAddress(req.params.id, req.body);
                return HttpResponseBuilder.buildOK(res, address);
            }),
        );
        // delete address
        swaggerBuilder.addRoute({
            description: 'Delete address',
            route: '/address/{id}',
            method: 'delete',
            params: [
                PropertyFactory.createParam({
                    name: 'id',
                    paramsIn: 'path',
                    type: 'string',
                    description: 'Object id of address',
                    required: true,
                }),
            ],
            tags: [MODULE_NAME],
            security:true
        })
        router.delete(
            '/:id',
            identityGuard,
            createHandler(async (req, res) => {
                await createAddressesService.deleteAddress(req.params.id);
                return HttpResponseBuilder.buildNoContent(res);
            }),
        );

    },
});
