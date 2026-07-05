export type HistoryRecord = {
  id: string;
  userId?: string;
  toolSlug: string;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
};

export class HistoryRepository {
  private readonly history = new Map<string, HistoryRecord>();

  async create(record: HistoryRecord) {
    this.history.set(record.id, record);
    return record;
  }

  async findByUserId(userId: string) {
    return [...this.history.values()].filter((item) => item.userId === userId);
  }

  async findByToolSlug(toolSlug: string) {
    return [...this.history.values()].filter(
      (item) => item.toolSlug === toolSlug,
    );
  }
}
