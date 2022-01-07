### Tipagem e Errors

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