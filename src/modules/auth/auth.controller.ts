import { swaggerBuilder } from '../../system/swagger';
import { PropertyFactory } from '../../system/swagger/core/property.factory';
import { createModuleFactory } from '../../system/factories/module.factory';
import { createHandler } from '../../system/factories';
import { HttpResponseBuilder } from '../../system/builders/http-response.builder';

import {
    registerDtoValidator,
    loginDtoValidator,
    authenticationService,
    userIdentityService,
    identityGuard,
} from './auth-service/service';
import { logger } from '../../system/logging/logger';

const MODULE_NAME = 'Auth';
export const createAuthModule = createModuleFactory({
    path: '/auth',
    name: MODULE_NAME,
    bundler: router => {
        swaggerBuilder.addTag(MODULE_NAME);
        const LOGIN_DTO_NAME = 'LoginDto';
        swaggerBuilder.addModel({
            name: LOGIN_DTO_NAME,
            properties: {
                email: PropertyFactory.createProperty({ type: 'string' }),
                password: PropertyFactory.createProperty({ type: 'string' }),
            },
        });
        swaggerBuilder.addRoute({
            description: "Login to the system. Returns JWT token.",
            //params search and sort pagination limit and offset
            params: {
                search: PropertyFactory.createProperty({ type: 'string' }),
                sort: PropertyFactory.createProperty({ type: 'string' }),
                page: PropertyFactory.createProperty({ type: 'number' }),
                limit: PropertyFactory.createProperty({ type: 'number' }),
            },
            route: '/auth/login',
            body: LOGIN_DTO_NAME,
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/login',
            loginDtoValidator,
            createHandler(async (req, res) => {
                const loginDto = {
                    email: req.body.email,
                    password: req.body.password,
                };

                const authCredentials =
                    await authenticationService.login(loginDto);

                return HttpResponseBuilder.buildOK(res, authCredentials);
            }),
        );
        swaggerBuilder.addModel({
            name: 'RegisterDto',
            properties: {
                firstName: PropertyFactory.createProperty({ type: 'string' }),
                lastName: PropertyFactory.createProperty({ type: 'string' }),
                email: PropertyFactory.createProperty({ type: 'string' }),
                password: PropertyFactory.createProperty({ type: 'string' })
            },
        });
        swaggerBuilder.addRoute({
            route: '/auth/register',
            body: 'RegisterDto',
            tags: [MODULE_NAME],
            method: 'post',
        });
        router.post(
            '/register',
            registerDtoValidator,
            createHandler(async (req, res) => {
                const registerDto = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                };

                const authCredentials =
                    await authenticationService.register(registerDto);

                return HttpResponseBuilder.buildOK(res, authCredentials);
            }),
        );
        swaggerBuilder.addRoute({
            route: '/auth/me',
            tags: [MODULE_NAME],
            method: 'get',
            security: true,
        });
        router.get(
            '/me',
            identityGuard,
            createHandler(async (req, res) => {
                const userId = userIdentityService.getUserIdContext(req);
                logger.info(typeof userId);
                const user = await authenticationService.getMe(userId);

                return HttpResponseBuilder.buildOK(res, user);
            }),
        );
    },
});
