// import { Vendas } from '@/types/types';
// import { Alert } from 'react-native';
// import { db } from './db';

// export const VendaRepository = {

//   // =========================
//   // GET ALL
//   // =========================
//   getAll(): Vendas[] {
//     const vendas = db.getAllSync(
//       'SELECT * FROM vendas'
//     ) as any[];

//     return vendas.map(venda => {

//       const linhas = db.getAllSync(
//         'SELECT * FROM venda_linhas WHERE venda_id = ?',
//         [venda.id]
//       ) as any[];

//       const pagamentos = db.getAllSync(
//         'SELECT * FROM venda_pagamentos WHERE venda_id = ?',
//         [venda.id]
//       ) as any[];

//       return {
//         id: venda.id,

//         valor_pago: venda.valor_pago,
//         contribuinte: venda.contribuinte,

//         nome_doc: venda.nome_doc,
//         tipo_doc: venda.tipo_doc,
//         ano_serie: venda.ano_serie,

//         estado: venda.estado,
//         total_doc: venda.total_doc,

//         cliente_id: venda.cliente_id,
//         fornecedor_id: venda.fornecedor_id,

//         nome_fornecedor: venda.nome_fornecedor,
//         condicao_pagamento: venda.condicao_pagamento,

//         produto_id: venda.produto_id,
//         qtd: venda.qtd,

//         taxa_iva: venda.taxa_iva,
//         pr_unit_sem_iva: venda.pr_unit_sem_iva,

//         impresso: venda.impresso === 1,

//         pagamento: venda.pagamento,

//         pagamentos: pagamentos.map(p => ({
//           metodo: p.metodo,
//           valor: p.valor,
//           banco_servico: p.banco_servico,
//           nr_movimento: p.nr_movimento
//         })),

//         linhas: linhas.map(l => ({
//           id: l.id,
//           produto_id: l.produto_id,
//           qtd: l.qtd,
//           taxa_iva: l.taxa_iva,
//           pr_unit_sem_iva: l.pr_unit_sem_iva
//         })),

//         created_at: venda.created_at
//       };
//     });
//   },

//   // =========================
//   // GET BY ID
//   // =========================
//   getById(id: number): Vendas | null {

//     const venda = db.getFirstSync(
//       'SELECT * FROM vendas WHERE id = ?',
//       [id]
//     ) as any;

//     if (!venda) return null;

//     const linhas = db.getAllSync(
//       'SELECT * FROM venda_linhas WHERE venda_id = ?',
//       [id]
//     ) as any[];

//     Alert.alert('ID PROCURADO:', id.toString());

//     Alert.alert(
//       'LINHAS ENCONTRADAS:',
//       JSON.stringify(linhas, null, 2)
//     );

//     // const todasLinhas = db.getAllSync(
//     //   'SELECT * FROM venda_linhas'
//     //   );

//     // Alert.alert(
//     //   'TODAS AS LINHAS DA TABELA:',
//     //   JSON.stringify(todasLinhas, null, 2)
//     // );



//     const todasLinhas2 = db.getAllSync(
//   'SELECT id, venda_id, produto_id FROM venda_linhas'
//     );

//     Alert.alert(
//       'TODAS AS LINHAS vamover:',
//       JSON.stringify(todasLinhas2, null, 2)
//     );

//     const pagamentos = db.getAllSync(
//       'SELECT * FROM venda_pagamentos WHERE venda_id = ?',
//       [id]
//     ) as any[];

//     return {
//       id: venda.id,

//       valor_pago: venda.valor_pago,
//       contribuinte: venda.contribuinte,

//       nome_doc: venda.nome_doc,
//       tipo_doc: venda.tipo_doc,
//       ano_serie: venda.ano_serie,

//       estado: venda.estado,
//       total_doc: venda.total_doc,

//       cliente_id: venda.cliente_id,
//       fornecedor_id: venda.fornecedor_id,

