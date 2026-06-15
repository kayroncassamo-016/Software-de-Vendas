// repositories/ClienteRepository.ts

import { Clientes } from '@/types/types';
import { db } from './db';

export const ClienteRepository = {

  // getAll(): Clientes[] {
  //   return db.getAllSync('SELECT * FROM clientes') as Clientes[];
  // },
  
  getAll(): Clientes[] {
  const rows = db.getAllSync('SELECT * FROM clientes') as any[];

  return rows.map(row => ({
    id: row.id,
    numero: row.numero,
    nome: row.nome,
    nuit: row.nuit,
    data_nascimento: row.data_nascimento,
    email: row.email,
    tipo: row.tipo,
    sexo: row.sexo,

    endereco:{
      id: row.endereco_id,
      morada: row.morada,
      provincia: row.provincia,
      cod_postal: row.cod_postal
    } ,

    financeiro:  {
      id: row.financeiro_id,
      forma_pagamento: row.forma_pagamento,
      limite_credito: row.limite_credito,
      desconto_comercial: row.desconto_comercial,
      data_vencimento: row.data_vencimento
    } ,

    created_at: new Date(row.created_at)
  }));
}, 


  getById(id: number): Clientes | null {
  const row = db.getFirstSync(
    'SELECT * FROM clientes WHERE id = ?',
    [id]
  ) as any;

  if (!row) return null;

  return {
    id: row.id,
    numero: row.numero,
    nome: row.nome,
    nuit: row.nuit,
    data_nascimento: row.data_nascimento,
    email: row.email,
    tipo: row.tipo,
    sexo: row.sexo,

    endereco:
       {
          id: row.endereco_id,
          morada: row.morada,
          provincia: row.provincia,
          cod_postal: row.cod_postal
        }
      ,

    financeiro: {
          id: row.financeiro_id,
          forma_pagamento: row.forma_pagamento,
          limite_credito: row.limite_credito,
          desconto_comercial: row.desconto_comercial,
          data_vencimento: row.data_vencimento
        }
     ,

    created_at: new Date(row.created_at)
  };
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
     

      this.save(c);

      
    } catch (err) {
      console.log("ERRO NO CLIENTE", index, err);
    }
  });
  },

  clear() {
    db.runSync('DELETE FROM clientes');
  }
};