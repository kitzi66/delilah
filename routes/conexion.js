const mysql = require('mysql2/promise')

/*async function conecta(){
    return await mysql.createConnection({host: 'localhost',user: 'kabarca',database: 'delilah_bd',password: 'pass123*1'})
}*/

var connection = mysql.createConnection({host: 'localhost',user: 'kabarca',database: 'delilah_bd',password: 'pass123*1'})
//var connection = conecta()

module.exports = connection
