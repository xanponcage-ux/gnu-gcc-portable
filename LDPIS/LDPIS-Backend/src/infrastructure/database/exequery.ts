import env from "../../env";
import oracledb from "oracledb";
import { getValue } from "express-ctx"

if (env.deploy == "N") {
    oracledb.initOracleClient({
        libDir: "../../driver/instantclient_21_3"

    })
}

oracledb.autoCommit = true;

const executeQuery = (query: string, parameters = {}) => {
    return new Promise<any>(async (resolve, reject) => {
        let adid = getValue('userad');
        let pool = oracledb.getPool(adid);
        let conn = await oracledb.getConnection({
            user: getValue('userad'),
            password: getValue('userps'),
            connectString: getValue('userdb'),
        });
        try {
            await conn.execute(query, parameters, (errors: any, results: any) => {
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
            await conn.close();
        }
    });
};

export default executeQuery;
