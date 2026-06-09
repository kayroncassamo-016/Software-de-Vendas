// repositories/ProdutoRepository.ts

import { Produtos } from '@/types/types';
import { db } from './db';

export const ProdutoRepository = {

  getAll(): Produtos[] {
    return db.getAllSync('SELECT * FROM produtos') as Produtos[];
  },

  getById(id: number): Produtos | null {
    const result = db.getFirstSync(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    );

    return result as Produtos | null;
  },

  save(produto: Produtos) {
  db.runSync(
    `INSERT OR REPLACE INTO produtos (
      id,
      codigo,
      designacao,

      preco_venda_liquido_1,
      preco_venda_iliquido_1,

      categoria_id,
      familia_id,
      marca_id,
      imposto_id,
      motivo_isencao_id,

      stock_actual,

      categoria_descricao,
      categoria_designacao,

      familia_codigo,
      familia_designacao,

      marca_codigo,
      marca_nome,
      marca_desconto_comercial,
      marca_data_vencimento,
      marca_limite_credito,

      imposto_codigo,
      imposto_taxa,
      imposto_designacao,

      tipo_produto_id,
      tipo_produto_codigo,
      tipo_produto_designacao,

      created_at,
      synced
    )
    VALUES (
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,?,?,?,?,?,?,
      ?,?,?,?,?,?,?,?,?
    )`,
    [
      produto.id,
      produto.codigo,
      produto.designacao,

      produto.preco_venda_liquido_1,
      produto.preco_venda_iliquido_1,

      produto.categoria_id,
      produto.familia_id,
      produto.marca_id,
      produto.imposto_id,
      produto.motivo_isencao_id,

      produto.stock_actual,

      produto.categoria?.descricao,
      produto.categoria?.designacao,

      produto.familia?.codigo,
      produto.familia?.designacao,

      produto.marca?.codigo,
      produto.marca?.nome,
      produto.marca?.desconto_comercial,
      produto.marca?.data_vencimento,
      produto.marca?.limite_credito,

      produto.imposto?.codigo,
      produto.imposto?.taxa,
      produto.imposto?.designacao,

      produto.tipo_produto?.id,
      produto.tipo_produto?.codigo,
      produto.tipo_produto?.designacao,

      produto.created_at?.toString(),
      1
    ]
  );
}
,

  saveMany(produtos: Produtos[]) {
    produtos.forEach(p => this.save(p));
  },

  clear() {
    db.runSync('DELETE FROM produtos');
  }
};