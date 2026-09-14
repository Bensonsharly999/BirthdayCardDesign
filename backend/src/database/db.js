import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';
import { config } from '../config/env.js';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db;

class Statement {
  constructor(sqlDb, sql, persist) {
    this.sqlDb = sqlDb;
    this.sql = sql;
    this.persist = persist;
  }

  run(...params) {
    this.sqlDb.run(this.sql, flattenParams(params));
    const idRow = this.sqlDb.exec('SELECT last_insert_rowid() AS id');
    const lastInsertRowid = idRow[0]?.values?.[0]?.[0] ?? 0;
    this.persist();
    return { lastInsertRowid };
  }

  get(...params) {
    const stmt = this.sqlDb.prepare(this.sql);
    const values = flattenParams(params);
    if (values.length) stmt.bind(values);
    const row = stmt.step() ? stmt.getAsObject() : undefined;
    stmt.free();
    return row;
  }

  all(...params) {
    const stmt = this.sqlDb.prepare(this.sql);
    const values = flattenParams(params);
    if (values.length) stmt.bind(values);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }
}

class SqliteAdapter {
  constructor(sqlDb, persist) {
    this.sqlDb = sqlDb;
    this.persist = persist;
    this.inTransaction = false;
  }

  exec(sql) {
    this.sqlDb.exec(sql);
    if (!this.inTransaction) this.persist();
  }

  prepare(sql) {
    return new Statement(this.sqlDb, sql, () => {
      if (!this.inTransaction) this.persist();
    });
  }

  transaction(fn) {
    return (...args) => {
      this.inTransaction = true;
      this.sqlDb.run('BEGIN');
      try {
        const result = fn(...args);
        this.sqlDb.run('COMMIT');
        this.inTransaction = false;
        this.persist();
        return result;
      } catch (error) {
        this.sqlDb.run('ROLLBACK');
        this.inTransaction = false;
        throw error;
      }
    };
  }
}

function flattenParams(params) {
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

export async function initDb() {
  if (db) return db;

  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  const SQL = await initSqlJs({
    locateFile: (file) => require.resolve(`sql.js/dist/${file}`),
  });

  const fileBuffer = fs.existsSync(config.dbPath) ? fs.readFileSync(config.dbPath) : null;
  const sqlDb = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
  sqlDb.run('PRAGMA foreign_keys = ON');

  const persist = () => {
    fs.writeFileSync(config.dbPath, Buffer.from(sqlDb.export()));
  };

  db = new SqliteAdapter(sqlDb, persist);
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  sqlDb.exec(schema);
  persist();
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database has not been initialized.');
  }
  return db;
}
