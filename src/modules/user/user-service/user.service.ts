import PaginationService from '../../../system/service/pagination.service';
import { IUser, UserModel } from '../../../system/model';
import omit from 'lodash/omit';
import _ from 'lodash';
class UserService {
    private paginationService: PaginationService<IUser>;

    constructor(UserModel: any) {
        this.paginationService = new PaginationService<IUser>(UserModel);
    }

    async getUsers(userQuery: any) {
        try {
            let query: any = {};
            if (userQuery.search) {
                query.$text = { $search: userQuery.search };
            }

            let sortOptions: any = {};
            if (userQuery.sort) {
                sortOptions = userQuery.sort;
            }

            const options = {
                page: userQuery.page || 1,
                limit: userQuery.limit || 10,
                sort: sortOptions 
            };

            const paginatedResult = await this.paginationService.paginate(query, options);

            const sanitizedResult = paginatedResult.docs.map(doc => _.omit(doc.toObject(), 'password'));

            return { ...paginatedResult, docs: sanitizedResult };
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string) {
        try {
            const user = await UserModel.findById(id).lean();

            return omit(user, 'password');
        } catch (error) {
            throw error;
        }
    }
    async updateUser(id: string, user: any) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate
            (id, user, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }
    async deleteUser(id: string) {
        try {
            await UserModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

export const createUserService = new UserService(UserModel);
