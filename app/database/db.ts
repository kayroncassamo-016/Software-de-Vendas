import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('software_faturacao.db');

// db.execSync(`
//   DROP TABLE IF EXISTS clientes;
// `);

// db.execSync(`DROP TABLE IF EXISTS clientes`);
//  db.execSync(`DROP TABLE IF EXISTS produtos`);
// db.execSync(`DROP TABLE IF EXISTS vendas`);
// db.execSync(`DROP TABLE IF EXISTS venda_linhas`);