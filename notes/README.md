## Iniciando uma API Clean Architecture

### Git Alias

Para criar atalhos de comando no github (que é utilizado nesse documento), recomendo a leitura do arquivo [git.md](./git.md)

### Configurando GIT e NPM

1. Iniciamos um repositório git com `git init` no terminal
2. Instalamos o NPM com `npm init -y` (ou Yarn, caso prefira)

Podemos agora comitar as alterações:

### Padrões de Commits

**OBS: Vamos utilizar comandos personalizados do git, para saber mais, acesse o arquivo [git.md](./git.md).**

**OBS: Vamos utilizar uma parte do padrão do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), seguindo a lógica do `[type]: <subject>`.**

1. Podemos comitar agora com `git c "chore: add npm"` (Lembrando do padrão, sem pontuação, letra minúscula, verbo no imperativo, espaço após os dois pontos etc).


Podemos também utilizar uma lib que garante que os nossos commits vão sempre pertencer a esse padrão, checando de forma automática, a lib é a [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter).

2. Vamos instalar a lib então com `npm install -D git-commit-msg-linter`
3. Como nós temos um pacote instalado, o _npm_ cria a pasta `node_modules`. Precisamos ignorá-la:

Para ignorar, crie um arquivo `.gitignore`:

```
node_modules
```


Feita essa alteração, vamos agora commitar a alteração com `git c "chore: add commit linter"`

### Typescript

1. Vamos instalar as dependências com ` npm i -D typescript @types/node`
  * _Typescript_ é a dependência que vamos utilizar para desenvolver em TS
  * _@types/node_ é a dependência que tipa os módulos base do NodeJS
2. Vamos iniciar o typescript criando um arquivo na raiz do diretório chamado `tsconfig.json`


O tsconfig ficará assim:
```JSON
{
    "compilerOptions": {
        "outDir": "./dist",
        "module": "commonjs",
        "target": "ES2019",
        "esModuleInterop": true,
        "allowJs": true
    }
}
```

1. `outDir` é onde ficará a pasta do Build
2. `module` é como o Typescript irá converter para commonjs ao final da conversão para .js
3. `target` é a versão que em que o Typescript irá converter (Você pode acessar o mapa de compatibilidades em [Node Green](https://node.green/))
4. `esModuleInterop` força a sintaxe de _import from_ funcionar
5. `allowJs` inclui ou não os arquivos _.js_ na pasta _./dist_ que são utilizados em _./src_


Adicione ao `.gitignore`:
```
dist
```

Feita essa alteração, vamos agora commitar a alteração com `git c "chore: add typescript"`

### Padrão de código

Podemos utilizar um padrão de código, para garantir que a formatação ocorra de forma correta. Visando solucionar esse problema, temos o [JavaScript Standard Style](https://standardjs.com/).

Essa lib é voltada para JS, para contornar esse problema, podemos usar o `ESLint` para configurar o StandardJS pelo [link do GitHub](https://github.com/standard/eslint-config-standard-with-typescript).

Depois de instaladas as libs, vamos criar um arquivo `.eslintrc.json`:
```JSON
{
    "extends": "standard-with-typescript",
    "rules": {
        "semi": "off",
        "@typescript-eslint/semi": ["error", "always"],
        "comma-dangle": ["error", "always-multiline"]
    },
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

1. Vamos utilizar o `extends` para capturar todas as regras de código do package StandardJS
2. O `parseOptions` vamos atribuir o arquivo `tsconfig.json` que criamos
3. Como opcional, eu atribuo em `rules` a obrigatoreidade do uso do ponto e vírgula e o uso da vírgula em objetos multi linhas


Vamos criar um arquivo `.eslintignore`:
```
node_modules
dist
```

Por fim, comitamos a alteração com `git c "chore: add eslint"`

### Husky e Lint Staged

Para garantir que todo código que seja adicionado ao Git ou Github esteja correspondendo aos padrões que definimos, podemos usar o [Husky](https://www.npmjs.com/package/husky) para criar uma ponte entre o arquivo e o commit que faça algumas verificações.

Vamos instalar com `npm i -D husky`.

Vamos iniciar o husky com `npx husky install`, irá criar a pasta `.husky`

Como vamos utilizar o ESLint para formatar sempre antes de cada commit, podemos ter um gargalo na performance quando estivermos trabalhado com muitos arquivos. Para resolver esse problema, vamos utilizar uma lib que garante que a verificação aconteça apenas nos arquivos que estivermos adicionando ao commit. O nome da lib é `lint-staged`.

Vamos instalar com `npm i -D lint-staged`

Vamos então criar um arquivo de configuração `.lintstagedrc.json`:
```JSON
{
    "*.ts": [
        "eslint 'src/**' --fix"
    ]
}
```

Isso garante que vamos pegar todos os arquivos modificados, vamos verificar se está de acordo, e com a flag `fix` o eslint irá tentar consertar. Caso ele consiga, é executado o comando `git add` para adicionar o arquivo novamente com a alteração. Quando ocorre um erro, o commit não irá acontecer.

Vamos usar o comando `npx husky add .husky/pre-commit "npm run pre-commit"`. para atribuir ao Husky o hook de pré commit chamando o `lint-staged`. Para isso, vamos criar um script em `package.json`:
```JSON
  "scripts": {
    "pre-commit": "lint-staged"
  },
```


Se você usa o git-commit-msg-linter, podemos integrar com o husky inserindo `npx husky add .husky/commit-msg ".git/hooks/commit-msg $1"` no terminal.

Após isso, vamos alterar o arquivo `.husky/commit-msg`:
```
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

.git/hooks/commit-msg S1
```


Por fim, comitamos a alteração com `git c "chore: add husky and lint staged"`


### Jest

Precisamos de uma lib para testar as funcionalidades.

Vamos começar com `npm i -D jest @types/jest ts-jest`, para instalar o jest e as dependências necessárias para construir testes com arquivos .ts.

Vamos iniciar a configuração do jest com `jest --init`:

1. Sim para alterar o script do `package.json`
2. Node para escolher o ambiente de testes enquanto os testes forem feitos
3. Sim, adicionar o Coverage Reports, para controlar os arquivos que estão ou não cobertos por testes
4. Não, não vamos limpar as chamadas mockadas entre testes

Com isso, temos um arquivo `jest.config.js`. Vamos formatar ele e deixar dessa forma:

```js
module.exports = {
  roots: ['<rootDir>/src'],

  collectCoverage: true,

  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
```

Definimos essas propriedades, em especial a `transform`, que vamos mapear os arquivos `.ts` para utilizar a lib `ts-jest` para que os nossos testes funcionem.

Por fim, comitamos a alteração com `git c "chore: add jest"`

---

Agora, o próximo passo é a leitura do arquivo [tdd.md](./tdd.md)
