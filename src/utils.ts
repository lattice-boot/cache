import { rootContainer } from '@lattice/core';

import { CacheProvider } from './cache.provider';

export function getBackendInstance() {
  const provider = rootContainer.get(CacheProvider);
  return provider.getBackend();
}

export function analysisKey(key: string, context: any): string {
  const regx = /.*\{\{(.*?)\}\}.*/;
  if (regx.test(key)) {
    const index = regx.exec(key)![1];
    const value = index.split('.').reduce((target, path) => target ? target[path] : target, context);
    if (!value) throw new Error('Can\'t analysis cache key');
    key = key.replace(new RegExp(`{{${index}}}`, 'g'), value);
    return regx.test(key) ? analysisKey(key, context) : key;
  } else {
    return key;
  }
}
