const mysql = require('mysql2/promise')
var express = require('express');
const jwt = require('jsonwebtoken')
var router = express.Router();

var firmaToken = '123pwd'

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

function esAdmon(req, res, next) {
    console.log(req.usuario.role)
    if (req.usuario.role == 1)
        return next();
    res.status(401).json({ mensaje: 'Usted necesita permisos de administrador' })
}

router.use(express.json())

// middleware that is specific to this router
router.use(validaToken);


// obtiene una lista de usuarios -  se debe validar que tenga permisos de administrador, 
// sino solo envia la informacion del usuario logueado
router.get('/', async function (req, res) {
    try {
        let rows;
        let fields;
        let datos;

        if (req.usuario.role == 1) {
            [rows, fields] = await req.db.execute('SELECT * from pedidos')
        } else {
            [rows, fields] = await req.db.execute('SELECT * from pedidos WHERE usuario_id=?', [req.usuario.id])
        }

        datos = JSON.stringify(rows)
        datos1 = JSON.parse(datos)
        for (let i in datos1) {
            const [rows_detalle, fields_detalle] = await req.db.execute('SELECT * from detalle_pedido WHERE pedido_id = ?', [datos1[i].id])
            datos1[i].detalle = rows_detalle;
        }

        return res.status(200).json(datos1);
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error al consultar los pedidos por id' })
    }
});

router.get('/:id', async function (req, res) {
    try {
        let rows;
        let fields;
        let datos;

        if (req.usuario.role == 1) {
            [rows, fields] = await req.db.execute('SELECT * from pedidos WHERE id = ?', [req.params.id])
        } else {
            [rows, fields] = await req.db.execute('SELECT * from pedidos WHERE usuario_id=? and id = ?', [req.usuario.id, req.params.id])
        }

        const [rows_detalle, fields_detalle] = await req.db.execute('SELECT * from detalle_pedido WHERE pedido_id = ?', [req.params.id])

        datos = await rows.map(obj => {
            let temporal = {}
            temporal.id = obj.id
            temporal.usuario_id = obj.usuario_id
            temporal.total = obj.total
            temporal.forma_pago = obj.forma_pago
            temporal.estatus = obj.estatus

            temporal.detalle = rows_detalle
            return temporal
        });

        return res.status(200).json(datos);
    } catch (err) {
        print(err)
        return res.status(400).json({ message: 'Error al consultar los pedidos por id' })
    }
});

router.post('/', async function (req, res) {
    try {
        let total = 0
        let rows;
        let fields;
        const { forma_pago, estatus, detalle } = req.body;
        [rows, fields] = await req.db.execute('INSERT INTO pedidos(usuario_id, total, forma_pago, estatus) VALUES(?,?,?,?)',
            [req.usuario.id, total, forma_pago, estatus])
        let pedido_id = rows.insertId

        for (let i in detalle) {
            [rows, fields] = await req.db.execute('INSERT INTO detalle_pedido(pedido_id, platillo_id, cantidad, precio) VALUES(?,?,?,?)',
                [pedido_id, detalle[i].platillo_id, detalle[i].cantidad, detalle[i].precio])
            total += detalle[i].cantidad * detalle[i].precio
        }

        [rows, fields] = await req.db.execute('UPDATE pedidos SET total=? WHERE id=?',
            [total, pedido_id])

        res.status(201).json({ id: pedido_id });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: 'Error en datos' })
    }
});

router.put('/:id', esAdmon, async function (req, res) {
    try {
        const { estatus } = req.body;

        const [rows, fields] = await req.db.execute('UPDATE pedidos SET estatus=? WHERE id=?',
            [estatus, req.params.id])

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: 'Error en datos' })
    }
});

router.delete('/:id', esAdmon, async function (req, res) {
    try {
        const [rows, fields] = await req.db.execute('DELETE from pedidos WHERE id = ?', [req.params.id])
        return res.status(200).json({ message: 'El pedido ha sido eliminado' });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ message: 'Error al eliminar el pedido' })
    }
});

module.exports = router;