//       nome_fornecedor: venda.nome_fornecedor,
//       condicao_pagamento: venda.condicao_pagamento,

//       produto_id: venda.produto_id,
//       qtd: venda.qtd,

//       taxa_iva: venda.taxa_iva,
//       pr_unit_sem_iva: venda.pr_unit_sem_iva,

//       impresso: venda.impresso === 1,

//       pagamento: venda.pagamento,

//       pagamentos: pagamentos.map(p => ({
//         metodo: p.metodo,
//         valor: p.valor,
//         banco_servico: p.banco_servico,
//         nr_movimento: p.nr_movimento
//       })),

//       linhas: linhas.map(l => ({
//         id: l.id,
//         produto_id: l.produto_id,
//         qtd: l.qtd,
//         taxa_iva: l.taxa_iva,
//         pr_unit_sem_iva: l.pr_unit_sem_iva
//       })),

//       created_at: venda.created_at
//     };
//   },

//   // =========================
//   // FILTROS
//   // =========================
//   getRascunhos(): Vendas[] {
//     return this.getAll().filter(v => v.estado === 'RASCUNHO');
//   },

//   getConfirmadas(): Vendas[] {
//     return this.getAll().filter(v => v.estado === 'CONFIRMADO');
//   },

//   // =========================
//   // SAVE (CORRIGIDO)
//   // =========================
//   save(venda: Vendas) {

//     // 🔥 ID ÚNICO GARANTIDO
//     const vendaId = venda.id ?? Date.now();
//     venda.id = vendaId;

//     db.runSync(
//       `INSERT OR REPLACE INTO vendas (
//         id,
//         valor_pago,
//         contribuinte,
//         nome_doc,
//         tipo_doc,
//         ano_serie,
//         estado,
//         total_doc,
//         cliente_id,
//         fornecedor_id,
//         nome_fornecedor,
//         condicao_pagamento,
//         produto_id,
//         qtd,
//         taxa_iva,
//         pr_unit_sem_iva,
//         impresso,
//         pagamento,
//         created_at,
//         synced
//       )
//       VALUES (
//         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
//         ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//       )`,
//       [
//         vendaId,

//         venda.valor_pago ?? '',
//         venda.contribuinte ?? '',

//         venda.nome_doc,
//         venda.tipo_doc,
//         venda.ano_serie,

//         venda.estado ?? 'RASCUNHO',
//         venda.total_doc ?? '0',

//         venda.cliente_id ?? null,
//         venda.fornecedor_id ?? null,

//         venda.nome_fornecedor ?? null,
//         venda.condicao_pagamento ?? null,

//         venda.produto_id ?? null,
//         venda.qtd ?? 0,

//         venda.taxa_iva ?? '0',
//         venda.pr_unit_sem_iva ?? '0',

//         venda.impresso ? 1 : 0,

//         venda.pagamento ?? '',

//         venda.created_at ?? new Date().toISOString(),

//         1
//       ]
//     );

//     // =========================
//     // LINHAS
//     // =========================
//     db.runSync(
//       'DELETE FROM venda_linhas WHERE venda_id = ?',
//       [vendaId]
//     );

// //     Alert.alert(
// //       "VENDA ID:",
// //       venda.id.toString()
// //     );

// //     Alert.alert(
// //       "LINHAS:",
// //       JSON.stringify(venda.linhas, null, 2)
// //     );

// //     Alert.alert(
// //       "QTD LINHAS:",
// //       venda.linhas?.length.toString()
// // );

//     venda.linhas?.forEach((linha,index) => {

//         console.log(
//             'INSERINDO LINHA',
//             index,
//             JSON.stringify(linha, null, 2)
//   );
//       const linhaId = linha.id ?? (Date.now() + Math.random());

//       db.runSync(
//         `INSERT INTO venda_linhas (
//           id,
//           venda_id,
//           produto_id,
//           qtd,
//           taxa_iva,
//           pr_unit_sem_iva
//         )
//         VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           linhaId,

//           vendaId, 

