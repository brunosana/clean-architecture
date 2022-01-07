## Tipagem e Errors

Não é uma boa prática manter objetos do tipo `any` no seu código, pois não fornece as garantias necessárias para uma boa arquitetura e desenvolvimento. Portanto, todo objeto deve ser tipado!

Vamos começar agora criando uma interface para tipar o objeto do tipo `http`.

Antes, vamos apenas modificar o arquivo `.eslintrc.json` inserindo esse trecho em `rules`:
```JSON
"@typescript-eslint/member-delimiter-style": ["error", {
    "overrides": {
        "interface": {
            "multiline": {
                "delimiter": "semi",
                "requireLast": true
            },
            "singleline": {
                "delimiter": "semi",
                "requireLast": true
            }
        }
    }
}]
```

Essa regra obriga o uso do ponto e vírgula para separar as propriedades das interfaces por ponto e vírgula.


Crie um arquivo em `./src/presentaion/protocols/http.ts`:
```Typescript
interface HttpResponse {
  statusCode: number;
  body: any;
}

interface HttpRequest {
  body?: any;
}

export { HttpResponse, HttpRequest };
```

Agora, podemos importar as interfaces no `signup.ts`:
```Typescript
import { HttpRequest, HttpResponse } from '../protocols/http';

class SignUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name'),
      };
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email'),
      };
    }
    return {
      statusCode: 200,
      body: {},
    };
  }
}

export { SignUpController };
```

Dessa forma, temos a entrada e a saída tipadas.


### Erros

Não é uma boa prática retornar erros genéricos (Error) em qualquer lugar da aplicação. Para suprir essa necessidade, podemos criar classes para tipos específicos de erros, para melhorar a consistência, confiabilidade e clareza no código.

Portanto, vamos criar um tipo de erro para a falta de um parâmetro no sistema, o `MissingParamError`.

Crie um arquivo em `./src/presentation/errors/missing-param-error.ts`:
```Typescript
class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamError';
  }
}

export { MissingParamError };
```

Você pode ver que temos um erro específico, que recebe o parâmetro que falta e constrói um _Error_ com a propriedade _name_ setada como o nome do Erro.

Agora, em `signup.ts`, todos os retornos envolvendo a falta de parâmetros nós fazemos dessa forma:
```Typescript
return {
    statusCode: 400,
    body: new MissingParamError('<Parametro>'),
};
```

Assim o código fica mais legível e mais consistente. Como mudamos uma parte da funcionalidade do controller, precisamos alterar o nosso arquivo de testes também. Em `signup.spec.ts`, em todas as linhas onde se espera um _Error_ por falta de parâmetro, vamos substituir por:
```Typescript
expect(httpResponse.body).toEqual(new MissingParamError('<Parametro>'));
```
---
Há ainda, uma outra forma de melhorar a consistência e clareza do código. Perceba que quando temos um erro de falta de parâmetro, ele pode ser configurado como uma `Bad Request`, ocasionando no _statusCode_ do Erro sempre ser _400_. Identificamos um padrão que pode ser repetido várias vezes.

Com isso, nós podemos criar um _helper_ para o http e encapsular esses tipos de retorno.

Crie um arquivo em `./src/presentation/helpers/http-helper.ts`:
```Typescript
import { HttpResponse } from '../protocols/http';

const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error,
});

export { badRequest };
```

Isso significa que, sempre que tivermos uma Bad Request, podemos invocar apenas o médoto `badRequest` que ele se encarregará, tanto de atribuir o status code, como atribuir o erro no _body_.

Podemos refatorar os trechos onde ocorre o retorno de uma bad request para:
```Typescript
if (!httpRequest.body.<Parametro>) {
    return badRequest(new MissingParamError('<Parametro>'));
}
```

