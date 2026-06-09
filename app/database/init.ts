import { db } from './db';

export function initDatabase() {

  // CLIENTES
  db.execSync(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY,
      numero INTEGER,
      nome TEXT,
      nuit TEXT,
      data_nascimento TEXT,
      email TEXT,
      tipo TEXT,
      sexo TEXT,

      endereco_id INTEGER,
      morada TEXT,
      provincia TEXT,
      cod_postal TEXT,

      financeiro_id INTEGER,
      forma_pagamento TEXT,
      limite_credito TEXT,
      desconto_comercial TEXT,
      data_vencimento TEXT,

      created_at TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  // PRODUTOS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY,

      codigo TEXT,
      designacao TEXT,

      preco_venda_liquido_1 TEXT,
      preco_venda_iliquido_1 TEXT,

      categoria_id INTEGER,
      categoria_descricao TEXT,
      categoria_designacao TEXT,

      familia_id INTEGER,
      familia_codigo TEXT,
      familia_designacao TEXT,

      marca_id INTEGER,
      marca_codigo TEXT,
      marca_nome TEXT,
      marca_desconto_comercial TEXT,
      marca_data_vencimento TEXT,
      marca_limite_credito TEXT,

      imposto_id INTEGER,
      imposto_codigo TEXT,
      imposto_taxa TEXT,
      imposto_designacao TEXT,

      motivo_isencao_id INTEGER,

      tipo_produto_id INTEGER,
      tipo_produto_codigo TEXT,
      tipo_produto_designacao TEXT,

      stock_actual TEXT,

      created_at TEXT,
      synced INTEGER DEFAULT 0
    );
  `);

  // VENDAS
  db.execSync(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY,

      valor_pago TEXT,
      contribuinte TEXT,

      nome_doc TEXT,
      tipo_doc TEXT,
      ano_serie TEXT,

      estado TEXT,
      total_doc TEXT,

      cliente_id INTEGER,
      fornecedor_id INTEGER,

      nome_fornecedor TEXT,
      condicao_pagamento TEXT,

      produto_id INTEGER,
      qtd INTEGER,

      taxa_iva TEXT,
      pr_unit_sem_iva TEXT,

      impresso INTEGER,
      pagamento TEXT,

      created_at TEXT,

      synced INTEGER DEFAULT 0
    );
  `);

  // LINHAS DA VENDA
  db.execSync(`
    CREATE TABLE IF NOT EXISTS venda_linhas (
      id INTEGER PRIMARY KEY,
      venda_id INTEGER,

      produto_id INTEGER,
      qtd INTEGER,

      taxa_iva TEXT,
      pr_unit_sem_iva TEXT
    );
  `);

  // PAGAMENTOS DA VENDA
  db.execSync(`
    CREATE TABLE IF NOT EXISTS venda_pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      venda_id INTEGER,

      metodo TEXT,
      valor TEXT,

      banco_servico TEXT,
      nr_movimento INTEGER
    );
  `);

}