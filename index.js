const express = require('express')
const app = express()
const port = 3000

const conexion = require('./routes/conexion');

function usaDb(req, res, next){
    conexion.then( con => {
        req.db = con;
        console.log('Entro UsaDB')
        next()
    });

    
}
app.use(usaDb);

var usuarios = require('./routes/usuarios')
var logueo = require('./routes/logueo')



app.use('/usuarios', usuarios)
app.use('/logueo', logueo)


app.use((err, req, res, next)=>{
    if(!err) return next();
    console.log('Error => ', err)
    res.status(500).send('Error')
})

app.listen(port, ()=>{
    console.log('Servidor Levantado...')
})