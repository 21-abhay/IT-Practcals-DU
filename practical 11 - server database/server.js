const http = require('http');
const con = require('./db');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
let login ='';
let signup ='';
fs.readFile('login.html',(err,data)=>{
    if(err){
        return console.log("File Read Error : ",err);
    }
    login = data;
});
fs.readFile('signup.html',(err,data)=>{
    if(err){
        return console.log("File Read Error : ",err);
    }
    signup = data;
});

const server = http.createServer((req,res)=>{
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    res.writeHead(200, {'Content-Type': 'text/html'});
    if(req.method === 'GET'){
        if (path === '/' || path ==='/login'){
            res.write(login);
            res.end();
        }
        else if (path === '/signup') {
            res.end(signup);
        }
        else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('404 Not Found');
        }
    }
    else if(req.method === 'POST'){
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const formData = querystring.parse(body);
            if (path === '/loginpost') {
                const {userid,password} = formData;
                const fetch = `SELECT * FROM credentials WHERE userid='${userid}'`;
                con.query(fetch,(err,result)=>{
                    if(err){
                        console.log("Error in fetching Login data  : ",err);
                        return res.end(`There is some error in login <br> ${err}`)
                    }
                    if(result[0]){
                        if(password === result[0].password){
                            res.end(`Login successfully...`);
                        }
                        else{
                            res.end('Please with valid Credential <br> or First create new account..')
                        }
                    }
                    else{
                        res.end('Please with valid Credential <br> or First create new account..')
                    }
                })
            }
            else if(path==='/signuppost'){
                const {userid,password,name,email,mobile} = formData;
                const insert = `INSERT INTO credentials(userid, name, email, mobile, password) VALUES ('${userid}','${name}','${email}',${mobile},'${password}')`;
                con.query(insert,(err,result)=>{
                    if(err){
                        console.log("Insertin error  : ",err)
                        res.end(`There is some error in signup <br> ${err}`)
                    }
                    res.end(`Sing-Up successfully....<br> Now You can Login with your userid and password...<br><a href='/login'>Login</a>`)
                })
            }
        });
    }
});


server.listen(8000,()=>{
    console.log(`http://localhost:8000`)
})