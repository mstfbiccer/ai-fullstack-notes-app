import oracledb from 'oracledb';

// Oracle DB configuration
const dbConfig = {
  user: process.env.DB_USER || 'NOTES_USER',
  password: process.env.DB_PASSWORD || 'notes_password',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1'
};

// Initialize Oracle client (for thick mode if needed)
// oracledb.initOracleClient({ libDir: '/path/to/instantclient' });

let pool;

export async function initializePool() {
  try {
    pool = await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Oracle DB connection pool initialized');
  } catch (err) {
    console.error('Failed to create Oracle DB pool:', err);
    throw err;
  }
}

export async function closePool() {
  if (pool) {
    try {
      await pool.close(10);
      console.log('Oracle DB pool closed');
    } catch (err) {
      console.error('Error closing pool:', err);
    }
  }
}

export async function executeQuery(sql, binds = {}, options = {}) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(sql, binds, {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      ...options
    });
    return result;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export async function executeProcedure(procName, binds = {}) {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute(
      `BEGIN ${procName}; END;`,
      binds
    );
    await connection.commit();
    return result;
  } catch (err) {
    console.error('Procedure execution error:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

export { oracledb };

