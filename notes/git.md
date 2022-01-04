# GIT

### Intro

Para visualizar as configurações que o git possui na máquina, usamos `git config --list`

Existem ``

1. `--system` - Para todo a máquina e para todo o usuário
2. `--global` - Configurações apenas do usuário
3. `--local` - Configurações do projeto atual


A flag `--edit` podemos editar as configurações:

Inserindo o `git config --global --edit` podemos elterar as configurações em um arquivo. Por padrão, ele abre no `vim`, se quisermos abrir com outro editor, podemos configurar com a linha:

`git config --global core.editor <nome_do_editor>`. No meu caso, usei `git config --global core.editor code` para abrir com o vscode.

Usando o código novamente, ele vai abrir o VSCode.

_É interessante, no `editor`, inserimos a informação `--wait`, para informar ao editor que aguarde o carregamento das configurações antes de abrir o arquivo._

### Alias

Para criar atalhos de comando no Git, vamos editar o arquivo de configurações com a flag `--global`:

Inserir ao final do arquivo:
```
[alias]
	s = !git status -s
	c = !git add --all && git commit -m
	l = !git log --pretty=format:'%C(magenta)%h%C(red)%d %C(white)%s - %C(cyan)%cn %C(magenta)%cr'
```

1. A exclamação é necessária antes do git
2. A flag `-s` serve para exibir um formato simplificado do comando git status. Ou seja, quando quisermos observar a estrutura completa do git status, rodamos o comando literal `git status`.
3. O alias `c` serve para tanto adicionar todos os arquivos como também para commitar, assim não há a necessidade de utilizar o comando `git add .` para commitar.
4. O alias `l` informa o `git log` de uma forma personalizada:
  * `h` - Informa a hash reduzida
  * `d` - Informa a branch (junto com a tag, caso tenha)
  * `s` - Subject, informa o cabeçalho do commit
  * `cn` - Commiter Name, informa quem fez o commit
  * `cr` - Informa a data relativa do commit
  * `%C(<color name>)` - Determina a cor do trecho de mensagem posterior