export class AppointmentNote {
  constructor(
    public readonly id: string,
    public readonly authorId: string,
    public readonly content: string,
    public readonly createdAt: Date,
  ) {}

  static create(authorId: string, content: string): AppointmentNote {
    return new AppointmentNote(crypto.randomUUID(), authorId, content, new Date());
  }
}
