import { Pool, QueryResult } from 'pg';
import config from '~config';

const postgresPool = new Pool(config.database);

export default {
  query: (text: string, params = []): Promise<QueryResult> => new Promise((resolve, reject) => {
    postgresPool.query(text, params, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    })
  })
}