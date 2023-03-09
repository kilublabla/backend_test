const express = require("express");
const Joi = require("joi");
const router = express.Router();
const { pgsql } = require("../utils/utils_postgres.js");
const tools_api = require("../utils/utils_api.js");
const tools_password = require('../utils/utils_password');
const tools_jwt = require('../utils/utils_jwt');


/*
*  API REGISTER
*  endpoint: {{name_service}}/api/v1/auth/signup
*
* */

router.post("/signup", async function(req, res, next){
    const {
        username, password, full_name
    } = req.body

    const schema = Joi.object({
        username: Joi.string().regex(/^[a-zA-Z]+$/).min(2).required(),
        password: Joi.string().min(5).required(),
        full_name: Joi.string().regex(/^[a-zA-Z\'\-\s]+$/).max(255).required(),
    })

    let { error, value } = schema.validate({
        username,
        password,
        full_name
    })

    if (error){
        const { details } = error; 
        const message = details[0].message;
        return tools_api.err400(req, res, {}, message);
    } 

    // TODO encrypt password
    const encryptPassword = await tools_password.hashPassword(password);

    if (encryptPassword.error_hash != null){
        return tools_api.err500(req, res, {}, x.error_hash);
    }

    let hashedPassword = encryptPassword.hash;
    
    try{
        await pgsql.query(`
            select 1 id_test
            from users 
            where username = $1
        `, [username], async function(check_user){
            if(check_user.length != 0){
                const message = `Username" ${username} already exists`
                return tools_api.err409(req, res, {}, message)
            } 
            await pgsql.query(`
                insert into users (username, password, full_name)
                values ($1, $2, $3)
            `, [username, hashedPassword, full_name], async function(resultOfQuery){
                console.info("resultOfQuery: ", resultOfQuery)
                return tools_api.ok200(req, res, "")
            }, function(err){
                const e = `something goes wrong: ${err}`;
                console.error(e);
                return tools_api.err500(req, res, {}, e)
            })
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

/*
*  API LOGIN
*  endpoint: {{name_service}}/api/v1/auth/login
*
* */

router.post("/login", async function(req, res, next){
    const {
        username, password
    } = req.body

    try{
        await pgsql.query(`
            select id, username, password
            from users
            where username = $1
        `, [username], async function(result){
            if(result.length == 0){
                const message = `Username" ${username} Not found`
                return tools_api.err400(req, res, {}, message)
            }

            // compare password
            const comparePassword = await tools_password.comparePassword(password, result[0]['password']);

            if (comparePassword.err != null){
                return tools_api.err500(req, res, {}, comparePassword.err);
            }

            if (comparePassword.result == false){
                return tools_api.err500(req, res, {}, 'Login Failed, please check username and password!');
            }

            // create jwt token
            const payload = {
                "id": result[0]['id'],
                "full_name": result[0]['full_name']
            };

            const jwt = await tools_jwt.createToken(payload);

            // return token
            return tools_api.ok200(req, res, jwt);

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