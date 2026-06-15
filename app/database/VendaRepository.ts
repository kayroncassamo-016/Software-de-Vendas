

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
     
        created_at: venda.created_at,

        synced: venda.synced,

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
        synced: venda.synced,
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

      created_at: venda.created_at,
      
    };
  },


   
  // =========================
  // SAVE
  // =========================
  save(venda: Vendas) {

    const vendaId = venda.id?? Date.now();;

    // console.log ('SALVANDO VENDA com dados: ',venda)

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

        venda.estado?? 'RASCUNHO' ,
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

      venda.synced ?? 0
      ]
    );

    // LINHAS
    db.runSync('DELETE FROM venda_linhas WHERE venda_id = ?', [vendaId]);

    (venda.linhas ?? []).forEach((linha, index) => {

      const linhaId = linha.id ??Date.now();
       // linha.id;


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

  markAsSynced(id: number) {
    db.runSync(
      `UPDATE vendas
      SET synced = 1
      WHERE id = ?`,
      [id]
    );
  },

  getPendingSync(): Vendas[] {
  return this.getAll().filter((v: any) => v.synced === 0);
},
  
updateEstado(id: number, estado: string) {
  //console.log('🔄 Tentando atualizar venda:', id, 'para:', estado);
  db.runSync(
    `
    UPDATE vendas
    SET estado = ?
    WHERE id = ?
    `,
    [estado, id]
  );

   const venda = db.getFirstSync(
    'SELECT estado FROM vendas WHERE id = ?',
    [id]
  ) as any;
  console.log('✅ Venda agora está com estado:', venda?.estado);
},


// VendaRepository.ts

renameId(idAntigo: number, idNovo: number) {
  console.log(`🔄 [renameId] Mudando venda de ID ${idAntigo} para ${idNovo}`);

  // Atualiza a venda
  db.runSync(
    `UPDATE vendas SET id = ? WHERE id = ?`,
    [idNovo, idAntigo]
  );

  // Atualiza as linhas
  db.runSync(
    `UPDATE venda_linhas SET venda_id = ? WHERE venda_id = ?`,
    [idNovo, idAntigo]
  );

  // Atualiza os pagamentos
  db.runSync(
    `UPDATE venda_pagamentos SET venda_id = ? WHERE venda_id = ?`,
    [idNovo, idAntigo]
  );

  console.log(`✅ [renameId] Venda atualizada com sucesso!`);
},

  saveMany(vendas: Vendas[]) {

    vendas.forEach((venda, index) => {
      try {
        this.save(venda);
      } catch (err) {
        console.log('ERRO NA VENDA', index, err);
      }
    });

  },


  // FILTROS
  // =========================
  getRascunhos(): Vendas[] {
    return this.getAll().filter(v => v.estado === 'RASCUNHO');
  },

  getConfirmadas(): Vendas[] {
    return this.getAll().filter(v => v.estado === 'CONFIRMADO');
  }
};


