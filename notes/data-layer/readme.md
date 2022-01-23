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


#### Teste de Exceção

Esse classe será usada no Controller, ou seja, caso o método `encrypter` do **Encrypter** falhar e lançar uma exceção, ela não deve ser capturada, pois será tratada no controller.

Vamos montar um teste para garantir que sempre que uma exceção ocorra no nosso **Encrypter** ela não seja capturada:
```Typescript
test('Should throw if Encrypter throws', async () => {
  const { sut, encrypterStub } = makeSut();
  jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
    new Promise((resolve, reject) => reject(new Error())),
  );
  const accountData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
  };
  const promise = sut.add(accountData);
  await expect(promise).rejects.toThrow();
});
```

1. Não estamos mais espionando o método.
2. Estamos fazendo um Mocking do seu retorno utilizando uma `Promise Rejects`.
3. Não utilizamos mais o `await` para o método `add` e capturamos o seu retorno com uma variável, que nesse caso, sem o await, irá retornar uma `Promise`.
4. Esperamos que a `Promise` não apenas seja rejeitada como também lance uma exceção.

Podemos commitar agora com `git c "test: ensure DbAddAccount throws if Encrypter trhows"`.

---

#### Teste de integração com o repositório

Para montar o teste de integração com o repositório, precisamos primeiro, da definição do repositório, que possui um método`add` e cadastra as informações no banco de dados.

Vamos primeiro, montar o teste:
```Typescript
test('Should call AddAccountRepository with correct values', async () => {
  const { sut, addAccountRepositoryStub } = makeSut();
  const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
  const accountData = {
    name: 'valid_name',
    email: 'valid_email',
    password: 'valid_password',
  };
  await sut.add(accountData);
  expect(addSpy).toHaveBeenCalledWith({
    name: 'valid_name',
    email: 'valid_email',
    password: 'hashed_password',
  });
});
```

Perceba que agora, temos um `addAccountRepositoryStub` que possui um método `add` e verificamos se no caso de uso `db-add-account` ele é chamado com os valores corretos.

Com essa alteração, precisamos modificar o nosso `makeSut`:
```Typescript
// [...]
const makeAddAccountRepository = (): AddACcountRepository => {
  class AddAccountRepositoryStub implements AddACcountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password',
      };

      return await new Promise(resolve => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddACcountRepository;
}
const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
  };
};
```

Precisamos agora definir a interface `AddACcountRepository` em `./src/data/protocols/add-account-repository.ts`:
```Typescript
import { AddAccountModel } from '../../domain/usecases/add-account';
import { AccountModel } from '../../domain/models/account';

interface AddACcountRepository {
  add(accoundData: AddAccountModel): Promise<AccountModel>;
}

export { AddACcountRepository };
```

Com as interfaces e testes criados, podemos agora modificar o nosso caso de uso `db-add-account`:
```Typescript
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
```

Com as importações configuradas e os testes funcionando, podemos commitar!