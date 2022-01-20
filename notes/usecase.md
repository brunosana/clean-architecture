## Use Case

Com nossos testes de validação de dados e validação de métodos funcionando, podemos agora realizar a função do controller, que nesse caso, é poder criar uma conta.

Como estamos lidando com um método que o controller precisa, mas não cabe a ele realizar essa função, vamos precisar de um outro serviço. Dito isso, vamos inserir o teste para criar conta em `signup.spec.ts`:
```Typescript
test('Should call AddAccount with correct values', () => {
const { sut, addAccountStub } = makeSut();
const addSpy = jest.spyOn(addAccountStub, 'add');

const httpRequest = {
    body: {
    name: 'any_name',
    password: 'passhere',
    passwordConfirmation: 'passhere',
    email: 'email@mail.com',
    },
};
sut.handle(httpRequest);
expect(addSpy).toHaveBeenCalledWith({
    name: 'any_name',
    password: 'passhere',
    email: 'email@mail.com',
});
});
```

Conseguimos identificar que estamos verificando se um determinado método `add` de um determinado serviço `addAccountStub` está sendo chamado com os dados necessários e corretos.

Porém, que serviço é esse? Ele não existe, vamos gerar um _factory_ para esse serviço:
```Typescript
const makeAddAccount = (): AddAccount => {
  class AddAccuntStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
      };
      return fakeAccount;
    }
  }
  const addAccountStub = new AddAccuntStub();
  return addAccountStub;
};
```

E então podemos inserir no _main factory_:
```Typescript
interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub,
  };
};
```

Devemos encontrar vários erros relacionados a tipagem, pois não temos interfaces to tipo `AddAccount`, `AddAccountModel` e `AccountModel`.

Podemos então começar a criá-las.

---

### Criando um Use Case

Um caso de uso não faz parte da camada de apresentação mas sim do escopo do domínio do projeto. Para isso, vamos criar o nosso primeiro use case em `./src/domain/usecases/add-account.ts`:
```Typescript
interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

interface AddAccount {
  add(account: AddAccountModel): AccountModel;
}

export { AddAccount, AddAccountModel };
```

Falta a interface `AccountModel`. Porém, essa tipagem faz parte do escopo do Banco de Dados, um dado genérico que podemos utilizar em outros casos de uso. Por esse motivo, vamos armazenar o seu tipo em um `Model`. Vamos criar um arquivo em `./src/domain/models/account.ts`:
```Typescript
interface AccountModel {
  id: string;
  name: string;
  email: string;
  password: string;
}

export { AccountModel };
```

Feita a tipagem,  podemos corrigir os problemas de importação nos arquivos anteriores.

Com os testes validados, podemos commitar (lembrando em TDD commitamos com dois passos, a feature e o teste).

1. Com `git commit -m "feat: ensure SignUpController calls AddAccount with correct values"`
2. Com apenas os arquivos de teste `git commit -m "test: ensure SignUpController calls AddAccount with correct values"`

### Teste de exceção

Podemos agora inserir o teste caso o método `add` lançasse algum erro:
```Typescript
test('Should return 500 if AddAccount throws', () => {
const { sut, addAccountStub } = makeSut();

jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
    throw new Error();
});

const httpRequest = {
    body: {
    name: 'any_name',
    password: 'passhere',
    passwordConfirmation: 'passhere',
    email: 'email@mail.com',
    },
};

const httpResponse = sut.handle(httpRequest);

expect(httpResponse.statusCode).toBe(500);
expect(httpResponse.body).toEqual(new ServerError());
});
```

Como já temos um bloco de `try{}catch(e){}` no controller, o teste passará sem alterações no controller. Portanto, podemos commitar com `git c "test: ensure SignUpController returns 500 if AddAccount throws"` 