export interface ErrorException extends Error {
  errno?: number;
  statusCode?: number;
  path?: string;
  syscall?: string;
  stack?: string;
}
