export interface IGenesisConfig {
    root: string;
    auth: string;
}

export const genesisConfig:{[key : string]: IGenesisConfig} = {
    "sbstudents.org": {
        "root": "https://parents.sbschools.org/genesis",
        "auth": "/sis/j_security_check",
    },
    "mtsdstudent.us": {
        "root": "https://parents.mtsd.k12.nj.us/genesis",
        "auth": "/sis/j_security_check",
    }
};