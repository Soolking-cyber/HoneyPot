declare module "@react-native-async-storage/async-storage" {
  type StorageValue = string | null;
  type KeyValueTuple = [string, StorageValue];

  interface AsyncStorageShape {
    getItem(key: string): Promise<StorageValue>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
    getAllKeys(): Promise<string[]>;
    multiGet(keys: readonly string[]): Promise<KeyValueTuple[]>;
    multiSet(entries: readonly KeyValueTuple[]): Promise<void>;
    multiRemove(keys: readonly string[]): Promise<void>;
  }

  const AsyncStorage: AsyncStorageShape;

  export default AsyncStorage;
  export const getItem: AsyncStorageShape["getItem"];
  export const setItem: AsyncStorageShape["setItem"];
  export const removeItem: AsyncStorageShape["removeItem"];
  export const clear: AsyncStorageShape["clear"];
  export const getAllKeys: AsyncStorageShape["getAllKeys"];
  export const multiGet: AsyncStorageShape["multiGet"];
  export const multiSet: AsyncStorageShape["multiSet"];
  export const multiRemove: AsyncStorageShape["multiRemove"];
}

declare module "pino-pretty" {
  type PrettyOptions = Record<string, unknown>;

  interface PrettyStream {
    write(chunk: unknown): void;
  }

  export default function pinoPretty(options?: PrettyOptions): PrettyStream;
}

