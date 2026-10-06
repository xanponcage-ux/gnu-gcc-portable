import env from "../../env";
import oracledb from "oracledb";
import { getValue } from "express-ctx";

if (env.deploy == "N") {
  oracledb.initOracleClient({
    libDir: "../../driver/instantclient_21_3",
  });
}
//oracledb.initOracleClient({ libDir: "../driver/instantclient_21_5" });

oracledb.autoCommit = true;

const getConnection = async () => {
  var connection = await oracledb.getConnection();
  return connection;
};

const executeQuery = (query: string, parameters = {}) => {
  return new Promise<any>(async (resolve, reject) => {
    // var pool = await oracledb.getPool();
    // var conn = await pool.getConnection();
    //conn.callTimeout = 10 * 1000;
    let adid = getValue("user");
    let pool = oracledb.getPool(adid);
    let conn = await pool.getConnection();
    try {
      await conn.execute(query, parameters, (errors: any, results: any) => {
        //conn.release();
        if (errors) {
          reject(errors);
        } else {
          resolve(results);
        }
      });
    } catch {
      (error: any) => {
        //conn.release();
        console.log(error, "error block ran");
      };
    } finally {
      await conn.close();
    }
  });
};

const executeMany = (query: string, bindArray: any[]) => {
  return new Promise<any>(async (resolve, reject) => {
    let adid = getValue("user");
    let pool = oracledb.getPool(adid);
    let conn;

    try {
      conn = await pool.getConnection();

      const result = await conn.executeMany(query, bindArray, {
        autoCommit: true,
      });

      resolve(result);
    } catch (error) {
      console.log("executeMany error:", error);
      reject(error);
    } finally {
      if (conn) {
        await conn.close();
      }
    }
  });
};

const testExecuteQuery = async (query: string, parameters = {}) => {
  let conn;
  try {
    // Get connection using async/await
    conn = await oracledb.getConnection({
      user: getValue("userad"),
      password: getValue("userps"),
      connectString: getValue("userdb"),
    });

    // Set call timeout (e.g., 5 minutes for large operations)
    conn.callTimeout = 15000000; // 300 seconds

    // Execute query using async/await
    const result = await conn.execute(query, parameters, {
      autoCommit: true, // Ensure COMMIT happens
      outFormat: oracledb.OUT_FORMAT_OBJECT, // Optional: return objects instead of arrays
    });

    return result;
  } catch (error: any) {
    console.error("testExecuteQuery error:", error);
    throw error;
  } finally {
    // Always close connection
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.error("Error closing connection:", err);
      }
    }
  }
};

export default { executeQuery, testExecuteQuery, executeMany };
