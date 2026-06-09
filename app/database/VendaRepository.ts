// // repositories/VendaRepository.ts

// import { Vendas } from '@/types/types';
// import { db } from './db';

// export const VendaRepository = {

//   getAll(): Vendas[] {
//     return db.getAllSync('SELECT * FROM vendas') as Vendas[];
//   },

//   getRascunhos(): Vendas[] {
//     return db.getAllSync(
//       'SELECT * FROM vendas WHERE estado = ?',
//       ['RASCUNHO']
//     ) as Vendas[];
//   },

//   getConfirmadas(): Vendas[] {
//     return db.getAllSync(
//       'SELECT * FROM vendas WHERE estado = ?',
//       ['CONFIRMADO']
//     ) as Vendas[];
//   },

//   save(venda: Vendas) {
//     db.runSync(
//       `INSERT OR REPLACE INTO vendas
//       (
//         id,
//         nome_doc,
//         tipo_doc,
//         ano_serie,
//         estado,
//         cliente_id,
//         fornecedor_id,
//         total_doc,
//         synced
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         venda.id,
//         venda.nome_doc,
//         venda.tipo_doc,
//         venda.ano_serie,
//         venda.estado ?? 'RASCUNHO',
//         venda.cliente_id ?? null,
//         venda.fornecedor_id ?? null,
//         venda.total_doc ?? '0',
//         0
//       ]
//     );
//   },

//   saveAsDraft(venda: Vendas) {
//     this.save({ ...venda, estado: 'RASCUNHO' });
//   },

//   confirmLocal(id: number) {
//     db.runSync(
//       `UPDATE vendas SET estado = 'CONFIRMADO', synced = 0 WHERE id = ?`,
//       [id]
//     );
//   },

//   cancelLocal(id: number) {
//     db.runSync(
//       `UPDATE vendas SET estado = 'CANCELADO', synced = 0 WHERE id = ?`,
//       [id]
//     );
//   },

//   saveMany(vendas: Vendas[]) {
//     vendas.forEach(v => this.save(v));
//   }
// };

// repositories/VendaRepository.ts

import { Vendas } from '@/types/types';
import { db } from './db';

export const VendaRepository = {

  getAll(): Vendas[] {
    return db.getAllSync(
      'SELECT * FROM vendas'
    ) as Vendas[];
  },

  getById(id: number): Vendas | null {
    return db.getFirstSync(
      'SELECT * FROM vendas WHERE id = ?',
      [id]
    ) as Vendas | null;
  },

  getRascunhos(): Vendas[] {
    return db.getAllSync(
      'SELECT * FROM vendas WHERE estado = ?',
      ['RASCUNHO']
    ) as Vendas[];
  },

  getConfirmadas(): Vendas[] {
    return db.getAllSync(
      'SELECT * FROM vendas WHERE estado = ?',
      ['CONFIRMADO']
    ) as Vendas[];
  },

  save(venda: Vendas) {

    db.runSync(
      `INSERT OR REPLACE INTO vendas (
        id,
        valor_pago,
        contribuinte,
        nome_doc,
        tipo_doc,
        ano_serie,
        estado,
        total_doc,
        cliente_id,
        fornecedor_id,
        nome_fornecedor,
        condicao_pagamento,
        produto_id,
        qtd,
        taxa_iva,
        pr_unit_sem_iva,
        impresso,
        pagamento,
        created_at,
        synced
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        venda.id,
        venda.valor_pago ?? '',
        venda.contribuinte ?? '',
        venda.nome_doc,
        venda.tipo_doc,
        venda.ano_serie,
        venda.estado ?? 'RASCUNHO',
        venda.total_doc ?? '0',

        venda.cliente_id ?? null,
        venda.fornecedor_id ?? null,

        venda.nome_fornecedor ?? null,
        venda.condicao_pagamento ?? null,

        venda.produto_id ?? null,
        venda.qtd ?? 0,

        venda.taxa_iva ?? '0',
        venda.pr_unit_sem_iva ?? '0',

        venda.impresso ? 1 : 0,
        venda.pagamento ?? '',

        venda.created_at ?? new Date().toISOString(),

        0
      ]
    );

    // Salvar linhas da venda
    if (venda.linhas?.length) {

      db.runSync(
        'DELETE FROM venda_linhas WHERE venda_id = ?',
        [venda.id]
      );

      venda.linhas.forEach(linha => {

        db.runSync(
          `INSERT INTO venda_linhas (
            id,
            venda_id,
            produto_id,
            qtd,
            taxa_iva,
            pr_unit_sem_iva
          )
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            linha.id,
            venda.id,
            linha.produto_id,
            linha.qtd,
            linha.taxa_iva,
            linha.pr_unit_sem_iva
          ]
        );

      });
    }

    // Salvar pagamentos
    if (venda.pagamentos?.length) {

      db.runSync(
        'DELETE FROM venda_pagamentos WHERE venda_id = ?',
        [venda.id]
      );

      venda.pagamentos.forEach(pagamento => {

        db.runSync(
          `INSERT INTO venda_pagamentos (
            venda_id,
            metodo,
            valor,
            banco_servico,
            nr_movimento
          )
          VALUES (?, ?, ?, ?, ?)`,
          [
            venda.id,
            pagamento.metodo ?? '',
            pagamento.valor,
            pagamento.banco_servico ?? '',
            pagamento.nr_movimento ?? null
          ]
        );

      });
    }
  },

  saveMany(vendas: Vendas[]) {
    vendas.forEach(venda => {
      try {
        this.save(venda);
      } catch (err) {
        console.log(
          'Erro ao salvar venda:',
          venda.id,
          err
        );
      }
    });
  },

  saveAsDraft(venda: Vendas) {
    this.save({
      ...venda,
      estado: 'RASCUNHO'
    });
  },

  confirmLocal(id: number) {
    db.runSync(
      `UPDATE vendas
       SET estado = 'CONFIRMADO',
           synced = 0
       WHERE id = ?`,
      [id]
    );
  },

  cancelLocal(id: number) {
    db.runSync(
      `UPDATE vendas
       SET estado = 'CANCELADO',
           synced = 0
       WHERE id = ?`,
      [id]
    );
  },

  clear() {
    db.runSync('DELETE FROM venda_pagamentos');
    db.runSync('DELETE FROM venda_linhas');
    db.runSync('DELETE FROM vendas');
  }
};