import development from "./env/development";
import production from "./env/production";
import extend from "lodash/extend";

const dynamicConfig = !__DEV__ && process.env.APP_SERVER !== "production" ? development : production; 

const config = extend({
    name: "Gradebook",
    donateLink: "https://gofund.me/0985ba53"
}, dynamicConfig );

export default config; 