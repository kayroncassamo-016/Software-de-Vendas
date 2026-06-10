import { Motivo_Isencao } from '@/types/types';
import { db } from '../db';

export const MotivoIsencaoRepository = {

  getAll(): Motivo_Isencao[] {
    const rows = db.getAllSync('SELECT * FROM motivos_isencao') as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    }));
  },

  getById(id: number): Motivo_Isencao | null {
    const row = db.getFirstSync(
      'SELECT * FROM motivos_isencao WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,
    };
  },

  save(m: Motivo_Isencao) {
    db.runSync(
      `INSERT OR REPLACE INTO motivos_isencao (
        id, codigo, designacao
      ) VALUES (?, ?, ?)`,
      [
        m.id,
        m.codigo,
        m.designacao,
      ]
    );
  },

  saveMany(items: Motivo_Isencao[]) {
    items.forEach((item, index) => {
      try {
        this.save(item);
      } catch (err) {
        console.log('ERRO MOTIVO ISENCAO', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM motivos_isencao');
  }
};