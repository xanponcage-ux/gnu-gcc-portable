import * as dotenv from "dotenv";
import express = require("express");
import * as bodyParser from "body-parser";
import cors = require("cors");
import { middleware } from "express-ctx";
import env from "./env";

import usersRoute from "./routes/userRoutes";
import commonRoute from "./routes/CommonRoute";
import LDSM001Route from "./routes/LDSM001Route";
import LDSM003Route from "./routes/LDSM003Route";
import LDSM004Route from "./routes/LDSM004Route";
import LD01S001Route from "./routes/LD01S001Route";
import LD0RS001Route from "./routes/LD0RS001Route";
import LD0XS001Route from "./routes/LD0XS001Route";
import LD0YS001Route from "./routes/LD0YS001Route";
import LDSM005Route from "./routes/LDSM005Route";
import LDSM006Route from "./routes/LDSM006Route";
import LDSM009Route from "./routes/LDSM009Route";
import LDSM007Route from "./routes/LDSM007Route";
import LDSM012Route from "./routes/LDSM012Route";
import LDSM013Route from "./routes/LDSM013Route";
import LDSM018Route from "./routes/LDSM018Route";
import LDSM016Route from "./routes/LDSM016Route";
import LDSM017Route from "./routes/LDSM017Route";
import LDSM020Route from "./routes/LDSM020Route";
import LDSM021Route from "./routes/LDSM021Route";
import LDSM022Route from "./routes/LDSM022Route";
import LDSM023Route from "./routes/LDSM023Route";
import LDSM024Route from "./routes/LDSM024Route";
import LD50S003Route from "./routes/LD50S003Route";
import LDSM032Route from "./routes/LDSM032Route";
import LDSM034Route from "./routes/LDSM034Route";
import LDSM035Route from "./routes/LDSM035Route";
import LDSM067Route from "./routes/LDSM067Route";
import LDSM040Route from "./routes/LDSM040Route";
import LDSM041Route from "./routes/LDSM041Route";
import LDSM048Route from "./routes/LDSM048Route";
import LD01S002Route from "./routes/LD01S002Route";
import LD01S004Route from "./routes/LD01S004Route";
import LD01S005Route from "./routes/LD01S005Route";
import LD01S007Route from "./routes/LD01S007Route";
import LD01S009Route from "./routes/LD01S009Route";
import LD01S010Route from "./routes/LD01S010Route";
import LDSC001Route from "./routes/LDSC001Route";
import LDSC002Route from "./routes/LDSC002Route";
import LDSC003Route from "./routes/LDSC003Route";
import LDSM014Route from "./routes/LDSM014Route";
import LDSM015Route from "./routes/LDSM015Route";
import LDSM008Route from "./routes/LDSM008Route";
import LDSC004Route from "./routes/LDSC004Route";
import LDSC005Route from "./routes/LDSC005Route";
import LDSC006Route from "./routes/LDSC006Route";
import LDSC009Route from "./routes/LDSC009Route";
import LDSC010Route from "./routes/LDSC010Route";
import LDSC011Route from "./routes/LDSC011Route";
import LDSC012Route from "./routes/LDSC012Route";
import LDSC013Route from "./routes/LDSC013Route";

import LD03S001Route from "./routes/LD03S001Route";
import LD01S003Route from "./routes/LD01S003Route";
import LD02S001Route from "./routes/LD02S001Route";
import LD04S001Route from "./routes/LD04S001Route";
import LD05S001Route from "./routes/LD05S001Route";
import LD06S001Route from "./routes/LD06S001Route";
import LD10S001Route from "./routes/LD10S001Route";
import LDR1S001Route from "./routes/LDR1S001Route";
// import LDS090Route from "./routes/LDS090Route";
// import LDS100Route from "./routes/LDS100Route";
import LD11S001Route from "./routes/LD11S001Route";
import LD12S001Route from "./routes/LD12S001Route";
import LD13S001Route from "./routes/LD13S001Route";
import LD16S001Route from "./routes/LD16S001Route";
import LD16S002Route from "./routes/LD16S002Route";
import LD14S001Route from "./routes/LD14S001Route";
import LD15S001Route from "./routes/LD15S001Route";
import oracledb from "oracledb";
import TSMCSSF001Route from "./routes/TSMCSSF001Route";
import LDS268Route from "./routes/LDS268Route";
// import LD50S001Routes from "./routes/LD50S001Routes";
import LD50S002Route from "./routes/LD50S002Route";
import LD50S001Route from "./routes/LD50S001Route";
import LD08S001Route from "./routes/LD08S001Route";
import LD08S003Route from "./routes/LD08S003Route";
import LD08S002Route from "./routes/LD08S002Route";
import LD09S001Route from "./routes/LD09S001Route";
import LD09S002Route from "./routes/LD09S002Route";
import LD13S002Route from "./routes/LD13S002Route";
import LDLTS002Route from "./routes/LDLTS002Route";
import LDLTS001Route from "./routes/LDLTS001Route";
import LDLTS003Route from "./routes/LDLTS003Route";
import LDLTS008Route from "./routes/LDLTS008Route";
import LDLTS08DRoute from "./routes/LDLTS08DRoute";
import LDLTS009Route from "./routes/LDLTS009Route";

