import * as dotenv from "dotenv";
import express = require("express");
import * as bodyParser from "body-parser";
import cors = require("cors");
import { middleware } from "express-ctx";
import env from "./env";

import usersRoute from "./routes/userRoutes";
import commonRoute from "./routes/CommonRoute";
import TTSM001Route from "./routes/TTSM001Route";
import TTSM003Route from "./routes/TTSM003Route";
import TTSM004Route from "./routes/TTSM004Route";
import TTSM005Route from "./routes/TTSM005Route";
import TTSM006Route from "./routes/TTSM006Route";
import TTSM009Route from "./routes/TTSM009Route";
import TTSM007Route from "./routes/TTSM007Route";
import TTSM012Route from "./routes/TTSM012Route";
import TTSM013Route from "./routes/TTSM013Route";
import TTSM019Route from "./routes/TTSM019Route";
import TTSM018Route from "./routes/TTSM018Route";
import TTSM016Route from "./routes/TTSM016Route";
import TTSM017Route from "./routes/TTSM017Route";
import TTSM020Route from "./routes/TTSM020Route";
import TTSM021Route from "./routes/TTSM021Route";
import TTSM022Route from "./routes/TTSM022Route";
import TTSM031Route from "./routes/TTSM031Route";
import TTSM032Route from "./routes/TTSM032Route";
import TTSM034Route from "./routes/TTSM034Route";
import TTSM035Route from "./routes/TTSM035Route";
import TTSM067Route from "./routes/TTSM067Route";
import TTSM040Route from "./routes/TTSM040Route";
import TTSM041Route from "./routes/TTSM041Route";
import TTSM048Route from "./routes/TTSM048Route";
import TTSM170Route from "./routes/TTSM170Route";
import TTSC001Route from "./routes/TTSC001Route";
import TTSC002Route from "./routes/TTSC002Route";
import TTSC003Route from "./routes/TTSC003Route";
import TTSM014Route from "./routes/TTSM014Route";
import TTSM015Route from "./routes/TTSM015Route";
import TTSM008Route from "./routes/TTSM008Route";
import TTSM008DRoute from "./routes/TTSM008DRoute";
import TTSC004Route from "./routes/TTSC004Route";
import TTSC005Route from "./routes/TTSC005Route";
import TTSC006Route from "./routes/TTSC006Route";
import TTSC009Route from "./routes/TTSC009Route";
import TTSC010Route from "./routes/TTSC010Route";
import TTSC015Route from "./routes/TTSC015Route";
import oracledb from "oracledb";
import TSMCSSF001Route from "./routes/TSMCSSF001Route";
// import SMCS001Route from "./routes/SMCS001Route";
// import SMCS002Route from "./routes/SMCS002Route";
import TTSM047Route from "./routes/TTSM047Route";
import TTSM049Route from "./routes/TTSM049Route";
import TTSM050Route from "./routes/TTSM050Route";
import TTSM054Route from "./routes/TTSM054Route";
import TTSC012Route from "./routes/TTSC012.Route";
import TTSC013Route from "./routes/TTSC013Route";
// process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

export class App {
  public app: express.Application;
  pool: any;

  constructor() {
    this.app = express();
    // this.getPool();
    //this.closePoolAndExit();
  }

  enableCors() {
    var whitelist = env.whitelistdUrl;
    const options: cors.CorsOptions = {
      methods: "",
      origin: function (origin: any, callback: any) {
        if (
          whitelist?.indexOf("*") !== -1 ||
          whitelist.indexOf(origin) !== -1
        ) {
          callback(null, true);
        } else {
          callback("Not allowed by CORS");
        }
      },
    };
    this.app.use(cors(options));
    //this.app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  listen() {
    //this.enableCors();
    var https = require("https");
    var fs = require("fs");
    var https_options = {
      key: fs.readFileSync("/etc/ssl/wildcorptslnew.key"),
      cert: fs.readFileSync("/etc/ssl/ServerCertificate.crt"),
      ca: [fs.readFileSync("/etc/ssl/ChainCert.crt")],
    };

    https.createServer(https_options, this.app).listen(`${env.appport}`, () => {
      console.log(`${"TSM TUBES MES"} running → PORT ${env.appport}`);
      console.log(`Server Run Port: ${env.appport}`);
      this.middler();
      this.routes();
    });
  }

