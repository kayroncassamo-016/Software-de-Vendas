import { Marca } from '@/types/types';
import { db } from '../db';

export const MarcaRepository = {

  getAll(): Marca[] {
    const rows = db.getAllSync('SELECT * FROM marcas') as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      nome: row.nome,
      desconto_comercial: row.desconto_comercial,
      data_vencimento: row.data_vencimento,
      limite_credito: row.limite_credito,
    }));
  },

  getById(id: number): Marca | null {
    const row = db.getFirstSync(
      'SELECT * FROM marcas WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      nome: row.nome,
      desconto_comercial: row.desconto_comercial,
      data_vencimento: row.data_vencimento,
      limite_credito: row.limite_credito,
    };
  },

  save(m: Marca) {
    db.runSync(
      `INSERT OR REPLACE INTO marcas (
        id, codigo, nome, desconto_comercial, data_vencimento, limite_credito
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        m.id,
        m.codigo,
        m.nome,
        m.desconto_comercial,
        m.data_vencimento,
        m.limite_credito,
      ]
    );
  },

  saveMany(items: Marca[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO MARCA', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM marcas');
  }
};