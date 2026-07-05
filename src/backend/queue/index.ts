export type QueueJob<TPayload = unknown> = {
  id: string;
  name: string;
  payload: TPayload;
  createdAt: Date;
};

export class InMemoryQueue<TPayload = unknown> {
  private readonly jobs: QueueJob<TPayload>[] = [];

  enqueue(job: QueueJob<TPayload>) {
    this.jobs.push(job);
    return job;
  }

  dequeue() {
    return this.jobs.shift() ?? null;
  }
}
