export type UserRecord = {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
};

export class UserRepository {
  private readonly users = new Map<string, UserRecord>();

  async create(record: UserRecord) {
    this.users.set(record.id, record);
    return record;
  }

  async findById(id: string) {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string) {
    return (
      [...this.users.values()].find((user) => user.email === email) ?? null
    );
  }
}
