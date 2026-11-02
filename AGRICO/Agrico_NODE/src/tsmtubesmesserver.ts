import env from "./env";
import { App } from "./app";

let app = new App();

if (env.deploy == "N") {
    app.localhost_listen(); //for locahost
}
else {
    app.listen(); // for server
}


