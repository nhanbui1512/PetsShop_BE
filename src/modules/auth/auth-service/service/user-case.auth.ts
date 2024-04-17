import { omit } from 'lodash';
import {
    IncorrectLoginException,
    EmailUserExistedException,
} from '../exceptions';
import { hashService, userIdentityService } from '.';
import { UserModel } from '../../../../system/model/index';
import { mailService } from '../../../../system/service/mail.service';

class AuthenticationService {
    private readonly userIdentityService = userIdentityService;
    private readonly hashService = hashService;
    private readonly mailService = mailService;
    constructor() {
        this.userIdentityService = userIdentityService;
        this.hashService = hashService;
        this.mailService = mailService;
    }

    async login(loginDto) {
        const { email, password } = loginDto;

        const user = await UserModel.findOne({ email }).lean();

        if (
            !user ||
            !(await this.hashService.compare({
                raw: password,
                hashed: user.password,
            }))
        ) {
            throw new IncorrectLoginException();
        }

        return this.userIdentityService.sign(user);
    }

    async register({ firstName, lastName , email, password }) {
        const user = await UserModel.findOne({ email }).lean();

        if (user) {
            throw new EmailUserExistedException();
        }

        const hashedPassword = await this.hashService.hash(password);

        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            isActive: true,
        });

        return this.userIdentityService.sign(newUser);
    }

    async getMe(userId) {
        const user = await UserModel.findById(userId).lean();

        return omit(user, 'password');
    }

    async forgotPassword(email) {
        const user = await UserModel.findOne({ email: email }).lean();
        if (!user) {
            throw new Error('User not found');
        }
        mailService.sendMail(
            email,
            'Forget password',
            'Reset password',
            'Reset password',
        );
    }
}

export const authenticationService = new AuthenticationService();
