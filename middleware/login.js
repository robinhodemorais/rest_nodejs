const jwt = require('jsonwebtoken');

//obrigatorio token
exports.obrigatorio = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token.toString(), process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (error) {
        return res.status(401).send({error: error, mensagem:'Falha na autenticação'});
    }
    
}

//mesmo se não passa o token, continua
exports.opcional = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token.toString(), process.env.JWT_KEY);
        req.usuario = decode;
        next();
    } catch (error) {
        next();
    }
    
}