const bcrypt = require('bcrypt');

const saltRounds = 10;

this.hashPassword = async function(password){
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return { error_hash: null, hash: hash };
    } catch (err) {
        return { error_hash: err, hash: null };
    }
}

this.comparePassword = async function(password, hashedpassword){
    try {
        const result = await bcrypt.compare(password, hashedpassword);
        return { err: null, result: result };
    } catch (err) {
        return { err: err, result: null };
    }
}

module.exports = this;
