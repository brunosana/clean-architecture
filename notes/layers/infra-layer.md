## Infra Layer

> Camada responsável por implementar os casos de uso do Data Layer

### Protocolo Encrypter

Para esse sistema, vamos utilizar para implementar o `Encrypter` a lib [Bcrypt](https://www.npmjs.com/package/bcrypt). Portanto, vamos montar primeiro o teste em `./src/infra/criptography/bcrypt-adapter.spec.ts`:
```Typescript
import bcrypt from 'bcrypt';

interface SutTypes {
  sut: BcryptAdapter;
}

const salt = 12;
const makeSut = (): SutTypes => {
  const sut = new BcryptAdapter(salt);
  return {
    sut,
  };
};

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', async () => {
    const { sut } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });
});

```

Perceba que agora temos um pacote novo, para produção, o `Bcrypt`, instalada junto com os seus tipoes (`@types/bcrypt`).

Com as libs instaladas, vamos agora criar o adapter `bcrypt-adapter.ts`:
```Typescript
import bcrypt from 'bcrypt';
import { Encrypter } from '../../data/protocols/encrypter';

class BcryptAdapter implements Encrypter {
  private readonly salt: number;

  constructor (salt: number) {
    this.salt = salt;
  }

  async encrypt (value: string): Promise<string> {
    await bcrypt.hash(value, this.salt);
    return await new Promise(resolve => resolve(''));
  }
}

export { BcryptAdapter };
```

Com o adapter pronto, podemos configurar a importação no arquivo de teste e commitar.