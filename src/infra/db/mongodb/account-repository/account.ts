import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountModel } from '../../../../domain/models/account';
import { MongoHelper } from '../helpers/mongo-helper';

class AccountMongoRepository implements AddAccountRepository {
  async add (accoundData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accoundData);

    const account = MongoHelper.map(result.ops[0]);

    return account;
  }
}

export { AccountMongoRepository };
