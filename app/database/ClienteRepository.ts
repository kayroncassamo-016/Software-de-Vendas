// repositories/ClienteRepository.ts

import { Clientes } from '@/types/types';
import { db } from './db';

export const ClienteRepository = {

  getAll(): Clientes[] {
    return db.getAllSync('SELECT * FROM clientes') as Clientes[];
  },

  getById(id: number): Clientes | null {
    const result = db.getFirstSync(
      'SELECT * FROM clientes WHERE id = ?',
      [id]
    );

    return result as Clientes | null;
  },

  save(cliente: Clientes) {
  db.runSync(
    `INSERT OR REPLACE INTO clientes (
      id,
      numero,
      nome,
      nuit,
      data_nascimento,
      email,
      tipo,
      sexo,

      endereco_id,
      morada,
      provincia,
      cod_postal,

      financeiro_id,
      forma_pagamento,
      limite_credito,
      desconto_comercial,
      data_vencimento,

      created_at,
      synced
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      cliente.id,
      cliente.numero,
      cliente.nome,
      cliente.nuit,
      cliente.data_nascimento,
      cliente.email,
      cliente.tipo,
      cliente.sexo,

      cliente.endereco?.id ?? null,
      cliente.endereco?.morada ?? null,
      cliente.endereco?.provincia ?? null,
      cliente.endereco?.cod_postal ?? null,

      cliente.financeiro?.id ?? null,
      cliente.financeiro?.forma_pagamento ?? null,
      cliente.financeiro?.limite_credito ?? null,
      cliente.financeiro?.desconto_comercial ?? null,
      cliente.financeiro?.data_vencimento ?? null,

      cliente.created_at?.toString() ?? null,
      1
    ]
  );
},

  saveMany(clientes: Clientes[]) {
    //clientes.forEach(c => this.save(c));
     clientes.forEach((c, index) => {
    try {
      console.log("SALVANDO", index, c.id);

      this.save(c);

      console.log("SALVO", index, c.id);
    } catch (err) {
      console.log("ERRO NO CLIENTE", index, err);
    }
  });
  },

  clear() {
    db.runSync('DELETE FROM clientes');
  }
};