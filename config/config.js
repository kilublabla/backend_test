class Config {
    #env = ['dev', 'prod'];

    // please changes this config methods app for a need development
    // this methods requirement for config these service
    app(){
        return {
            env: this.#env[0], // dev: development or local and staging
            port_internal : 3000,
            api_prefix: '/api',
            api_version1: '/v1',
            cors: {
                whitelist:[
                    'http://localhost',
                    'http://localhost:8080',
                    'http://localhost:3000'
                ]
            },
            auth: {
                jwt: '',
                key: 'imp2023'
            }
        }
    }

    // configuration for database call
    database(){
        return {
            username:"postgres",
            password:"123",
            server: "localhost",
            dBPostgres: "backend_test_imp",
            portPostgres: 5432
        }
    }

}

module.exports = new Config();
