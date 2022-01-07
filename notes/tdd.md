## Test Driven Development

Para um desenvolvimento orientado a testes, nós vamos populando primeiro o arquivo de testes com testes unitários, e logo após, populando o controller para que os testes sejam atendidos.

Vamos criar um arquivo `src/presentation/controllers/signup.spec.ts`:
```typescript
import { SignUpController } from './signup';

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'passhere',
        passwordConfirmation: 'passhere',
      },
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
  });
});
```

**OBS: A sigla _sut_ significa _System Under Test_ - Nomeclatura da classe onde estamos testando.**

Perceba que estamos criando um arquivo com apenas um teste, onde espera receber um httpResponse contendo um statusCode de _400_.

Nós não temos nenhum outro arquivo, mas perceba a nossa importação lá em cima: precisamos de um arquivo no mesmo diretório que criamos o teste com o nome `signup.ts`:
```typescript
class SignUpController {
  handle (httpRequest: any): any {
    return {
      statusCode: 400,
    };
  }
}

export { SignUpController };
```

Agora, ao executar o `npm test`, podemos verificar que o teste é atentido.

---

### Commitando

Por padrão, ao realizar um commit utilizando TDD, primeiro comenta-se a funcionalidade adicionada (caso seja a primeira vez, entra como o type: feat), e logo após, o teste (com o type: test).

Vamos então, acrescentar o script `test:staged` no arquivo `package.json`:
```JSON
"test:staged": "jest --passWithNoTests",
```

E no arquivo `.lintstagedrc.json`:
```JSON
{
    "*.ts": [
        "eslint './src/**' --fix",
        "npm run test:staged"
    ]
}
```

Dessa forma, conseguimos executar a verificação de testes antes de commitar.

Agora, vamos adicionar os arquivos `package.json`, `.lintstagedrc.json` e `signup.ts` à staging area e commitar com:

```bash
git commit -m "feat: ensure SignUpController returns 400 if no name is provided"
```

Com isso, estamos inserindo uma nova feature implementada a um teste específico.

Adicionamos agora o arquivo `signup.spec.ts` e commitamos:

```bash
git commit -m "test: ensure SignUpController returns 400 if no name is provided"
```

Próximo tópico: [Tipagem.md](./tipagem.md)