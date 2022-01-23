import { AddAccountModel } from '../../domain/usecases/add-account';
import { AccountModel } from '../../domain/models/account';

interface AddACcountRepository {
  add(accoundData: AddAccountModel): Promise<AccountModel>;
}

export { AddACcountRepository };
