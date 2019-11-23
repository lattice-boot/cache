import { injectable } from 'inversify';

import { CacheBackend } from './interface';

@injectable()
export class CacheMemoryBackend implements CacheBackend {
  private cache: any = {};
  private expireMat: any = {};

  init(): void | Promise<void> { }

  get<T = any>(key: string): T | Promise<T> {
    if (this.expireMat[key] && this.expireMat[key] < Date.now()) {
      delete this.expireMat[key];
      delete this.cache[key];
    }
    return this.cache[key];
  }

  set<T = any>(key: string, value: T, expire?: number): T | Promise<T> {
    this.cache[key] = value;
    if (expire) this.expireMat[key] = Date.now() + expire;
    return this.cache[key];
  }

  del<T = any>(key: string): T | Promise<T> {
    const value = this.cache[key];
    delete this.cache[key];
    return value;
  }
} 
