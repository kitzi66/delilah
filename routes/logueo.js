const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
var express = require('express')
var router = express.Router()

var firmaToken = '123pwd'

router.use(express.json())
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.post('/', async function(req, res) {
    try{
        const {usuario, password} = req.body;

        const [rows, fields] = await req.db.execute('SELECT * from usuarios WHERE username = \'' + usuario + '\' AND password=\'' + password + '\'')
        if(rows[0] == null){
            throw 'Usuario/Password no valido'
        }

        const informacion = {
            id: rows[0].id,
            role: rows[0].role
        }
        const token = jwt.sign(informacion, firmaToken)

        await guardaToken(req.db, rows[0], token)

        res.status(200).json({token: token});
    }catch(err){
        console.error(err)
        res.status(400).json({message: 'Error al consultar los usuario'})
    }
});

async function guardaToken(db, usuario, token){
    
    const [rows, fields] = await db.execute('UPDATE usuarios SET token_actual = \'' + token + '\' WHERE id = \'' + usuario.id + '\'')
    console.log(rows)
    return true
}

async function validaToken(db, usuario, token){
    const [rows, fields] = await db.execute('SELECT estatus WHERE token_actual = \'' + token + '\' AND id = \'' + usuario.id + '\'')
    if(rows.length > 0){
        return true
    }
    return false
}

module.exports = router;