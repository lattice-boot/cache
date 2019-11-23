
export interface CacheBackend {
  init(): Promise<void> | void;
  get<T = any>(key: string): Promise<T> | T;
  set<T = any>(key: string, value: T, expire?: number): Promise<T> | T;
  del<T = any>(key: string): Promise<T> | T;
}
