import { db } from "./db"; // ajusta o caminho conforme o teu projecto

export interface Rascunho {
  id?: number;
  dados: string;
  sincronizado: number;
  criado_em: string;
}

export class RascunhoRepository {

  static createTable() {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS rascunhos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dados TEXT NOT NULL,
        sincronizado INTEGER DEFAULT 0,
        criado_em TEXT NOT NULL
      );
    `);
  }

  static create(payload: any) {
    const stmt = db.prepareSync(`
      INSERT INTO rascunhos (
        dados,
        sincronizado,
        criado_em
      )
      VALUES (?, ?, ?)
    `);

    try {
      const result = stmt.executeSync(
        JSON.stringify(payload),
        0,
        new Date().toISOString()
      );

      return result;
    } finally {
      stmt.finalizeSync();
    }
  }

  static getAll(): Rascunho[] {
    const stmt = db.prepareSync(`
      SELECT *
      FROM rascunhos
      ORDER BY criado_em DESC
    `);

    try {
      return stmt.executeSync().getAllSync() as Rascunho[];
    } finally {
      stmt.finalizeSync();
    }
  }

  static getNaoSincronizados(): Rascunho[] {
    const stmt = db.prepareSync(`
      SELECT *
      FROM rascunhos
      WHERE sincronizado = 0
      ORDER BY criado_em ASC
    `);

    try {
      return stmt.executeSync().getAllSync() as Rascunho[];
    } finally {
      stmt.finalizeSync();
    }
  }

  static marcarSincronizado(id: number) {
    const stmt = db.prepareSync(`
      UPDATE rascunhos
      SET sincronizado = 1
      WHERE id = ?
    `);

    try {
      stmt.executeSync(id);
    } finally {
      stmt.finalizeSync();
    }
  }

  static delete(id: number) {
    const stmt = db.prepareSync(`
      DELETE FROM rascunhos
      WHERE id = ?
    `);

    try {
      stmt.executeSync(id);
    } finally {
      stmt.finalizeSync();
    }
  }

  static deleteAll() {
    db.execSync(`
      DELETE FROM rascunhos
    `);
  }

  static getById(id: number): Rascunho | null {
    const stmt = db.prepareSync(`
      SELECT *
      FROM rascunhos
      WHERE id = ?
      LIMIT 1
    `);

    try {
      const result = stmt.executeSync(id).getFirstSync();

      return result ? (result as Rascunho) : null;
    } finally {
      stmt.finalizeSync();
    }
  }
}