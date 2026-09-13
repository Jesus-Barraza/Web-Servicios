const jwt = require('jsonwebtoken');
require('dotenv').config();

function  verificarToken(req, res, next) {
    //El cliente manda el token
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    
    if(!authHeader){
        return res.status(401).json({error: 'Falta el header authoritativo'});
    }

    //Formato esperado (no se pero es raro comenzando por "Bearer")
    const [esquema, token] = authHeader.split(' ')
    if (esquema !== 'Bearer' || !token.trim()) {
        return res.status(401).json({error: "Formato de authorización incorrecto"});
    }

    try {
        //jwt.verify verifica si la firma coincide - clockTolerance añade 60 segundos de tolerancia para diferencias de reloj
        const payload = jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 60 });
        
        //dejamos los datos disponibles
        req.usuario = payload;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({error: 'Token expirado, inicia sesión de nuevo'});
        }

        return res.status(401).json({error: 'Token inválido'});
    }
}

module.exports = verificarToken;