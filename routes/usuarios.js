const mysql = require('mysql2/promise')
var express = require('express');
const jwt = require('jsonwebtoken')
var router = express.Router();

var firmaToken = '123pwd'

const { use } = require('./logueo');


/*async function conecta() {
    return await mysql.createConnection({
        host: 'localhost',
        user: 'kabarca',
        database: 'delilah_bd',
        password: 'pass123*1'
    })
}*/

function validaToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const verificarToken = jwt.verify(token, firmaToken)
        if (verificarToken) {
            req.usuario = verificarToken
            next()
        }
    } catch (error) {
        res.status(403).json({ mensaje: 'Error al validar el usuario' })
    }
}

function esAdmon(req, res, next){
    console.log(req.usuario.role)
    if(req.usuario.role == 1) 
        return next();
    res.status(401).json({mensaje: 'Usted necesita permisos de administrador'})
}

router.use(express.json())

// middleware that is specific to this router
router.use(validaToken);


// obtiene una lista de usuarios -  se debe validar que tenga permisos de administrador, 
// sino solo envia la informacion del usuario logueado
router.get('/', esAdmon, async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('SELECT * from usuarios')
        return res.json(rows);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error al consultar los usuario' })
    }
});

router.get('/:id', async function (req, res) {
    try {
        if(req.usuario.role == 0 && req.params.id != req.usuario.id){
            return res.status(404).json({message: 'Usted solo puede consultar la informacion de su usuario'})
        }
        const [rows, fields] = await req.db.execute('SELECT * from usuarios WHERE id = ?', [req.params.id])
        return res.json(rows);
    } catch (err) {
        return res.status(400).json({message: 'Error al consultar los usuarios por id'})
    }
});

// agregar un nuevo usuario, validar datos obligatorios, 
// el admon es el unico que puede poner permiso de admon, sino es No admon
router.post('/', async function (req, res) {
    try{
    const { username, nombre, email, telefono, direccion, password, role } = req.body;

    let newRole = role;
    if(req.usuario.role == 0){
        newRole = 0;
    }

    const [rows, fields] = await req.db.execute('INSERT INTO usuarios(username, nombre, email, telefono, direccion, password, role) VALUES(?,?,?,?,?,?,?)', 
        [username, nombre, email, telefono, direccion, password, newRole])


    res.status(201).json({id: rows.insertId});
    }catch(error){
        console.log(error)
        res.status(404).json({message: 'Error en datos'})
    }
});

router.put('/', async function (req, res) {
    try{
    const { id, username, nombre, email, telefono, direccion, password, role } = req.body;

    let newRole = role;
    if(req.usuario.role == 0){
        newRole = 0;
    }

    const [rows, fields] = await req.db.execute('UPDATE usuarios SET username=?, nombre=?, email=?, telefono=?, direccion=?, password=?, role=? WHERE id=?', 
        [username, nombre, email, telefono, direccion, password, newRole, id])

    res.status(200).json({id: id});
    }catch(error){
        console.log(error)
        res.status(404).json({message: 'Error en datos'})
    }
});

router.delete('/:id', esAdmon, async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('DELETE from usuarios WHERE id = ?', [req.params.id])
        return res.status(200).json({message: 'El usuario ha sido eliminado'});
    } catch (err) {
        debugger
        console.log(err)
        return res.status(400).json({message: 'Error al eliminar el usuario'})
    }
});

module.exports = router;