//           linha.produto_id,
//           linha.qtd,
//           linha.taxa_iva,
//           linha.pr_unit_sem_iva
//         ]
//       );
//     });

//     const teste = db.getAllSync(
//       'SELECT * FROM venda_linhas WHERE venda_id = ?',
//       [vendaId]
//     );

//     console.log(
//       'LINHAS DEPOIS DO INSERT:',
//       JSON.stringify(teste, null, 2)
//     );

//     // =========================
//     // PAGAMENTOS
//     // =========================
//     db.runSync(
//       'DELETE FROM venda_pagamentos WHERE venda_id = ?',
//       [vendaId]
//     );

//     venda.pagamentos?.forEach(pagamento => {

//       db.runSync(
//         `INSERT INTO venda_pagamentos (
//           venda_id,
//           metodo,
//           valor,
//           banco_servico,
//           nr_movimento
//         )
//         VALUES (?, ?, ?, ?, ?)`,
//         [
//           vendaId,

//           pagamento.metodo ?? '',
//           pagamento.valor ?? 0,

//           pagamento.banco_servico ?? '',
//           pagamento.nr_movimento ?? null
//         ]
//       );
//     });
//   },

//   // =========================
//   // SAVE MANY
//   // =========================
//   saveMany(vendas: Vendas[]) {
//     vendas.forEach((venda, index) => {
//       try {
//         this.save(venda);
//       } catch (err) {
//         console.log('ERRO NA VENDA', index, err);
//       }
//     });
//   },

//   // =========================
//   // STATUS
//   // =========================
//   confirmLocal(id: number) {
//     db.runSync(
//       `UPDATE vendas
//        SET estado = 'CONFIRMADO',
//            synced = 0
//        WHERE id = ?`,
//       [id]
//     );
//   },

//   cancelLocal(id: number) {
//     db.runSync(
//       `UPDATE vendas
//        SET estado = 'CANCELADO',
//            synced = 0
//        WHERE id = ?`,
//       [id]
//     );
//   },

//   // =========================
//   // CLEAR DB
//   // =========================
//   clear() {
//     db.runSync('DELETE FROM venda_pagamentos');
//     db.runSync('DELETE FROM venda_linhas');
//     db.runSync('DELETE FROM vendas');
//   }
// };




import { Vendas } from '@/types/types';
import { db } from './db';

