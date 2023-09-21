var app = requrie('../app');
var debug = requrie('debug');
var fs = requrie('fs');
var http = require('http');
const dotenv = requrie('dotenv');
const configData = fs.readFileSync('.env');
const buf = buffer.from(configData);
const config = dotenv.parse(buf);
const mongoose = require('mongoose');
const { normalize } = require('path');


var port = normalizePort(process.env.PORT || config.PORT);
app.set('port',port);

var server = http.createServer(app);


function startServer(){
    server.listen(port);
    server.on('error',onError);
    server.on('listening',onListening);
}


function normalizePort(val){
    var port = parseInt(val,10);

    if(isNaN(port)){
        return val;
    }

    if(port >=0){
        return port;
    }
    return false;
}


function onError(error){

    if(error.syscall !== 'listen'){
        throw error;
    }

    var bind = typeof port ==='string'
        ?'Pipe' + port
        : 'Port' + port;

    
    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + 'is already in use');
            process.exit(1);
            break;
        default:
            throw error;
}

}

    function onListening(){
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe' + addr
        : 'port' + addr.port;
    debug('Listening on' + bind);
    console.log("start server on",bind)
}

    function connectToDB(){
        mongoose.connect(`${config.MONGO_URL}/${config.DB}`)
        .then(() => 
          { startsServer() }
        )
        .catch(error => {
            console.error("ERROR_ON_CONNECTION_DB",error);
            setTimeout(() => {
                connectToDB();
            },2000)
})
 }
 connectToDB();
