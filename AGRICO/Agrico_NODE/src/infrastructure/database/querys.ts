import env from "../../env";
import oracledb from "oracledb";
import { getValue } from "express-ctx"



if (env.deploy == "N") {
  oracledb.initOracleClient({
    libDir: "../../driver/instantclient_21_3"

  })
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
    let adid = getValue('user')
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
    }
    finally {
      await conn.close();
    }
  });
};

const testExecuteQuery = (query: string, parameters = {}) => {
  return new Promise<any>(async (resolve, reject) => {
    let adid = getValue('userad');
    let conn = await oracledb.getConnection({
      user: getValue('userad'),
      password: getValue('userps'),
      connectString: getValue('userdb'),
    }, function (err: any, conn: any) {
      try {
        conn.execute(query, parameters, (errors: any, results: any) => {
          if (errors) {
            reject(errors);
          } else {
            resolve(results);
          }
        });
      } catch {
        (error: any) => {
          console.log(error, "error block ran");
        };
      }
      finally {
        if (err) { reject(err); }
      }
    });
  });
};

export default { executeQuery, testExecuteQuery };
