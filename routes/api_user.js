const express = require("express");
const router = express.Router();
const { pgsql } = require("../utils/utils_postgres.js");
const tools_api = require("../utils/utils_api.js");
const tools_jwt = require('../utils/utils_jwt');


/*
*  API GET 
*  endpoint: {{name_service}}/api/v1/user
*
* */
router.get("/userlist/:page/:limit", async function(req, res, next){

    const page = req.params.page || 1; // halaman yang di-request (default 1)
    const limit = req.params.limit || 10; // jumlah data per halaman (default 10)
    const offset = (page - 1) * limit;

    try{
        const token = req.headers.authorization?.split(' ')[1];
        const validation = await tools_jwt.verifyJwt(token);
        
        if (validation.err != null){
            return tools_api.err500(req, res, {}, validation.err);
        }

        // todo pagination
        await pgsql.query(`
            SELECT * FROM users 
            ORDER BY id 
            LIMIT $1 OFFSET $2
        `, [limit, offset], async function(resultOfQuery){
            const data  = resultOfQuery;
            return tools_api.ok200(req, res, data)
        }, function(err){
            const e = `something goes wrong: ${err}`;
            console.error(e);
            return tools_api.err500(req, res, {}, e)
        })
    }catch(err){
        const e = `SERVER ERROR: ${err}`;
        console.error(e)
        return tools_api.err500(req, res, {}, e)
    }
});

module.exports = router