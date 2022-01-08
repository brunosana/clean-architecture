## Dependências e Mocks

Antes de introduzir os conceitos e aplicações de dependências, vamos remover o código duplicado dos testes. Todo teste, precisamos de um _System Under Test_, ou um _SUT_, e todo teste nós instanciamos um novo. No futuro, com o Controller dependendo de vários outros serviços, vai ficar insustentável ficar instanciando toda vez.

Portanto, em `signup.spec.ts`, vamos refatorar isso utilizando um factory:
```Typescript
interface SutTypes {
  sut: SignUpController;
}

const makeSut = (): SutTypes => {
  const sut = new SignUpController();
  return { sut };
};
```

Agora, temos um método que instancia o nosso SUT e certamente, sempre que precisarmos de um novo serviço, instanciamos o mesmo dessa forma.

Agora, substituímos os trechos de criação de instância nos testes por `const { sut } = makeSut();`;

Podemos Commitar com `git c "refactor: move sut creation to a factory helper method"`

### Mocks

Nosso próximo teste terá que checar a validade do email. Para isso, utilizando o princípio do Single Responsability, precisamos de um serviço que faça isso para o controller.

Só que, como ainda não temos a parte da infra, vamos precisar Mockar este serviço.

Como estamos trabalhando com validação de dados, precisamos criar um novo erro. Crie um arquivo em `./src/presentation/errors/invalid-param-error.ts`:
```Typescript
class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`);
    this.name = 'InvalidParamError';
  }
}

export { InvalidParamError };
```

Agora, com o erro já criado, podemos injetar uma dependência. Como não temos um serviço para o EmailValidator, precisamos definir uma interface que descreva como irá funcionar o `EmailValidator`.

Vamos então criar um arquivo em `./src/presentation/protocols/email-validator.ts`:
```Typescript
interface EmailValidator {
  isValid(email: string): boolean;
}

export { EmailValidator };
```

Agora, com a interface criada, podemos colocar o serviço no controller. Porém, estamos trabalhando com TDD, ou seja, primeiro precisamos criar os testes.

Como já temos um `factory` para instanciar o Controller, vamos utilizar o mesmo princípio para mockar o serviço:

No nosso arquivo `signup.spec.ts`:
```Typescript
interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};
```

1. Temos uma classe `EmailValidatorStub` que implementa a nossa interface `EmailValidator`.
2. O método `isValid` ele irá sempre retornar `true`, pois evidentemente, por default os testes precisam ser aprovados, portanto, precisamos passar sempre o valor onde a condição é atendida.
3. Criamos uma variável `emailValidatorStub` para instanciar a nossa classe criada
4. Enviamos o nosso mock para o controller

**OBS: O sufixo `Stub` está atribuido aos arquivos Dublês de Testes, que mockam as suas funcionalidades para poderem testar arquivos que implementem este serviço.**

Agora, podemos alterar o nosso arquivo `signup.ts`:
```Typescript
import { MissingParamError } from '../errors/missing-param-error';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';

class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const emailIsValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!emailIsValid) {
      return badRequest(new InvalidParamError('email'));
    }

    return {
      statusCode: 200,
      body: {},
    };
  }
}

export { SignUpController };
```

1. Perceba que criamos um construtor para implementar o serviço e atribuímos o input em uma variável.
2. Após a verificação dos dados em `requiredFields`, invocamos o método `isValid` e atribuímos o seu retorno à variável `emailIsValid`.
3. Caso não seja válido, retornamos uma `badRequest` passando um `InvalidParamError`.

