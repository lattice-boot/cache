import { analysisKey, getBackendInstance } from './utils';

export function CachePut(key: string, expire?: number) {
  return (target: any, targetKey: string, desc: PropertyDescriptor) => {
    const originFunc = target[targetKey];
    desc.value = async function (...args: any[]) {
      const cache = await getBackendInstance();
      const result = await originFunc.apply(this, args);
      const ctx = { prototype: target, method: targetKey, param: args, this: this, result };
      cache.set(analysisKey(key, ctx), result, expire);
      return result;
    };
  };
}

export function Cacheable(key: string, expire?: number) {
  return (target: any, targetKey: string, desc: PropertyDescriptor) => {
    const originFunc = target[targetKey];
    desc.value = async function (...args: any[]) {
      const cache = await getBackendInstance();
      const ctx = { prototype: target, method: targetKey, param: args, this: this };
      key = analysisKey(key, ctx);
      let result = await cache.get(key);
      if (!result) {
        result = await originFunc.apply(this, args);
        cache.set(key, result, expire);
      }
      return result;
    };
  };
}

export function CacheEvict(key: string) {
  return (target: any, targetKey: string, desc: PropertyDescriptor) => {
    const originFunc = target[targetKey];
    desc.value = async function (...args: any[]) {
      const cache = await getBackendInstance();
      const result = await originFunc.apply(this, args);
      const ctx = { prototype: target, method: targetKey, param: args, this: this, result };
      await cache.del(analysisKey(key, ctx));
      return result;
    };
  };
}