  localhost_listen() {
    this.app.listen(env.appport, () => {
      console.log(`${"TSM TUBES MES"} running → PORT ${env.appport}`);
      console.log(`Server Run Port: ${env.appport}`);
      this.middler();
      this.routes();
    });
  }

  middler() {
    this.enableCors();
    this.app.use(middleware);
    //this.app.use(bodyParser.json());
    //this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(bodyParser.json({ limit: "200mb" }));
    this.app.use(
      bodyParser.urlencoded({
        limit: "200mb",
        extended: true,
        parameterLimit: 50000,
      })
    );

    // ✅ Handle JSON parse errors
    this.app.use((err: any, req: any, res: any, next: any) => {
      if (err instanceof SyntaxError && 'body' in err) {
        console.error("Invalid JSON:", err.message);

        return res.status(400).json({
          status: false,
          Err: "Invalid JSON format"
        });
      }
      next(err);
    });
  }

  routes() {
    this.app.use("/api", usersRoute);
    this.app.use("/api/common/", commonRoute);
    this.app.use("/api/ttsm001/", TTSM001Route);
    this.app.use("/api/ttsm003/", TTSM003Route);
    this.app.use("/api/ttsm004/", TTSM004Route);
    this.app.use("/api/ttsm005/", TTSM005Route);
    this.app.use("/api/ttsm006/", TTSM006Route);
    this.app.use("/api/ttsm009/", TTSM009Route);
    this.app.use("/api/ttsm007/", TTSM007Route);
    this.app.use("/api/ttsm012/", TTSM012Route);
    this.app.use("/api/ttsm013/", TTSM013Route);
    this.app.use("/api/ttsm019/", TTSM019Route);
    this.app.use("/api/ttsm016/", TTSM016Route);
    this.app.use("/api/ttsm017/", TTSM017Route);
    this.app.use("/api/ttsm018/", TTSM018Route);
    this.app.use("/api/ttsm020/", TTSM020Route);
    this.app.use("/api/ttsm021/", TTSM021Route);
    this.app.use("/api/ttsm022/", TTSM022Route);
    this.app.use("/api/ttsm031/", TTSM031Route);
    this.app.use("/api/ttsm032/", TTSM032Route);
    this.app.use("/api/ttsm034/", TTSM034Route);
    this.app.use("/api/ttsm035/", TTSM035Route);
    this.app.use("/api/ttsm067/", TTSM067Route);
    this.app.use("/api/ttsm040/", TTSM040Route);
    this.app.use("/api/ttsm041/", TTSM041Route);
    this.app.use("/api/ttsm048/", TTSM048Route);
    this.app.use("/api/ttsm170/", TTSM170Route);
    this.app.use("/api/Ttsc001/", TTSC001Route);
    this.app.use("/api/Ttsc002/", TTSC002Route);
    this.app.use("/api/ttsc003/", TTSC003Route);
    this.app.use("/api/ttsm014/", TTSM014Route);
    this.app.use("/api/ttsm015/", TTSM015Route);
    this.app.use("/api/TTSM008/", TTSM008Route);
    this.app.use("/api/TTSM008D/", TTSM008DRoute);
    this.app.use("/api/ttsc004/", TTSC004Route);
    this.app.use("/api/ttsc006/", TTSC006Route);
    this.app.use("/api/ttsc005/", TTSC005Route);
    this.app.use("/api/TTSC009/", TTSC009Route);
    this.app.use("/api/ttsc010/", TTSC010Route);
    this.app.use("/api/ttsc015/", TTSC015Route);
    this.app.use("/api/tsmcssf001/", TSMCSSF001Route);
    // this.app.use("/api/smcs001/", SMCS001Route);
    // this.app.use("/api/smcs002/", SMCS002Route);
    this.app.use("/api/TTSM047/",TTSM047Route);
    this.app.use("/api/TTSM049/",TTSM049Route);
    this.app.use("/api/TTSM050/",TTSM050Route);
    this.app.use("/api/TTSM054/",TTSM054Route);
    this.app.use("/api/ttsc012/", TTSC012Route);
    this.app.use("/api/ttsc013/", TTSC013Route);
  }
}
