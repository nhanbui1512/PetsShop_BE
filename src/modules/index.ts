import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createUserModule } from './user';

export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
        createUserModule(router);
    },
});
