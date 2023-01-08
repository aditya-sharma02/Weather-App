
const http = require('http');
const fs = require('fs');
const homefile = fs.readFileSync('home.html', 'utf-8');
var requests = require("requests");

const replaceval = (tempval, orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=jaipur&units=metric&appid=79608bc9b655550d0b27e94f833b67d9')
            .on('data', (chunk) =>{
                const objdata = JSON.parse(chunk)
                const arrdata = [objdata];
                const realtimedata = arrdata.map((val)=>replaceval(homefile,val)).join("")
                res.write(realtimedata)

            })
            .on('end', (err) =>{
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }else {
        res.end("File not found")
    }
});
server.listen(8000,'127.0.0.1',()=>{
    console.log('responding to your request')
})