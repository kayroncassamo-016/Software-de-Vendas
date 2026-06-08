import { db } from './db';

export function initDatabase() {

  db.execSync(`
  
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      telefone TEXT,
      email TEXT,
      synced INTEGER DEFAULT 0
    );

  `);

}