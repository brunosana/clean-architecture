import { AccountModel } from '../../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account';
import { Encrypter } from '../../protocols/encrypter';

class DbAddAccount implements AddAccount {
  private readonly encrypter;

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    const obj: AccountModel = {
      email: '',
      id: '',
      name: '',
      password: '',
    };
    return await new Promise(resolve => resolve(obj));
  }
}

export { DbAddAccount };
