import dbConfig from "./db/config.ts";

export default {
    camelCase: false,
    outFile: 'db/types/db.d.ts',
    url: `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`,
}