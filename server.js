import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd(), port=Number(process.env.PORT || 3000);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.woff2':'font/woff2'};
http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const name=decodeURIComponent(url.pathname)==='/' ? '/index.html' : decodeURIComponent(url.pathname);
    const file=path.resolve(root, '.'+name);
    if (!file.startsWith(root+path.sep)) {res.writeHead(403); return res.end('Forbidden');}
    const content=await readFile(file); res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'}); res.end(content);
  } catch {res.writeHead(404); res.end('Not found');}
}).listen(port,'0.0.0.0',()=>console.log(`واژه‌راه is listening on ${port}`));
