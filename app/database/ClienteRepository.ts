import { db } from './db';

export async function getClientes() {
  return db.getAllSync('SELECT * FROM clientes');
}

export async function saveCliente(cliente:any)
{
  db.runSync(
    `
      INSERT INTO clientes
      (
        id,
        nome,
        telefone,
        email,
        synced
      )
      VALUES (?, ?, ?, ?, ?)
    `,
    [
      cliente.id,
      cliente.nome,
      cliente.telefone,
      cliente.email,
      0
    ]
  );
}