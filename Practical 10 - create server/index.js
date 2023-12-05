var http = require('http');

const server = http.createServer((request,response)=>{
	response.write("Hello World, This is my Node.js server");
	response.end();
})

server.listen(10000,()=>console.log('server started at port 10000'));