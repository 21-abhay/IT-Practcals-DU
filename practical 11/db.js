const mysql = require('mysql')


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '' ,
    // database: 'students'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS students`;
    con.query(createDatabaseQuery, (err, result) => {
      if (err) {
        console.error('Error creating database:', err);
      } else {
        console.log('Database created successfully');
        con.changeUser({ database: `students` }, (err) => {
          if (err) {
            console.error('Error switching to the new database:', err);
            return con.end();
          }
          createTables();
        })
        
      }
    });
});

const createTables = ()=>{
    const credentials = `CREATE TABLE IF NOT EXISTS credentials(
        userid varchar(40) NOT NULL PRIMARY KEY,
        name varchar(30) NOT NULL,
        email varchar(30) NOT NULL,
        mobile bigint(12) NOT NULL,
        password varchar(30) NOT NULL
    )`;
    con.query(credentials,(err,result)=>{
        if(err){
            return console.log("create table error ",err);
        }
        console.log("Database and table created successfully...")
    })
}


module.exports = con;