// repositories/FornecedoresRepository.ts

import { Fornecedores } from '@/types/types';
import { db } from './db';

export const FornecedoresRepository = {

  getAll(): Fornecedores[] {

    const rows = db.getAllSync(
      'SELECT * FROM fornecedores'
    ) as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      morada: row.morada,
      nuit: row.nuit,
      cidade: row.cidade
    }));
  },

  getById(id: number): Fornecedores | null {

    const row = db.getFirstSync(
      'SELECT * FROM fornecedores WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      morada: row.morada,
      nuit: row.nuit,
      cidade: row.cidade
    };
  },

  save(fornecedor: Fornecedores) {

    db.runSync(
      `INSERT OR REPLACE INTO fornecedores (
        id,
        codigo,
        nome,
        email,
        telefone,
        morada,
        nuit,
        cidade,
        synced
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        fornecedor.id,
        fornecedor.codigo,
        fornecedor.nome,
        fornecedor.email,
        fornecedor.telefone,
        fornecedor.morada,
        fornecedor.nuit,
        fornecedor.cidade,
        1
      ]
    );
  },

  saveMany(fornecedores: Fornecedores[]) {

    fornecedores.forEach((fornecedor, index) => {

      try {

      
        this.save(fornecedor);

        
      } catch (err) {

        console.log(
          'ERRO NO FORNECEDOR',
          index,
          fornecedor.id,
          err
        );

      }

    });

  },

  clear() {

    db.runSync(
      'DELETE FROM fornecedores'
    );

  }

};