import { Imposto } from '@/types/types';
import { db } from '../db';

export const ImpostoRepository = {

  getAll(): Imposto[] {
    const rows = db.getAllSync('SELECT * FROM impostos') as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      taxa: row.taxa,
      designacao: row.designacao,
    }));
  },

  getById(id: number): Imposto | null {
    const row = db.getFirstSync(
      'SELECT * FROM impostos WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      taxa: row.taxa,
      designacao: row.designacao,
    };
  },

  save(i: Imposto) {
    db.runSync(
      `INSERT OR REPLACE INTO impostos (id, codigo, taxa, designacao)
       VALUES (?, ?, ?, ?)`,
      [i.id, i.codigo, i.taxa, i.designacao]
    );
  },

  saveMany(items: Imposto[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO IMPOSTO', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM impostos');
  }
};