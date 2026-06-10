import { Tipo } from '@/types/types';
import { db } from '../db';

export const TipoRepository = {

  getAll(): Tipo[] {
    const rows = db.getAllSync('SELECT * FROM tipos') as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    }));
  },

  getById(id: number): Tipo | null {
    const row = db.getFirstSync(
      'SELECT * FROM tipos WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    };
  },

  save(t: Tipo) {
    db.runSync(
      `INSERT OR REPLACE INTO tipos (id, codigo, designacao)
       VALUES (?, ?, ?)`,
      [t.id, t.codigo, t.designacao]
    );
  },

  saveMany(items: Tipo[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO TIPO', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM tipos');
  }
};