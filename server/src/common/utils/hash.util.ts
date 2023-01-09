import * as bcrypt from 'bcrypt';

export const hashData = (data: string): Promise<string> => bcrypt.hash(data, 5);

export const compareHash = (data: string, hash: string): Promise<boolean> =>
  bcrypt.compare(data, hash);
