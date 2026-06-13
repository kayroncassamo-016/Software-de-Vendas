// // vendaMapper.ts
// import { Vendas, linha, pagamento } from "@/types/types";

// export const VendaMapper = {

//   fromApi(api: any): Vendas {
//     return {
//       id: api.id,
//       valor_pago: api.valor_pago ?? "0",
//       contribuinte: api.contribuinte ?? "",
//       nome_doc: api.nome_doc,
//       tipo_doc: api.tipo_doc,
//       ano_serie: api.ano_serie,
//       estado: api.estado ?? "RASCUNHO",
//       total_doc: api.total_doc ?? "0",

//       cliente_id: api.cliente_id ?? null,
//       fornecedor_id: api.fornecedor_id ?? null,
//       nome_fornecedor: api.nome_fornecedor ?? "",
//       condicao_pagamento: api.pagamento ?? "",

//       produto_id: 0,
//       qtd: 0,
//       taxa_iva: "0",
//       pr_unit_sem_iva: "0",

//       impresso: api.impresso ?? false,
//       pagamento: api.pagamento ?? "",

//       pagamentos: [],

//       linhas: [], // 🔥 SEMPRE VAZIO DA API

//       created_at: api.created_at
//     };
//   },

//   fromDb(row: any, linhas: any[], pagamentos: any[]): Vendas {
//     return {
//       id: row.id,
//       valor_pago: row.valor_pago,
//       contribuinte: row.contribuinte,
//       nome_doc: row.nome_doc,
//       tipo_doc: row.tipo_doc,
//       ano_serie: row.ano_serie,
//       estado: row.estado,
//       total_doc: row.total_doc,

//       cliente_id: row.cliente_id,
//       fornecedor_id: row.fornecedor_id,
//       nome_fornecedor: row.nome_fornecedor,
//       condicao_pagamento: row.condicao_pagamento,

//       produto_id: row.produto_id,
//       qtd: row.qtd,
//       taxa_iva: row.taxa_iva,
//       pr_unit_sem_iva: row.pr_unit_sem_iva,

//       impresso: !!row.impresso,
//       pagamento: row.pagamento,

//       pagamentos,
//       linhas,

//       created_at: row.created_at
//     };
//   }
// };

import { Vendas } from '@/types/types';


export function mapApiVendaToLocal(venda: any): Vendas {
  return {
    id: venda.id,

    valor_pago: venda.valor_pago ?? '',
    contribuinte: venda.contribuinte ?? '',

    nome_doc: venda.nome_doc ?? '',
    tipo_doc: venda.tipo_doc ?? '',
    ano_serie: venda.ano_serie ?? '',

    estado: venda.estado ?? 'RASCUNHO',
    total_doc: venda.total_doc ?? '0',

    cliente_id: venda.cliente_id ?? null,
    fornecedor_id: venda.fornecedor_id ?? null,

    nome_fornecedor: venda.nome_fornecedor ?? null,
    condicao_pagamento: venda.condicao_pagamento ?? null,

    produto_id: null as unknown as number,
    qtd: null as unknown as number,

    taxa_iva: null as unknown as string,
    pr_unit_sem_iva: null as unknown as string,

    impresso: !!venda.impresso,
    pagamento: venda.pagamento ?? '',

    created_at: venda.created_at ?? new Date().toISOString(),

    // pagamentos (se vierem da API)
    pagamentos: (venda.pagamentos || []).map((p: any) => ({
      metodo: p.metodo ?? '',
      valor: p.valor ?? 0,
      banco_servico: p.banco_servico ?? '',
      nr_movimento: p.nr_movimento ?? null
    })),

    // linhas da venda
    linhas: (venda.linhas || []).map((l: any) => ({
      id: l.id,
      produto_id: l.produto_id,
      qtd: Number(l.qtd),
      taxa_iva: l.taxa_iva,
      pr_unit_sem_iva: l.pr_unit_sem_iva
    }))
  };
}