import { AccountModel, AddAccount, AddAccountModel, Encrypter } from './db-add-account-protocols';

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
