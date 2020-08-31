const express = require('express')
const app = express()
const port = 3000

const conexion = require('./routes/conexion')

function usaDb(req, res, next){
    conexion.then( con => {
        req.db = con;
        console.log('conexion a BD -- OK')
        next()
    });

    
}
app.use(usaDb);

var usuarios = require('./routes/usuarios')
var logueo = require('./routes/logueo')
var productos = require('./routes/productos')
var pedidos = require('./routes/pedidos')


app.use('/usuarios', usuarios)
app.use('/logueo', logueo)
app.use('/productos', productos)
app.use('/pedidos', pedidos)


app.use((err, req, res, next)=>{
    if(!err) return next();
    console.log('Error => ', err)
    res.status(500).send('Error')
})

app.listen(port, ()=>{
    console.log('Servidor Levantado...')
})