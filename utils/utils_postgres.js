const { Pool } = require("pg");
const Config = require("../config/config.js");

// for connection PG Database
class PGSQLConnection {
    #vpool; // private variable
    #sqlParams; //

    constructor () {
        const { username, password, server, dBPostgres, portPostgres } = Config.database();
        this.#sqlParams = {
            host: server,
            user: username,
            password: password,
            database: dBPostgres,
            port: portPostgres
        };
        this.#vpool = new Pool(this.#sqlParams)
    }

    async query(script, scriptWhere, callback_ok, callback_err, req, res){
        console.info("debug from query", true)
        // console.info("request", req)
        try{
            if(typeof req === 'undefined') req = {};
            await this.#vpool.connect(function(err, client, done){
                if(err){
                    if(typeof req.printLog === 'undefined' || req.printLog) console.info(`${req.TAG} TOOLS_PGSQL_E1: ${script}; ${JSON.stringify(err)}`);
                    console.error("error: 1", err)
                    callback_err(err);
                    return;
                }
                client.query(script, scriptWhere, function(error, result){
                    done();
                    if(error){
                        if(typeof req.printLog === 'undefined' || req.printLog) console.info(`${req.TAG} TOOLS_PGSQL_E2: ${script}; ${JSON.stringify(err)}`);
                        console.error("error: 2", error)
                        callback_err(error)
                        return
                    }
                    if(typeof req.printLog === 'undefined' || req.printLog)console.info(`${ req.TAG}: PGSQL: OK: ${script}`);
                    callback_ok(result.rows)
                });
            });
        }catch(err){
            console.error("Err: ", err)
        }

    }

}
module.exports = {
    pgsql: new PGSQLConnection()
};
