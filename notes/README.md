## Iniciando uma API Clean Architecture

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