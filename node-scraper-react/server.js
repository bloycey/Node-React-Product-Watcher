const express = require('express');
const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const routes = require('./routes/index');
const port = process.env.PORT || 5000;
const app = express();

// Do work here


//Utility functions

const sanitizeArray = (array) => {
    // Remove null values
    let filtered = array.filter((value) => {
        return value != null && value != "";
    })

    // Remove blank spaces
    let trimmed = filtered.map(value => {
        return value.trim();
    })

    // Remove dollar signs
    let dollarSignRemoved = trimmed.map(value => {
        return value.replace("$", "");
    })
    
    let removeEmpty = dollarSignRemoved.filter((value) => {
        return value != "";
    })
    return removeEmpty; 
}


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
        let prices, image, jsonld, jsonldlength, metalength, itemproplength, itempropSelector, genericMeta, genericMetaLength, metaprice, itemprop, all, pricesString, status;

        request(url, function(err, resp, html) {
            if (!err){    
            const $ = cheerio.load(html);
            image = $("meta[property='og:image']").attr("content");
            const priceRegex = /\$[0-9\,\.]+/gm;
            const jsonPriceRegex = /("price":|'price':)[0-9\."' ]+/gm;
            console.log(resp.statusCode)
            status = resp.statusCode;

            //Method 1 - MetaData
            if(method == 1) {
                jsonld = [];
                metaprice = [];
                itemprop = [];
                genericMeta = [];

                // 1.1 JSONLD
                
                    jsonldRaw = html.match(jsonPriceRegex) || [];
                    console.log(`jsonldRaw: ${jsonldRaw}`);
                    console.log(typeof jsonldRaw);
                    if (jsonldRaw.length > 0) {
                        Object.values(jsonldRaw).map(value => {
                            //Remove everything except for floating point numbers
                            jsonld.push(value.replace(/[^\d.-]/g, ''));
                        });
                    }
                

                // 1.2 Meta Price
                metapricelength = $("meta[property='product:price:amount']").length;
                console.log(`metaprice length: ${metapricelength}`)

                if (metapricelength > 0 ) {
                    // LOOP HERE AND PUSH PRICES TO ARRAY
                    for (let i = 0; i < metapricelength; i++) {
                        metaprice.push($("meta[property='product:price:amount']")[i].attribs.content);
                    }
                }

                // 1.3 Itemprop Price
                itemproplength = $("[itemprop='price']").length;
                console.log(`itemprop length: ${itemproplength}`);
                if (itemproplength > 0) {
                    for (let i = 0; i < itemproplength; i++) {
                        //First look for the content attribute
                        itemprop.push($("[itemprop='price']")[i].attribs.content);
                        // Then look for the price directly within the itemprop tag;
                        if ($("[itemprop='price']")[i].children[0] !== undefined) {
                            itemprop.push($("[itemprop='price']")[i].children[0].data);
                        }
                        //Next Look for a span within the itemprop (this is a common pattern);
                        if($("[itemprop='price']")[i].children[0].next !== null) {
                            if ($("[itemprop='price']")[i].children[0].next.name == 'span') {
                                itemprop.push($("[itemprop='price']")[i].children[0].next.children[0].data)
                            }
                        }
                    }
                } 

                itemprop = sanitizeArray(itemprop);

                // 1.4 Generic Meta

                genericMetaLength = $("meta[property='price']").length;

                if (genericMetaLength > 0 ) {
                    // LOOP HERE AND PUSH PRICES TO ARRAY
                    for (let i = 0; i < genericMetaLength; i++) {
                        genericMeta.push($("meta[property='price']")[i].attribs.content);
                    }
                }

                res.send({jsonld, metaprice, itemprop, genericMeta, status})

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