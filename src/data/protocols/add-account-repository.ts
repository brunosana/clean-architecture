import { AddAccountModel } from '../../domain/usecases/add-account';
import { AccountModel } from '../../domain/models/account';

interface AddAccountRepository {
  add(accoundData: AddAccountModel): Promise<AccountModel>;
}

export { AddAccountRepository };
