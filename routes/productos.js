const mysql = require('mysql2/promise')
var express = require('express');
const jwt = require('jsonwebtoken')
var router = express.Router();

var firmaToken = '123pwd'

//const { use } = require('./logueo');

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
router.get('/', async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('SELECT * from platillos')
        return res.json(rows);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: 'Error al consultar los platillos' })
    }
});

router.get('/:id', async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('SELECT * from platillos WHERE id = ?', [req.params.id])
        return res.json(rows);
    } catch (err) {
        return res.status(400).json({message: 'Error al consultar los platillos por id'})
    }
});

// agregar un platillo, validar datos obligatorios, 
// el admon es el unico que puede crear platillos
router.post('/', esAdmon, async function (req, res) {
    try{
    const { nombre, imagen, precio, estatus } = req.body;

    const [rows, fields] = await req.db.execute('INSERT INTO platillos(nombre, imagen, precio, estatus) VALUES(?,?,?,?)', 
        [nombre, imagen, precio, estatus])


    res.status(201).json({id: rows.insertId});
    }catch(error){
        console.log(error)
        res.status(404).json({message: 'Error en datos'})
    }
});

router.put('/:id', esAdmon, async function (req, res) {
    try{
        const { nombre, imagen, precio, estatus } = req.body;

    const [rows, fields] = await req.db.execute('UPDATE platillos SET nombre=?, imagen=?, precio=?, estatus=? WHERE id=?', 
        [nombre, imagen, precio, estatus, req.params.id])

    res.status(200).json({id: req.params.id});
    }catch(error){
        console.log(error)
        res.status(404).json({message: 'Error en datos'})
    }
});

router.delete('/:id', esAdmon, async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('DELETE from platillos WHERE id = ?', [req.params.id])
        return res.status(200).json({message: 'El platillo ha sido eliminado'});
    } catch (err) {
        console.log(err)
        return res.status(400).json({message: 'Error al eliminar el platillo'})
    }
});

module.exports = router;