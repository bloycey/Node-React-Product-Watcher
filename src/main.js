const electron = require('electron');
const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const Store = require('electron-store');
const store = new Store();

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
    mainWindow = new BrowserWindow({ width: 1350, height: 750 });

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

    //TODO: Remove letters

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
    if (metapricelength > 0) {
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
    console.log("itemproplength " + itemproplength)
    let itempropArray = [];
    if (itemproplength > 0) {
        for (let i = 0; i < itemproplength; i++) {
            //First look for the content attribute
            if (selector[i].attribs.content) {
                // console.log("itemprop1", selector[i].attribs.content);
                itempropArray.push(selector[i].attribs.content);
            }
            // Then look for the price directly within the itemprop tag;
            if (selector[i].children[0] !== undefined) {
                // console.log("itemprop2", selector[i].children[0].data)
                itempropArray.push(selector[i].children[0].data);
            }
            //Next Look for a span within the itemprop (this is a common pattern);
            if (selector[i].children[0] !== undefined && selector[i].children[0].next !== null) {
                if (selector[i].children[0].next.name == 'span') {
                    // console.log("itemprop3", selector[i].children[0].next.children[0].data)
                    itempropArray.push(selector[i].children[0].next.children[0].data)
                }
            }
        }
    }
    if (priceIndex == 9999) {
        return sanitizeArray(itempropArray);
    } else {
        let sanitizedArray = sanitizeArray(itempropArray);
        return sanitizedArray[priceIndex];
    }
}

const scrapeGenericMeta = (selector, priceIndex = 9999) => {
    const genericMetaLength = selector.length;
    let genericMetaRaw = [];
    if (genericMetaLength > 0) {
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
    var customHeaderRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36' }
    })
    console.log("url " + url)
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = new Date().toLocaleString('en-AU', options);
    const editMode = true;
    let prices, image, jsonld, jsonldlength, metalength, itemproplength, itempropSelector, genericMeta, genericMetaLength, metaprice, itemprop, all, pricesString, status;

    customHeaderRequest.get(url, function (err, resp, html) {
        if (!err) {
            const $ = cheerio.load(html);
            image = $("meta[property='og:image']").attr("content");
            status = resp.statusCode;

            jsonld = [];
            metaprice = [];
            itemprop = [];
            genericMeta = [];

            // 1.1 JSONLD
            jsonld = scrapeJson(html, jsonPriceRegex);

            // 1.2 Meta Price (using the facebook meta recommendations)
            metaprice = scrapeMeta($("meta[property='product:price:amount']"));

            // 1.3 Itemprop Price
            itemprop = scrapeItemprop($("[itemprop='price']"));

            // 1.4 Generic Meta
            genericMeta = scrapeGenericMeta($("meta[property='price']"));

            // res.send({jsonld, metaprice, itemprop, genericMeta, status})
            // console.log(jsonld, metaprice, itemprop, genericMeta, status);
            const productObject = {
                "productName": productName,
                "url": productUrl,
                "dateAdded": date,
                "date": date,
                "jsonld": jsonld,
                "metaprice": metaprice,
                "itemprop": itemprop,
                "genericMeta": genericMeta,
                "price": "",
                "shippingPrice": "0.00",
                "totalPrice": "0",
                "type": "",
                "priceIndex": "",
                "editMode": true,
                "status": status,
                "updating": false,
                "movement": {
                    trend: "No Movement Detected"
                }
            }
            mainWindow.send('product-price', productObject)
        }

    });
})

ipc.on('update-product', (event, productData) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const date = new Date().toLocaleString('en-AU', options);
    const data = productData;
    // console.log(data);
    const url = data.url;
    var customHeaderRequest = request.defaults({
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36' }
    })
    customHeaderRequest.get(url, function (err, resp, html) {
        if (!err) {
            const $ = cheerio.load(html);
            status = resp.statusCode;
            switch (data.type) {
                case "jsonld":
                    console.log("updated jsonld");
                    let jsonld = scrapeJson(html, jsonPriceRegex, data.priceIndex);
                    mainWindow.send('price-updated', data.id, jsonld, date);
                    break;
                case "metaprice":
                    console.log("updated metaprice");
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

ipc.on('save-state', (event, stateData) => {
    store.set('state', stateData);
    console.log(store.get('state'))
})

ipc.on('get-state', (event) => {
    const state = store.get('state');
    mainWindow.send('state-retrieved', state);
})