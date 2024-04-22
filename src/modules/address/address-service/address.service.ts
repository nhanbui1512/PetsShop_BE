import { logger } from '../../../system/logging/logger';
import { AddressModel } from '../../../system/';
class AddressService {
    private addressModel: any;
    constructor(addressModel: any) {
        this.addressModel = AddressModel;
    }
    async createAddress(addressData: any, userId) {
        try {
            const address = new this.addressModel({
                ...addressData,
                userId: userId
            });
            const newAddress = await address.save();
            return newAddress;
        } catch (error) {
            throw error;
        }
    }
    async getAllAddresses() {
        try {
            const addresses = await this.addressModel.find();
            return addresses;
        } catch (error) {
            throw error;
        }
    }
    async getAddressById(id: string) {
        try {
            const address = await this.addressModel.findById(id);
            return address;
        } catch (error) {
            throw error;
        }
    }
    async getAddressByUserId(userId: string) {
        try {
            const address = await this.addressModel.findOne({ userId
            });
            return address;
        } catch (error) {
            throw error;
        }
    }
    async updateAddress(id: string, addressData: any) {
        try {
            const address = await this.addressModel.findByIdAndUpdate
            (id, addressData, { new: true });
            return address;
        } catch (error) {
            throw error;
        }
    }
    async deleteAddress(id: string) {
        try {
            await
            this.addressModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

}


export const createAddressesService = new AddressService(AddressModel);