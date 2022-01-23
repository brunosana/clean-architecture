import { AccountModel, AddAccount, AddAccountModel, AddACcountRepository, Encrypter } from './db-add-account-protocols';

class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddACcountRepository;

  constructor (encrypter: Encrypter, addAccountRepository: AddACcountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);

    await this.addAccountRepository.add(Object.assign({}, accountData, { password: hashedPassword }));

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