import LDLTS004Route from "./routes/LDLTS004Route";
import LDLTS005Route from "./routes/LDLTS005Route";
import LDLTS006Route from "./routes/LDLTS006Route";
import LDLTS010Route from "./routes/LDLTS010Route";
import LD50S005Route from "./routes/LD50S005Route";
import LD0RS002Route from "./routes/LD0RS002Route";

//DISPATCH
import LD01S006Route from "./routes/LD01S006Route";
import LD01S008Route from "./routes/LD01S008Route";

//Compliance Report
import LDCR001Route from "./routes/LDCR001Route";
import LDCR002Route from "./routes/LDCR002Route";
import LDCR003Route from "./routes/LDCR003Route";
import LDCR004Route from "./routes/LDCR004Route";

import LD02S002Route from "./routes/LD02S002Route";
import LDLTS007Route from "./routes/LDLTS007Route";

//page

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
      console.log(`${"LDPIS MES"} running → PORT ${env.appport}`);
      console.log(`Server Run Port: ${env.appport}`);
      this.middler();
      this.routes();
    });
  }

  localhost_listen() {
    this.app.listen(env.appport, () => {
      console.log(`${"LDPIS MES"} running → PORT ${env.appport}`);
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
  }

  routes() {
    this.app.use("/api", usersRoute);
    this.app.use("/api/common/", commonRoute);
    this.app.use("/api/LDSM001/", LDSM001Route);
    this.app.use("/api/LD50S001/", LD50S001Route);
    this.app.use("/api/LD50S002/", LD50S002Route);
    this.app.use("/api/LDS268/", LDS268Route);
    this.app.use("/api/LDSM003/", LDSM003Route);
    this.app.use("/api/LDSM004/", LDSM004Route);
    this.app.use("/api/LD01S001/", LD01S001Route);
    this.app.use("/api/LD0RS001/", LD0RS001Route);
    this.app.use("/api/LD0XS001/", LD0XS001Route);
    this.app.use("/api/LD0YS001/", LD0YS001Route);
    this.app.use("/api/LDSM005/", LDSM005Route);
    this.app.use("/api/LDSM006/", LDSM006Route);
    this.app.use("/api/LDSM009/", LDSM009Route);
    this.app.use("/api/LDSM007/", LDSM007Route);
    this.app.use("/api/LDSM012/", LDSM012Route);
    this.app.use("/api/LDSM013/", LDSM013Route);
    this.app.use("/api/LDSM016/", LDSM016Route);
    this.app.use("/api/LDSM017/", LDSM017Route);
    this.app.use("/api/LDSM018/", LDSM018Route);
    this.app.use("/api/LDSM020/", LDSM020Route);
    this.app.use("/api/LDSM021/", LDSM021Route);
    this.app.use("/api/LDSM022/", LDSM022Route);
    this.app.use("/api/LDSM023/", LDSM023Route);
    this.app.use("/api/LDSM024/", LDSM024Route);
    this.app.use("/api/LD50S003/", LD50S003Route);
    this.app.use("/api/LDSM032/", LDSM032Route);
    this.app.use("/api/LDSM034/", LDSM034Route);
    this.app.use("/api/LDSM035/", LDSM035Route);
    this.app.use("/api/LDSM067/", LDSM067Route);
    this.app.use("/api/LDSM040/", LDSM040Route);
    this.app.use("/api/LDSM041/", LDSM041Route);
    this.app.use("/api/LDSM048/", LDSM048Route);
    this.app.use("/api/LD01S002/", LD01S002Route);
    this.app.use("/api/LD01S004/", LD01S004Route);
    this.app.use("/api/LD01S005/", LD01S005Route);
    this.app.use("/api/LD01S010/", LD01S010Route);
    this.app.use("/api/LD01S007/", LD01S007Route);
    this.app.use("/api/LD01S009/", LD01S009Route);
    this.app.use("/api/LDSC001/", LDSC001Route);
    this.app.use("/api/LDSC002/", LDSC002Route);
    this.app.use("/api/LDSC003/", LDSC003Route);
    this.app.use("/api/LDSM014/", LDSM014Route);
    this.app.use("/api/LDSM015/", LDSM015Route);
    this.app.use("/api/LDSM008/", LDSM008Route);
    this.app.use("/api/LDSC004/", LDSC004Route);
    this.app.use("/api/LDSC006/", LDSC006Route);
    this.app.use("/api/LDSC005/", LDSC005Route);
    this.app.use("/api/LDSC009/", LDSC009Route);
    this.app.use("/api/LDSC010/", LDSC010Route);
    this.app.use("/api/LDSC011/", LDSC011Route);
    this.app.use("/api/LDSC012/", LDSC012Route);
    this.app.use("/api/LDSC013/", LDSC013Route);

    this.app.use("/api/LD01S003/", LD01S003Route);

    this.app.use("/api/LD02S001/", LD02S001Route);
    this.app.use("/api/LD03S001/", LD03S001Route);
    this.app.use("/api/LD04S001/", LD04S001Route);
    this.app.use("/api/LD05S001/", LD05S001Route);
    this.app.use("/api/LD06S001/", LD06S001Route);
    this.app.use("/api/LD10S001/", LD10S001Route);
    this.app.use("/api/LD08S001/", LD08S001Route);
    this.app.use("/api/LD08S003/", LD08S003Route);
    this.app.use("/api/LD08S002/", LD08S002Route);
    this.app.use("/api/LD09S001/", LD09S001Route);
    this.app.use("/api/LD09S002/", LD09S002Route);
    this.app.use("/api/LD13S002/", LD13S002Route);
    this.app.use("/api/LD16S002/", LD16S002Route);
    this.app.use("/api/LDR1S001/", LDR1S001Route);
    this.app.use("/api/LD0RS002/", LD0RS002Route);

    // this.app.use("/api/LDS090/", LDS090Route);
    // this.app.use("/api/LDS100/", LDS100Route);
    this.app.use("/api/LD11S001/", LD11S001Route);
    this.app.use("/api/LD12S001/", LD12S001Route);
    this.app.use("/api/LD16S001/", LD16S001Route);
    this.app.use("/api/LD13S001/", LD13S001Route);
    this.app.use("/api/LD14S001/", LD14S001Route);
    this.app.use("/api/LD15S001/", LD15S001Route);

    this.app.use("/api/tsmcssf001/", TSMCSSF001Route);

    //QUALITY
    this.app.use("/api/LDLTS001/", LDLTS001Route);
    this.app.use("/api/LDLTS002/", LDLTS002Route);
    this.app.use("/api/LDLTS003/", LDLTS003Route);
    this.app.use("/api/LDLTS008/", LDLTS008Route);
    this.app.use("/api/LDLTS009/", LDLTS009Route);

    this.app.use("/api/LDLTS004/", LDLTS004Route);
    this.app.use("/api/LDLTS005/", LDLTS005Route);
    this.app.use("/api/LDLTS006/", LDLTS006Route);
    this.app.use("/api/LDLTS010/", LDLTS010Route);
    this.app.use("/api/LDLTS007/", LDLTS007Route);

    //PLANNING
    this.app.use("/api/LD50S005/", LD50S005Route);

    //DISPATCH
    this.app.use("/api/LD01S006/", LD01S006Route);
    this.app.use("/api/LD01S008/", LD01S008Route);

    //Compliance Report
    this.app.use("/api/LDCR001/", LDCR001Route);
    this.app.use("/api/LDCR002/", LDCR002Route);
    this.app.use("/api/LDCR003/", LDCR003Route);
    this.app.use("/api/LDCR004/", LDCR004Route);

    this.app.use("/api/LD02S002/", LD02S002Route);

    //Delay
    this.app.use("/api/LDLTS08D/", LDLTS08DRoute);
  }
}
