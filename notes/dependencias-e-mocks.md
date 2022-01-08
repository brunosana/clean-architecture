## Dependências e Mocks

Antes de introduzir os conceitos e aplicações de dependências, vamos remover o código duplicado dos testes. Todo teste, precisamos de um _System Under Test_, ou um _SUT_, e todo teste nós instanciamos um novo. No futuro, com o Controller dependendo de vários outros serviços, vai ficar insustentável ficar instanciando toda vez.

Portanto, em `signup.spec.ts`, vamos refatorar isso utilizando um factory:
```Typescript
interface TestController {
  sut: SignUpController;
}

const makeSut = (): TestController => {
  const sut = new SignUpController();
  return { sut };
};
```

Agora, temos um método que instancia o nosso SUT e certamente, sempre que precisarmos de um novo serviço, instanciamos o mesmo dessa forma.

Agora, substituímos os trechos de criação de instância nos testes por `const { sut } = makeSut();`;
