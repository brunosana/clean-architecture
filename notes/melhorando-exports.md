## Melhorando Exports

Vamos abstrair alguns imports para arquivos únicos baseado em seu nicho para melhorar a escrita de imports em outros arquivos.

Crie um arquivo em `./src/protocols/index.ts`:
```Typescript
export * from './controller';
export * from './email-validator';
export * from './http';
```

Crie um arquivo em `./src/errors/index.ts`:
```Typescript
export * from './invalid-param-error';
export * from './missing-param-error';
export * from './server-error';
```


Agora, vamos melhorar as importações de erros e protocolos, reduzindo a uma única linha para cada segmento:
```Typescript
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols';
```

Podemos commitar com `git commit -m "refactor: move all protocols imports to a single file"` e ` git commit -m "refactor: move all errors imports to a single file"`.

---

#### @EDIT

Nesse momento, temos uma inconsistência na regra lógica do projeto: O EmailValidator não é um recurso genérico, a ser utilizado por outros controllers/protocolos, ele é específico do `SignUp`, portanto, não é coerente manter um arquivo com todas as importações dessa forma. Porém, se formos segmentando os imports, vamos voltar à estaca zero.

Para melhorar esse workflow, vamos fazer um refactor no projeto e atribuir os protocolos do `SignUp` em um arquivo único e específico para esse serviço. Vamos criar uma pasta `./src/presentation/controllers/signup` e mover o nosso controller e o teste para lá.

Agora, nessa mesma pasta, vamos criar um arquivo `signup-protocols.ts`:
```Typescript
export * from '../../protocols';
export * from '../../protocols/email-validator';
export * from '../../../domain/usecases/add-account';
export * from '../../../domain/models/account';
```

**OBS: Alguns imports ainda não existem pois será adicionado futuramente durante as notas.**

Podemos commitar agora com `git c "refactor: move all signup protocols to a single file"`


---

Vamos agora abstrair a criação de instâncias de classes de teste para factorys:
```Typescript
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
};

const makeEmailValidatorWithError = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      throw new Error();
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  return emailValidatorStub;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};
```

Agora, podemos ir lá embaixo, no teste `'Should return 500 if EmailValidator throws'` e substituir todo o trecho de criação de instância:
```Typescript
const emailValidatorStub = makeEmailValidatorWithError();
```

**Como alternativa, podemos também mockar a implementação de um método, para evitar precisar recriar várias vezes um factory sempre que for necessário simular um retorno diferente.**

Para isso, removemos o médoto `makeEmailValidatorWithError` e utilizamos o `jest`:

```Typescript
const { sut, emailValidatorStub } = makeSut();

jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
  throw new Error();
});
```


Podemos commitar agora com `git c "refactor: move all protocols imports to a single file"`.

Próxima leitura: [useCase.md](./usecase.md)