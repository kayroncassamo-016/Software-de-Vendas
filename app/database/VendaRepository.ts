// repositories/VendaRepository.ts

import { Vendas } from '@/types/types';
import { db } from './db';

export const VendaRepository = {

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

  getRascunhos(): Vendas[] {
    return this.getAll().filter(
      venda => venda.estado === 'RASCUNHO'
    );
  },

  getConfirmadas(): Vendas[] {
    return this.getAll().filter(
      venda => venda.estado === 'CONFIRMADO'
    );
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

        venda.created_at ??
          new Date().toISOString(),

        1
      ]
    );

    db.runSync(
      'DELETE FROM venda_linhas WHERE venda_id = ?',
      [venda.id]
    );

    venda.linhas?.forEach(linha => {

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

    db.runSync(
      'DELETE FROM venda_pagamentos WHERE venda_id = ?',
      [venda.id]
    );

    venda.pagamentos?.forEach(pagamento => {

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
  },

  saveMany(vendas: Vendas[]) {

    vendas.forEach((venda, index) => {

      try {

        console.log(
          'SALVANDO VENDA',
          index,
          venda.id
        );

        this.save(venda);

        console.log(
          'SALVO VENDA',
          index,
          venda.id
        );

      } catch (err) {

        console.log(
          'ERRO NA VENDA',
          index,
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

    db.runSync(
      'DELETE FROM venda_pagamentos'
    );

    db.runSync(
      'DELETE FROM venda_linhas'
    );

    db.runSync(
      'DELETE FROM vendas'
    );

  }

};