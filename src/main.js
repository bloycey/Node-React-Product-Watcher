const electron = require('electron');
const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;

const path = require('path');
const url = require('url');
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 800, height: 600});

    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', () => {
    installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
    createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//Utility functions

const priceRegex = /\$[0-9\,\.]+/gm;
const jsonPriceRegex = /("price":|'price':)[0-9\."', ]+/gm;

const sanitizeArray = (array) => {
    // Remove null values
    let filtered = array.filter((value) => {
        return value != null && value != "" && value != NaN;
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

const scrapeJson = (source, regex, priceIndex = 9999) => {
    let jsonFinal = []
    const jsonRaw = source.match(regex) || [];
    if (jsonRaw.length > 0) {
        Object.values(jsonRaw).map(value => {
            //Remove everything except for floating point numbers
            jsonFinal.push(value.replace(/[^\d.-]/g, ''));
        });
    }
    if (priceIndex == 9999) {
        return jsonFinal;
    } else {
        return jsonFinal[priceIndex];
    }
}

const scrapeMeta = (selector, priceIndex = 9999) => {
    const metapricelength = selector.length;
    let metaFinal = []
    if (metapricelength > 0 ) {
        // LOOP HERE AND PUSH PRICES TO ARRAY
        for (let i = 0; i < metapricelength; i++) {
            metaFinal.push(selector[i].attribs.content);
        }
    }
    if (priceIndex == 9999) {
        return metaFinal;
    } else {
        return metaFinal[priceIndex];
    }
}

const scrapeItemprop = (selector, priceIndex = 9999) => {
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
    if (priceIndex == 9999) {
        return itempropArray; 
    } else {
        return itempropArray[priceIndex]
    }
}

const scrapeGenericMeta = (selector, priceIndex = 9999) => {
    const genericMetaLength = selector.length;
    let genericMetaRaw = [];
    if (genericMetaLength > 0 ) {
        // LOOP HERE AND PUSH PRICES TO ARRAY
        for (let i = 0; i < genericMetaLength; i++) {
            genericMetaRaw.push(selector[i].attribs.content);
        }
    }
    if (priceIndex == 9999) {
        return genericMetaRaw;
    } else {
        return genericMetaRaw[priceIndex];
    }
}


ipc.on('add-product', (event, productName, productUrl) => {
    const name = productName;
    const url = productUrl;
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
                genericMeta = scrapeGenericMeta($("meta[property='price']"));

                // res.send({jsonld, metaprice, itemprop, genericMeta, status})
                // console.log(jsonld, metaprice, itemprop, genericMeta, status);
                const productObject = {
                    "productName": productName,
                    "url": productUrl,
                    "date": date,
                    "jsonld": jsonld,
                    "metaprice": metaprice,
                    "itemprop": itemprop,
                    "genericMeta": genericMeta,
                    "price": "",
                    "type": "",
                    "priceIndex": "",
                    "editMode": true,
                    "status": status
                }
                mainWindow.send('product-price', productObject)
        }
        
    }); 
})

ipc.on('update-product', (event, productData) => {
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
    const date = new Date().toLocaleString('en-AU', options);
    const data = productData;
    console.log(data);
    const url = data.url;
    request(url, function(err, resp, html) {
        if (!err){    
            const $ = cheerio.load(html);
            status = resp.statusCode;
            switch (data.type) {
                case "metaprice":
                console.log("updated metaprice");
                    let jsonld = scrapeJson(html, jsonPriceRegex, data.priceIndex);
                    mainWindow.send('price-updated', data.id, jsonld, date);
                    break;
                case "jsonld":
                console.log("updated jsonld");
                    let metaprice = scrapeMeta($("meta[property='product:price:amount']"), data.priceIndex);
                    mainWindow.send('price-updated', data.id, metaprice, date);
                    break;
                case "itemprop":
                console.log("updated itemprop");
                    let itempropRaw = scrapeItemprop($("[itemprop='price']"), data.priceIndex);
                    mainWindow.send('price-updated', data.id, itempropRaw, date);
                    break;
                case "genericMeta":
                console.log("updated genericMeta");
                    let genericMeta = scrapeGenericMeta($("meta[property='price']"), data.priceIndex);
                    mainWindow.send('price-updated', data.id, genericMeta, date);
                    break;
            }   
        }
    })
    
})