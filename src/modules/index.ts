import { createModuleFactory } from '../system/factories/index';
import { createAuthModule } from './auth';
import { createUserModule } from './user';
import { createCategoryModule } from './category';
import { createProductModule } from './product';
import { createBlogModule } from './blog';
export const createRootModule = createModuleFactory({
    path: '/api',
    name: 'Root',
    bundler: router => {
        createAuthModule(router);
        createUserModule(router);
        createCategoryModule(router);
        createProductModule(router);
        createBlogModule(router);
    },
});