export const VendaRepository = {

  // =========================
  // GET ALL
  // =========================
  getAll(): Vendas[] {

    const vendas = db.getAllSync(
      'SELECT * FROM vendas'
    ) as any[];

    return vendas.map(venda => {

      const linhas = db.getAllSync(
        'SELECT * FROM venda_linhas WHERE venda_id = ?',
        [venda.id]
      ) as any[];

      const pagamentos = db.getAllSync(
        'SELECT * FROM venda_pagamentos WHERE venda_id = ?',
        [venda.id]
      ) as any[];


      

      return {
        id: venda.id,

        valor_pago: venda.valor_pago,
        contribuinte: venda.contribuinte,

        nome_doc: venda.nome_doc,
        tipo_doc: venda.tipo_doc,
        ano_serie: venda.ano_serie,

        estado: venda.estado,
        total_doc: venda.total_doc,

        cliente_id: venda.cliente_id,
        fornecedor_id: venda.fornecedor_id,

        nome_fornecedor: venda.nome_fornecedor,
        condicao_pagamento: venda.condicao_pagamento,

        produto_id: venda.produto_id,
        qtd: venda.qtd,

        taxa_iva: venda.taxa_iva,
        pr_unit_sem_iva: venda.pr_unit_sem_iva,

        impresso: venda.impresso === 1,
        pagamento: venda.pagamento,

        pagamentos: pagamentos.map(p => ({
          metodo: p.metodo,
          valor: p.valor,
          banco_servico: p.banco_servico,
          nr_movimento: p.nr_movimento
        })),

        linhas: linhas.map(l => ({
          id: l.id,
          produto_id: l.produto_id,
          qtd: l.qtd,
          taxa_iva: l.taxa_iva,
          pr_unit_sem_iva: l.pr_unit_sem_iva
        })),

        created_at: venda.created_at
      };
    });
  },

  // =========================
  // GET BY ID
  // =========================
  getById(id: number): Vendas | null {

    const venda = db.getFirstSync(
      'SELECT * FROM vendas WHERE id = ?',
      [id]
    ) as any;

    if (!venda) return null;

    const linhas = db.getAllSync(
      'SELECT * FROM venda_linhas WHERE venda_id = ?',
      [id]
    ) as any[];

    const pagamentos = db.getAllSync(
      'SELECT * FROM venda_pagamentos WHERE venda_id = ?',
      [id]
    ) as any[];



    return {
      id: venda.id,

      valor_pago: venda.valor_pago,
      contribuinte: venda.contribuinte,

      nome_doc: venda.nome_doc,
      tipo_doc: venda.tipo_doc,
      ano_serie: venda.ano_serie,

      estado: venda.estado,
      total_doc: venda.total_doc,

      cliente_id: venda.cliente_id,
      fornecedor_id: venda.fornecedor_id,

      nome_fornecedor: venda.nome_fornecedor,
      condicao_pagamento: venda.condicao_pagamento,

      produto_id: venda.produto_id,
      qtd: venda.qtd,

      taxa_iva: venda.taxa_iva,
      pr_unit_sem_iva: venda.pr_unit_sem_iva,

      impresso: venda.impresso === 1,
      pagamento: venda.pagamento,

      pagamentos: pagamentos.map(p => ({
        metodo: p.metodo,
        valor: p.valor,
        banco_servico: p.banco_servico,
        nr_movimento: p.nr_movimento
      })),

      linhas: linhas.map(l => ({
        id: l.id,
        produto_id: l.produto_id,
        qtd: l.qtd,
        taxa_iva: l.taxa_iva,
        pr_unit_sem_iva: l.pr_unit_sem_iva
      })),

      created_at: venda.created_at
    };
  },


   
  // =========================
  // SAVE
  // =========================
  save(venda: Vendas) {

    const vendaId = venda.id;

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
        vendaId,

        venda.valor_pago ?? '',
        venda.contribuinte ?? '',

        venda.nome_doc ?? '',
        venda.tipo_doc ?? '',
        venda.ano_serie ?? '',

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

    // LINHAS
    db.runSync('DELETE FROM venda_linhas WHERE venda_id = ?', [vendaId]);

    (venda.linhas ?? []).forEach((linha, index) => {

      const linhaId =
        //linha.id ?? Number(`${vendaId}${index}${Date.now()}`);
        linha.id;

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
          linhaId,
          vendaId,
          linha.produto_id,
          linha.qtd,
          linha.taxa_iva,
          linha.pr_unit_sem_iva
        ]
      );
    });

    // PAGAMENTOS
    db.runSync('DELETE FROM venda_pagamentos WHERE venda_id = ?', [vendaId]);

    (venda.pagamentos ?? []).forEach(p => {

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
          vendaId,
          p.metodo ?? '',
          p.valor ?? 0,
          p.banco_servico ?? '',
          p.nr_movimento ?? null
        ]
      );
    });
  },

  // =========================
  // SAVE MANY (✔️ AQUI ESTÁ ELE)
  // =========================
  saveMany(vendas: Vendas[]) {

    vendas.forEach((venda, index) => {
      try {
        this.save(venda);
      } catch (err) {
        console.log('ERRO NA VENDA', index, err);
      }
    });

  },

  // =========================
  // FILTROS
  // =========================
  getRascunhos(): Vendas[] {
    return this.getAll().filter(v => v.estado === 'RASCUNHO');
  },

  getConfirmadas(): Vendas[] {
    return this.getAll().filter(v => v.estado === 'CONFIRMADO');
  }
};