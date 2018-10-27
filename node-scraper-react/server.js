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
        let price, image;

        request(url, function(err, resp, html) {
            if (!err){
            const $ = cheerio.load(html);
            price = $(selector).text().replace('$', '');
            image = $("meta[property='og:image']").attr("content");
            console.log(price);
            }
            res.send({name, url, selector, price, date, image});
        }); 
    })

    app.get('/api/addproductbasic/:name', (req, res) => {
        const name = req.params.name;
        const url = req.query.url;
        console.log("url " + url)
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
        const date = new Date().toLocaleString('en-AU', options);
        const editMode = true;
        let prices, image, jsonld, jsonldlength, metaprice, itemprop, all, pricesString;

        request(url, function(err, resp, html) {
            if (!err){
            const $ = cheerio.load(html);
            priceRegex = /\$[0-9\,\.]+/g;
            prices = html.match(priceRegex);
            console.log("prices", typeof prices, prices);
            pricesString = JSON.stringify(prices);
            console.log("pricesString", typeof pricesString, pricesString)
            // jsonldlength = $("script[type='application/ld+json']").length;
            // jsonld = JSON.parse($("script[type='application/ld+json']")[0].children[0].data);
            // metaprice = $("meta[property='product:price:amount']").attr("content");
            // itemprop = $("[itemprop='price']").attr("content");
            image = $("meta[property='og:image']").attr("content");
            // console.log($("meta[property='product:price:amount']").attr("content"))
            // console.log("jsonld " + jsonld + " typeof " + typeof jsonld);
            // console.log("metaprice " + metaprice)
            // console.log("itemprop " + itemprop)
            // console.log("image " + image);
            }
            res.send({prices, name, url, date, image, editMode});
        }); 
    })


app.listen(port, () => console.log(`Listening on port ${port}`));