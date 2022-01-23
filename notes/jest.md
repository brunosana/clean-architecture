## Jest

Vamos alterar o arquivo `package.json` para inserir os seguintes scripts:
```JSON
{
    "scripts": {
        "test": "jest --passWithNoTests --silent --noStackTrace --runInBand",
        "test:verbose": "jest --passWithNoTests --runInBand",
        "test:unit": "npm test -- --watch -c jest-unit-config.js",
        "test:integration": "npm test -- --watch -c jest-integration-config.js",
        "test:staged": "npm test -- --findRelatedTests",
        "test:ci": "npm test -- --coverage",
        "pre-commit": "lint-staged"
    },
}
```

1. A flag `--silent` faz com que o Jest não exiba os testes unitários dos arquivos para deixar mais clean.
2. A flag `--noStackTrace` faz com que o Jest não exiba a linha onde o teste ocorreu o erro.
3. A flag `--runInBand` faz com que o Jest execute os testes de forma sequencial e não paralela, vai ser útil quando trabalharmos com testes de integração.
4. Utilizamos nos testes o trecho `npm test` como herança do script `test`.
5. Nos testes unitários, utilizamos a flag `--watch` e a flag `-c` passando um arquivo de configuração personalizado
6. Nos testes de integração, utilizamos a flag `--watch` e a flag `-c` passando um arquivo de configuração personalizado
7. No script `test:staged` a flag `--findRelatedTests` serve para rodar apenas os testes relacionados aos arquivos modificados. No futuro, com vários arquivos de testes, isso evita commits lentos.
8. Para testes de Integração Contínua, será interessante rodar todos os testes, e validarmos com o coverage, por isso estamos inserindo a flag `--coverage`.

**PS: Note que em testes unitários, onde vamos utilizar o sufixo `.spec.ts`, queremos que o Jest analize apenas os arquivos `.spec.ts`. Para testes de integração, sufixo `.test.ts`. Daí a necessidade de passar arquivos de configurações diferentes. E eles são simples de alterar:**

`jest-unit-config.js`:
```Javascript
const config = require('./jest.config');

config.testMatch = ['**/**.spec.ts'];

module.exports = config;
```

`jest-integration-config.js`:
```Javascript
const config = require('./jest.config');

config.testMatch = ['**/**.test.ts'];

module.exports = config;
```

Com isso, podemos agora inserir um outro hook no `Husky.json`:
```JSON
{
    "hooks": {
        "pre-commit": "lint-staged",
        "pre-push": "npm run test:ci"
    }
}
```

E um novo arquivo em `.husky/pre-push`:
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:ci
```

---

### Coverage Reports

Alguns arquivos estão entrando na validação do Coverage Reports do Jest (Arquivos de interface, de exportação etc.). Para solucionar esse problema, nosso arquivo `jest.config.js` precisa ficar assim:
```Javascript
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!**/protocols/**',
    '!**/test/**',

  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
```

Estamos assim, excluindo os diretórios onde não temos arquivos de testes necessários para o coverage reports entrar em ação.

Podemos commitar agora.

Próxima Leitura: [Data Layer](./data-layer)