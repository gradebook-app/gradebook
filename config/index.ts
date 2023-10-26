import development from "./env/development";
import production from "./env/production";
import extend from "lodash/extend";

const dynamicConfig = __DEV__ && process.env.APP_SERVER !== "production" ? development : production; 

const config = extend({
    name: "Gradebook",
    iap: {
        skus: [
            "donate_one", 
            "donate_three", 
            "donate_five" 
        ] 
    }
}, dynamicConfig );

export default config; 