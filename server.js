'use strict';

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  const systemHeader = req.headers['user-agent'];
  const systemStr = systemHeader.match(/\([^)]+\)/g)[0];
  const system = systemStr.substr(1, systemStr.length-2);
  const ip = req.headers['x-forwarded-for'].split(',')[0];
  const lang = req.headers['accept-language'].replace(/;/g, ',').split(',').filter(item => /\D+-\D+/.test(item))[0];
        
  let data = {
    ip: ip,
    lang: lang,
    software: system
  };
  
  console.log(data);

  res.json(data);
});

// Respond not found to all the wrong routes
app.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

// Error Middleware
app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})

app.listen(process.env.PORT, () => {
  console.log('Node.js listening ...');
});