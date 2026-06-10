import { Familia } from '@/types/types';
import { db } from '../db';

export const FamiliaRepository = {

  getAll(): Familia[] {
    const rows = db.getAllSync('SELECT * FROM familias') as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    }));
  },

  getById(id: number): Familia | null {
    const row = db.getFirstSync(
      'SELECT * FROM familias WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    };
  },

  save(f: Familia) {
    db.runSync(
      `INSERT OR REPLACE INTO familias (
        id, codigo, designacao
      ) VALUES (?, ?, ?)`,
      [
        f.id,
        f.codigo,
        f.designacao,
      ]
    );
  },

  saveMany(items: Familia[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO FAMILIA', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM familias');
  }
};