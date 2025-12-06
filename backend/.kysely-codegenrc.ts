import sqlConfig from "./src/config/sql.config.ts";

export default {
    camelCase: false,
    outFile: 'src/database/types/db.d.ts',
    url: `postgresql://${sqlConfig.user}:${sqlConfig.password}@${sqlConfig.host}:${sqlConfig.port}/${sqlConfig.database}`,
}