import db from '../index';
import { buildClause } from '~utils/database';

// @ts-ignore
export async function getItemDimensions(whereObj, limit = 3000): Promise<{ height_in: number[], depth_in: number[], length_in: []}[]> {

  const sqlQuery = `SELECT height_in, depth_in, length_in FROM item WHERE ${buildClause(whereObj, ' AND ')} LIMIT ${limit}`;
  const { rows } = await db.query(sqlQuery);

  return rows;
}