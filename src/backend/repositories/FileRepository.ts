export type StoredFileRecord = {
  id: string;
  userId?: string;
  fileName: string;
  mimeType: string;
  size: number;
  createdAt: Date;
};

export class FileRepository {
  private readonly files = new Map<string, StoredFileRecord>();

  async create(record: StoredFileRecord) {
    this.files.set(record.id, record);
    return record;
  }

  async findById(id: string) {
    return this.files.get(id) ?? null;
  }

  async deleteById(id: string) {
    return this.files.delete(id);
  }
}
