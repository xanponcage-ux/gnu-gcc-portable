const soap = require("strong-soap").soap;
const constants = require("constants");
import env from "../env";
class soapHandeler {
  //conn: oracleConnection;

  constructor() {
    //this.conn = new oracleConnection();
  }

  async validate_call(username: any, password: any) {
    let output: any;
    let result: any;
    let promise: any;
    let array: any;
    try {
      if (username && password) {
        var requestArgs = {
          domain: "TATASTEEL",
          userName: username,
          password: password,
        };

        // var options = {
        //   rejectUnauthorized: false,
        //   strictSSL: false,
        //   secureOptions: constants.SSL_OP_NO_TLSv1_2,
        // };
        var options = {};

        promise = new Promise((resolve, reject) => {
          soap.createClient(
            env.SOAP_URL,
            options,
            function (err: any, client: any) {
              var method = client["GenericIsAuthenticatedWithMessage"];
              method(
                requestArgs,
                function (
                  err: any,
                  result: any,
                  envelope: any,
                  soapHeader: any
                ) {
                  resolve(result);
                }
              );
            }
          );
        });

        var res = await promise
          .then((result: any) => {
            if (
              result.GenericIsAuthenticatedWithMessageResult == "Authenticated"
            ) {
              output = true;

              return output;
            } else {
              output = false;

              return output;
            }
          })
          .catch((error: any) => {
            return error;
          });
      } else {
        output = false;
        return output;
      }
    } catch (error) {
      return false;
      //throw e;
    }
    return res;
  }
}

export default new soapHandeler();
