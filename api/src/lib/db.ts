import { createDb, type Db } from "@nomad/db";

type Holder = ReturnType<typeof createDb>;

let _holder: Holder | null = null;

export function getHolder(): Holder {
  if (!_holder) {
    _holder = createDb();
  }
  return _holder;
}

export function getDb(): Db {
  return getHolder().db;
}
