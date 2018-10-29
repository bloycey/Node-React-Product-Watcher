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

    app.get('/api/addproductbasic/:name/:method', (req, res) => {
        const name = req.params.name;
        const method = req.params.method;
        const url = req.query.url;
        console.log("url " + url)
        const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}
        const date = new Date().toLocaleString('en-AU', options);
        const editMode = true;
        let prices, image, jsonld, jsonldlength, metalength, itemproplength, itempropSelector, metaprice, itemprop, all, pricesString;

        request(url, function(err, resp, html) {
            if (!err){    
            const $ = cheerio.load(html);
            image = $("meta[property='og:image']").attr("content");
            const priceRegex = /\$[0-9\,\.]+/gm;
            const jsonPriceRegex = /"price":[0-9\. ]+/gm;

            //Method 1 - MetaData
            if(method == 1) {
                jsonld = [];
                metaprice = [];
                itemprop = [];

                // 1.1 JSONLD

                jsonldlength = $("script[type='application/ld+json']:contains('@Offer')").length;
                
                if (jsonldlength > 0) {
                    jsonldRaw = html.match(jsonPriceRegex);
                    jsonldRaw.map(item => {
                        jsonld.push(item.replace('"price":', ''));
                    })
                }
                

                // 1.2 Meta Price
                metapricelength = $("meta[property='product:price:amount']").length;
                console.log(`metaprice length: ${metapricelength}`)

                if (metapricelength > 0 ) {
                    // LOOP HERE AND PUSH PRICES TO ARRAY
                    metaprice = $("meta[property='product:price:amount']").attr("content");
                }

                // 1.3 Itemprop Price
                itemproplength = $("[itemprop='price']").length;
                console.log(`itemprop length: ${itemproplength}`)
                if (itemproplength > 0 ) {
                   for (let i = 0; i < itemproplength; i++) {
                       itemprop.push($("[itemprop='price']")[i].attribs.content)
                   }
                    console.log(itemprop);
                }
                

                res.send({jsonld, metaprice, itemprop})

            } else if (method == 2) {
            //Method 2 - Regex price scraping
                prices = html.match(priceRegex);
                pricesString = JSON.stringify(prices);
            res.send({prices, name, url, date, image, editMode});
            } else if (method == 3) {
            //Method 3 - Selector
            }
            }
            
        }); 
    })


app.listen(port, () => console.log(`Listening on port ${port}`));