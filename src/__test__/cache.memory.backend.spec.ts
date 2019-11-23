import 'reflect-metadata';

import { CacheMemoryBackend } from '@cache/cache.memory.backend';

describe('CacheMemoryBackend Test', () => {
  let instance: CacheMemoryBackend;

  beforeAll(() => {
    instance = new CacheMemoryBackend();
  });

  it('should be construct', () => {
    expect(instance).toBeTruthy();
  });

  it('should be init', async () => {
    let exception: any;
    try {
      await instance.init();
    } catch (error) {
      exception = error;
    }
    expect(exception).not.toBeTruthy();
  });

  it('should be set value', async () => {
    const result = await instance.set('testKey', 'hello');
    expect(result).toBe('hello');
  });

  it('should be get value', async () => {
    const result = await instance.get('testKey');
    expect(result).toBe('hello');
  });

  it('should be return undefine with inexactly key', async () => {
    const result = await instance.get('testKey1');
    expect(result).toBeUndefined();
  })

  it('should be delete cache and return value with key', async () => {
    const result = await instance.del('testKey');
    expect(result).toBe('hello');
  });

  it('should not get value by removed cache', async () => {
    const result = await instance.get('testKey');
    expect(result).toBeUndefined();
  });

  it('should chache memory expire', async () => {
    await instance.set('expireKey', '2333', 1000);
    const target1 = await instance.get('expireKey');
    await sleep(1000);
    const target2 = await instance.get('expireKey');
    expect(target1).toBe('2333');
    expect(target2).toBeUndefined();
  });
});

export function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
