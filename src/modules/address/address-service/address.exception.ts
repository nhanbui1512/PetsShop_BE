import { ErrorException } from '../../../system/';

export class AddressNotFoundException extends ErrorException {
    constructor() {
        super('ADDRESS_NOT_FOUND');
        this.status = 404;
    }
}