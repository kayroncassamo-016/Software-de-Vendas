import { Produtos } from '@/types/types';
import { db } from './db';

export const ProdutoRepository = {

  getAll(): Produtos[] {
    const rows = db.getAllSync(
      'SELECT * FROM produtos'
    ) as any[];

    return rows.map(row => ({
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,

      preco_venda_liquido_1: row.preco_venda_liquido_1,
      preco_venda_iliquido_1: row.preco_venda_iliquido_1,

      categoria_id: row.categoria_id,
      familia_id: row.familia_id,
      marca_id: row.marca_id,
      imposto_id: row.imposto_id,
      motivo_isencao_id: row.motivo_isencao_id,

      stock_actual: row.stock_actual,

      categoria: {
        id: row.categoria_id,
        descricao: row.categoria_descricao,
        designacao: row.categoria_designacao
      },

      familia: {
        id: row.familia_id,
        codigo: row.familia_codigo,
        designacao: row.familia_designacao
      },

      marca: {
        id: row.marca_id,
        codigo: row.marca_codigo,
        nome: row.marca_nome,
        desconto_comercial: row.marca_desconto_comercial,
        data_vencimento: row.marca_data_vencimento,
        limite_credito: row.marca_limite_credito
      },

      imposto: {
        id: row.imposto_id,
        codigo: row.imposto_codigo,
        taxa: row.imposto_taxa,
        designacao: row.imposto_designacao
      },

      tipo_produto: {
        id: row.tipo_produto_id,
        codigo: row.tipo_produto_codigo,
        designacao: row.tipo_produto_designacao
      },

      created_at: new Date(row.created_at)
    }));
  },

  getById(id: number): Produtos | null {
    const row = db.getFirstSync(
      'SELECT * FROM produtos WHERE id = ?',
      [id]
    ) as any;

    if (!row) return null;

    return {
      id: row.id,
      codigo: row.codigo,
      designacao: row.designacao,

      preco_venda_liquido_1: row.preco_venda_liquido_1,
      preco_venda_iliquido_1: row.preco_venda_iliquido_1,

      categoria_id: row.categoria_id,
      familia_id: row.familia_id,
      marca_id: row.marca_id,
      imposto_id: row.imposto_id,
      motivo_isencao_id: row.motivo_isencao_id,

      stock_actual: row.stock_actual,

      categoria: {
        id: row.categoria_id,
        descricao: row.categoria_descricao,
        designacao: row.categoria_designacao
      },

      familia: {
        id: row.familia_id,
        codigo: row.familia_codigo,
        designacao: row.familia_designacao
      },

      marca: {
        id: row.marca_id,
        codigo: row.marca_codigo,
        nome: row.marca_nome,
        desconto_comercial: row.marca_desconto_comercial,
        data_vencimento: row.marca_data_vencimento,
        limite_credito: row.marca_limite_credito
      },

      imposto: {
        id: row.imposto_id,
        codigo: row.imposto_codigo,
        taxa: row.imposto_taxa,
        designacao: row.imposto_designacao
      },

      tipo_produto: {
        id: row.tipo_produto_id,
        codigo: row.tipo_produto_codigo,
        designacao: row.tipo_produto_designacao
      },

      created_at: new Date(row.created_at)
    };
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
        categoria_descricao,
        categoria_designacao,

        familia_id,
        familia_codigo,
        familia_designacao,

        marca_id,
        marca_codigo,
        marca_nome,
        marca_desconto_comercial,
        marca_data_vencimento,
        marca_limite_credito,

        imposto_id,
        imposto_codigo,
        imposto_taxa,
        imposto_designacao,

        motivo_isencao_id,

        tipo_produto_id,
        tipo_produto_codigo,
        tipo_produto_designacao,

        stock_actual,

        created_at,
        synced
      )
      VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?,
        ?, ?, ?,
        ?,
        ?, ?
      )`,
      [
        produto.id,
        produto.codigo,
        produto.designacao,

        produto.preco_venda_liquido_1,
        produto.preco_venda_iliquido_1,

        produto.categoria?.id,
        produto.categoria?.descricao,
        produto.categoria?.designacao,

        produto.familia?.id,
        produto.familia?.codigo,
        produto.familia?.designacao,

        produto.marca?.id,
        produto.marca?.codigo,
        produto.marca?.nome,
        produto.marca?.desconto_comercial,
        produto.marca?.data_vencimento,
        produto.marca?.limite_credito,

        produto.imposto?.id,
        produto.imposto?.codigo,
        produto.imposto?.taxa,
        produto.imposto?.designacao,

        produto.motivo_isencao_id,

        produto.tipo_produto?.id,
        produto.tipo_produto?.codigo,
        produto.tipo_produto?.designacao,

        produto.stock_actual,

        produto.created_at?.toString(),
        1
      ]
    );
  },

  saveMany(produtos: Produtos[]) {
    produtos.forEach((produto, index) => {
      try {
        console.log('SALVANDO PRODUTO', index, produto.id);

        this.save(produto);

        console.log('SALVO PRODUTO', index, produto.id);
      } catch (err) {
        console.log('ERRO NO PRODUTO', index, err);
      }
    });
  },

  clear() {
    db.runSync('DELETE FROM produtos');
  }
};