import { Inject, Injectable, Optional, rootContainer } from '@lattice/core';

import { CacheMemoryBackend } from './cache.memory.backend';
import { CacheBackend } from './interface';

export const CACHE_BACKEND = '__cache_backend__';

@Injectable(CacheProvider, 'root')
export class CacheProvider {
  private loaded: boolean = false;

  constructor(
    @Inject(CACHE_BACKEND)
    @Optional()
    private backend: CacheBackend,
  ) {
    if (!this.backend) {
      rootContainer.bind(CACHE_BACKEND).to(CacheMemoryBackend).inSingletonScope();
      this.backend = rootContainer.get(CACHE_BACKEND);
    }
  }

  async getBackend() {
    if (!this.loaded) {
      this.loaded = true;
      await this.backend.init();
    }
    return this.backend;
  }
}
