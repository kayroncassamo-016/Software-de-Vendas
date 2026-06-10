import { Categoria } from '@/types/types';
import { db } from '../db';

export const CategoriaRepository = {

  getAll(): Categoria[] {
    const rows = db.getAllSync('SELECT * FROM categorias') as any[];

    return rows.map(row => ({
      id: row.id,
      descricao: row.descricao,
      designacao: row.designacao,
    }));
  },

  getById(id: number): Categoria | null {
    const row = db.getFirstSync(
      'SELECT * FROM categorias WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      descricao: row.descricao,
      designacao: row.designacao,
    };
  },

  save(c: Categoria) {
    db.runSync(
      `INSERT OR REPLACE INTO categorias (id, descricao, designacao)
       VALUES (?, ?, ?)`,
      [c.id, c.descricao, c.designacao]
    );
  },

  saveMany(items: Categoria[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO CATEGORIA', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM categorias');
  }
};