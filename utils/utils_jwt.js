const jwt = require('jsonwebtoken');
const config = require('../config/config');

const key = config.app().auth.key;


this.createToken = (payload) => {
    return jwt.sign(payload, key, { expiresIn: '1h' });
}

this.verifyJwt = async function(token){
    try {
        const decoded = await jwt.verify(token, key);
        return { err: null, decoded: decoded };
    } catch (err) {
        return { err: err, decoded: null };
    }
}


module.exports = this;