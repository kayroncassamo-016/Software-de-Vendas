import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('software_faturacao.db');