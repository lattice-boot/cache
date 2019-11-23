import 'reflect-metadata';

import { injectable } from 'inversify';

import { CacheMemoryBackend } from '@cache/cache.memory.backend';
import { CACHE_BACKEND, CacheProvider } from '@cache/cache.provider';
import { CacheBackend } from '@cache/interface';
import { rootContainer } from '@lattice/core';

describe('CacheProvider Test', () => {
  let initTag = false;

  @injectable()
  class TestBackend implements CacheBackend {
    init(): void | Promise<void> {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          initTag = true;
          resolve();
        }, 1000);
      });
    }
    get<T = any>(key: string): T | Promise<T> {
      return 'test' as any;
    }
    set<T = any>(key: string, value: T): T | Promise<T> {
      return 'test' as any;
    }
    del<T = any>(key: string): T | Promise<T> {
      return 'test' as any;
    }
  }

  it('should be bound when importing', () => {
    expect(rootContainer.isBound(CacheProvider)).toBe(true);
  });

  it('should be bind CacheMemoryBackend to CACHE_BACKEND when CACHE_BACKEND unbound', () => {
    const instance = rootContainer.get(CacheProvider);
    expect(rootContainer.get(CACHE_BACKEND)).toBeInstanceOf(CacheMemoryBackend);
  });

  it('should construct TestBackend with CACHE_BACKEND', async () => {
    rootContainer.unbind(CACHE_BACKEND);
    rootContainer.bind(CACHE_BACKEND).to(TestBackend);
    rootContainer.unbind(CacheProvider);
    rootContainer.bind(CacheProvider).toSelf();
    const instance = rootContainer.get(CacheProvider);
    const backend = await instance.getBackend();
    expect(backend).toBeInstanceOf(TestBackend);
  });

  it('should init backend when first get', async () => {
    initTag = false;
    rootContainer.unbind(CacheProvider);
    rootContainer.bind(CacheProvider).toSelf();
    const instance = rootContainer.get(CacheProvider);
    expect(initTag).toBe(false);
    await instance.getBackend();
    expect(initTag).toBe(true);
  });

  it('should get single instance backend', async () => {
    const instance = rootContainer.get(CacheProvider);
    const backend1 = await instance.getBackend();
    const backend2 = await instance.getBackend();
    expect(backend1).toBe(backend2);
  });
});
