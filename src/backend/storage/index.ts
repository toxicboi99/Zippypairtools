export type StoredObject = {
  key: string;
  contentType: string;
  data: Uint8Array;
};

export class MemoryStorage {
  private readonly objects = new Map<string, StoredObject>();

  put(object: StoredObject) {
    this.objects.set(object.key, object);
    return object;
  }

  get(key: string) {
    return this.objects.get(key) ?? null;
  }

  delete(key: string) {
    return this.objects.delete(key);
  }
}
