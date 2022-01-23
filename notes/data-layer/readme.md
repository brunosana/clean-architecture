## Data Layer

> O Data Layer é responsável pela implementação de um protocolo da camada **Domain**

### Protocolo Add Account

Nesse protocolo (Que é o único que temos até agora) vamos implementar ele para o Banco de Dados. Para isso, vamos criar um arquivo `./src/data/usecases/add-account/db-add-account.spec.ts` (Pois estamos trabalhando com TDD e o sufixo `spec.ts` para o teste unitário).

A primeira coisa que faz sentido testar, uma vez que este arquivo irá passar pelo controller e validar os seus dados, será de em um primeiro momento criptografar a senha. Para realizar esse procedimento, nós vamos utilizar um **Encrypter**, que será responsável por receber o nosso password e retornar ele criptografado.

Esse `Encrypter` irá ter um método `encrypt`. Portanto, vamos inserir no arquivo de teste:
```Typescript
interface sutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncryptStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_value'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): sutTypes => {
  const encrypterStub = makeEncryptStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub,
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password',
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });
});
```

Nosso arquivo deve retornar vários erros de tipagem, Mas perceba que o teste está pronto, vamos enviar um `AddAccountModel` e garantir que o método `encrypt` do **Encrypter** vai ser chamado com o valor esperado, que é o do `password`.

Vamos então criar o nosso protocolo **Encrypter** em `./src/data/protocols/encrypter.ts` (Esse é um protocolo referente ao Data Layer, e não na Presentation Layer):
```Typescript
interface Encrypter {
  encrypt(value: string): Promise<string>;
}

export { Encrypter };
```

Então, agora com o protocolo e com o teste criado, vamos montar o nosso arquivo `db-add-account.ts`:
```Typescript
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
    // eslint-disable-next-line
    return new Promise(resolve => resolve(obj));
  }
}

export { DbAddAccount };
```

Podemos validar as importações no arquivo de teste e commitar com `git commit -m "feat: ensure DbAddAccount calls Encrypter with correct password"` e `git commit -m "test: ensure DbAddAccount calls Encrypter with correct password"`.