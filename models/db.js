const mongoose = require('mongoose');

const { host , port , database} = {
    host     : "localhost",
    port     : 27017,
    database : "testqq",
};

const connConfig = `mongodb://${host}:${port}/${database}` ;

const conn = mongoose.createConnection(connConfig,{ 
    maxPoolSize: 5 , 
    useNewUrlParser: true ,
});

// Testing conn.
conn.on('connected', () => {
    console.info("MongoDB is connected.");
});

conn.on('error', (err) => {
    console.error("MongoDB conn gets error.");
});

module.exports = conn;

