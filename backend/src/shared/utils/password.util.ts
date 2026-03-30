import * as bcrypt from 'bcryptjs';

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plain, ROUNDS, (err, hash) => {
      if (err) reject(err);
      else resolve(hash);
    });
  });
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plain, hash, (err, same) => {
      if (err) reject(err);
      else resolve(!!same);
    });
  });
}
