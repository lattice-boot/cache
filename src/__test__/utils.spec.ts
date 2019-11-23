import { analysisKey, getBackendInstance } from '@cache/utils';

describe('getBackendInstance Test', () => {
  it('should be return single instance backend', async () => {
    const instance1 = await getBackendInstance();
    const instance2 = await getBackendInstance();
    expect(instance1).toBe(instance2);
  });
});

describe('analysisKey Test', () => {
  it('should be return string with key and context', () => {
    const context = {
      param: [{ id: '233' }],
    };
    const result = analysisKey('test_{{param.0.id}}', context);
    expect(result).toBe('test_233');
  });

  it('should be return string with nesting key and context', () => {
    const context = {
      param: [{ id: '233' }],
      filed: 'id',
    };
    const result = analysisKey('test_{{param.0.{{filed}}}}', context);
    expect(result).toBe('test_233');
  });

  it('should be throw error with wrong key', () => {
    const context = {
      param: [{ id: '233' }],
    };
    let err: Error;
    try {
      analysisKey('test_{{param.1.id}}', context);
    } catch (error) {
      err = error;
    }
    expect(err!.message).toBe('Can\'t analysis cache key');
  });

  it('should be return origin string with normal key any context', () => {
    const context = {
      param: [{ id: '233' }],
      filed: 'id',
    };
    const result = analysisKey('test_hhh', context);
    expect(result).toBe('test_hhh');
  });
});
