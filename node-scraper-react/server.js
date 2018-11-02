const express = require('express');
const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const routes = require('./routes/index');
const port = process.env.PORT || 5000;
const app = express();


//Utility functions

const priceRegex = /\$[0-9\,\.]+/gm;
const jsonPriceRegex = /("price":|'price':)[0-9\."', ]+/gm;

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

//Scraping Methods

const scrapeJson = (source, regex) => {
    let jsonFinal = []
    const jsonRaw = source.match(regex) || [];
    if (jsonRaw.length > 0) {
        Object.values(jsonRaw).map(value => {
            //Remove everything except for floating point numbers
            jsonFinal.push(value.replace(/[^\d.-]/g, ''));
        });
    }
    return jsonFinal;
}

const scrapeMeta = (selector) => {
    const metapricelength = selector.length;
    let metaFinal = []
    if (metapricelength > 0 ) {
        // LOOP HERE AND PUSH PRICES TO ARRAY
        for (let i = 0; i < metapricelength; i++) {
            metaFinal.push(selector[i].attribs.content);
        }
    }
    return metaFinal;
}

const scrapeItemprop = (selector) => {
    const itemproplength = selector.length;
    let itempropArray = [];

    if (itemproplength > 0) {
        for (let i = 0; i < itemproplength; i++) {
            //First look for the content attribute
            itempropArray.push(selector[i].attribs.content);
            // Then look for the price directly within the itemprop tag;
            if (selector[i].children[0] !== undefined) {
                itempropArray.push(selector[i].children[0].data);
            }
            //Next Look for a span within the itemprop (this is a common pattern);
            if(selector[i].children[0].next !== null) {
                if (selector[i].children[0].next.name == 'span') {
                    itempropArray.push(selector[i].children[0].next.children[0].data)
                }
            }
        } 
    }
    return itempropArray; 
}

const scrapeGenericMeta = (selector) => {
    const genericMetaLength = selector.length;
    let genericMetaRaw = [];
    if (genericMetaLength > 0 ) {
        // LOOP HERE AND PUSH PRICES TO ARRAY
        for (let i = 0; i < genericMetaLength; i++) {
            genericMetaRaw.push(selector[i].attribs.content);
        }
    }
    return genericMetaRaw;
}

///

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
            status = resp.statusCode;

                //Method 1 - MetaData
                if(method == 1) {
                    
                    jsonld = [];
                    metaprice = [];
                    itemprop = [];
                    genericMeta = [];

                    // 1.1 JSONLD
                    jsonld = scrapeJson(html, jsonPriceRegex);

                    // 1.2 Meta Price (using the facebook meta recommendations)
                    metaprice = scrapeMeta($("meta[property='product:price:amount']"));

                    // 1.3 Itemprop Price
                    let itempropRaw = scrapeItemprop($("[itemprop='price']"));
                    itemprop = sanitizeArray(itempropRaw);

                    // 1.4 Generic Meta
                    genericMeta = scrapeGenericMeta($("meta[property='price']"))

                    res.send({jsonld, metaprice, itemprop, genericMeta, status})

                } else if (method == 2) {
                //This is where the updating of prices will happen
                //Need to substitute "method" for "function" (get/update)
                    prices = html.match(priceRegex);
                    pricesString = JSON.stringify(prices);
                    res.send({prices, name, url, date, image, editMode});
                } 
            }
            
        }); 
    })


app.listen(port, () => console.log(`Listening on port ${port}`));