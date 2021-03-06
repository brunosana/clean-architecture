import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => resolve('hashed_value'));
  },
}));

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
  test('Should call bcrypt with correct values', async () => {
    const { sut } = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    const { sut } = makeSut();

    const hash = await sut.encrypt('any_value');
    expect(hash).toBe('hashed_value');
  });

  test('Should throws if bcrypt throws', async () => {
    const { sut } = makeSut();

    // eslint-disable-next-line
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => (new Promise((resolve, reject) => reject(new Error()))));

    const promise = sut.encrypt('any_value');
    await expect(promise).rejects.toThrow();
  });
});
