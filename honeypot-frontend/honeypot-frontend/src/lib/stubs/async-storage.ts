type StorageValue = string | null;

type KeyValueTuple = [string, StorageValue];

const AsyncStorage = {
  async getItem(_key: string): Promise<StorageValue> {
    void _key;
    return null;
  },
  async setItem(_key: string, _value: string): Promise<void> {
    void _key;
    void _value;
  },
  async removeItem(_key: string): Promise<void> {
    void _key;
  },
  async clear(): Promise<void> {},
  async getAllKeys(): Promise<string[]> {
    return [];
  },
  async multiGet(keys: readonly string[]): Promise<KeyValueTuple[]> {
    return keys.map((key) => [key, null]);
  },
  async multiSet(_entries: readonly KeyValueTuple[]): Promise<void> {
    void _entries;
  },
  async multiRemove(_keys: readonly string[]): Promise<void> {
    void _keys;
  },
};

export default AsyncStorage;
export const {
  getItem,
  setItem,
  removeItem,
  clear,
  getAllKeys,
  multiGet,
  multiSet,
  multiRemove,
} = AsyncStorage;
