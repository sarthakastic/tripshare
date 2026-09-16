export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number | null = null,
    readonly retryable = true,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
