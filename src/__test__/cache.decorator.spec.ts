import { Cacheable, CacheEvict, CachePut } from '@cache/cache.decorator';

let recore: any;

class TestCastTarget {
  private number = 0;

  @Cacheable('testKey')
  async get() {
    recore = 'get';
    this.number += 1;
    return this.number;
  }

  @CachePut('testKey')
  async update() {
    this.number += 1;
    return this.number;
  }

  @CacheEvict('testKey')
  async delete() { }
}

describe('@CachePut Test', () => {
  let instance: TestCastTarget;
  beforeAll(() => instance = new TestCastTarget());

  it('should always execute function', async () => {
    const result1 = await instance.update();
    const result2 = await instance.update();
    expect(result1 + 1).toBe(result2);
  });

  it('should be reset cache when function return', async () => {
    await instance.update();
    const result1 = await instance.get();
    await instance.update();
    const result2 = await instance.get();
    expect(result1 + 1).toBe(result2);
  });
});

describe('@Cacheable Test', () => {
  let instance: TestCastTarget;
  beforeAll(() => instance = new TestCastTarget());

  it('should execute function when not cached', async () => {
    await instance.delete();
    await instance.get();
    expect(recore).toBe('get');
  });

  it('should not execute function when cached', async () => {
    recore = null;
    await instance.get();
    expect(recore).toBeNull();
  });

  it('should be reset cache when function return', async () => {
    const result1 = await instance.get();
    const result2 = await instance.get();
    expect(result1).toBe(result2);
  });
});

describe('@CacheEvict Test', () => {
  let instance: TestCastTarget;
  beforeAll(() => instance = new TestCastTarget());

  it('should be clear cache when function return', async () => {
    await instance.delete();
    const result1 = await instance.get();
    await instance.delete();
    const result2 = await instance.get();
    expect(result1 + 1).toBe(result2);
  });
});
