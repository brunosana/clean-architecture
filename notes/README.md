## Iniciando uma API Clean Architecture

### Configurando GIT e NPM

1. Iniciamos um repositório git com `git init` no terminal
2. Instalamos o NPM com `npm init -y` (ou Yarn, caso prefira)

Podemos agora comitar as alterações:

### Padrões de Commits

**OBS: Vamos utilizar uma parte do padrão do [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), seguindo a lógica do `[type]: <subject>`.**

1. Podemos comitar agora com `git c "chore: add npm"` (Lembrando do padrão, sem pontuação, letra minúscula, verbo no imperativo, espaço após os dois pontos etc).


Podemos também utilizar uma lib que garante que os nossos commits vão sempre pertencer a esse padrão, checando de forma automática, a lib é a [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter).

2. Vamos instalar a lib então com `npm install -D git-commit-msg-linter`