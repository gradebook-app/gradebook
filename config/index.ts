import development from "./env/development";
import production from "./env/production";
import _ from "lodash";

const dynamicConfig = __DEV__ ? development : production; 

const config = _.extend({
    name: "Gradebook"
}, dynamicConfig );

export default config; 