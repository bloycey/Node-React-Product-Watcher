const express = require('express');
const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const routes = require('./routes/index');
const port = process.env.PORT || 5000;
const app = express();

// Do work here
app.get('/', (req, res) => {
    res.send('Hey! It works!');
  });
  
  app.get('/api/hello', (req, res) => {
      res.send({ greeting: 'Server is up and running!'});
    });
    
    app.get('/api/test', (req, res) => {
        res.send({test: 'Gooble gooble'})
    })
    
    app.get('/api/addproduct/:name/:selector', (req, res) => {
        const name = req.params.name;
        const selector = req.params.selector;
        const url = req.query.url;
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
        const date = new Date().toLocaleString('en-AU', options);
        let price;

        request(url, function(err, resp, html) {
            if (!err){
            const $ = cheerio.load(html);
            price = $(selector).text().replace('$', '');
            console.log(price);
            }
            res.send({name, url, selector, price, date});
        });

       
    })


app.listen(port, () => console.log(`Listening on port ${port}`));