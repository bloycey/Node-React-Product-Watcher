import React, { Component } from 'react';
import ProductStepper from "./components/ProductStepper";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import blue from '@material-ui/core/colors/blue';
import ProductTable from "./components/ProductTable";
import format from 'date-fns/format'
import './App.css'
const { ipcRenderer } = window.require('electron');

const theme = createMuiTheme({
  typography: {
    // Use Fira Sans instead of the default Roboto font.
    fontFamily: [
      'Fira Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
    ].join(','),
  },
  palette: {
    primary: blue,
  }
});

class App extends Component {
  state = {
    productList: {},
    numOfItems: 0,
    response: '',
    currentItem: '',
    stepper: 0,
    productLoading: false,
    error: false
  };

  componentDidMount() {
    ipcRenderer.send('get-state');
    ipcRenderer.on('state-retrieved', (event, state) => {
      const {productList, numOfItems, response, currentItem, stepper} = state;
      console.log('state retrieved!! ', state);
      this.setState({
        productList,
        numOfItems,
        response,
        currentItem,
        stepper
      }, () => this.refreshProducts(this.state.productList));
    })
    ipcRenderer.on('product-price', (event, data) => {
      console.log("product price", data.genericMeta, data.itemprop, data.jsonld, data.metaprice, data.status)
      if (data.status == 200 && data.genericMeta.length !== 0 || data.itemprop.length !== 0 || data.jsonld.length !== 0 || data.metaprice.length !== 0){
        console.log(data);
        this.setState({
          currentItem: data,
          stepper: 1,
          response: data.status
        })
      } else {
        this.setState({
          response: data.status
        })
        this.productIsNotLoading();
        this.displayError();
      }
    })
    ipcRenderer.on('price-updated', (event, id, data, date) => {
      console.log("update request", id, data);
      const allProducts = {...this.state.productList};
      allProducts[id].price = data;
      allProducts[id].date = date;
      
      //Create a history item and push to product history array
      const historyItem = {
        date: date,
        price: data
      };
      let productHistory = allProducts[id].history || [];
      productHistory.unshift(historyItem);
      allProducts[id].history = productHistory;

      //Create history for chart
      const chartItem = [format(new Date(), 'YYYY-MM-DD HH:mm:ss Z'), parseFloat(data)];
      let chartData = allProducts[id].chartData || [];
      chartData.push(chartItem);
      allProducts[id].chartData = chartData;

      //Set Highest and Lowest

      let historyPriceArray = [];
      
      productHistory.forEach((arr) => {
        historyPriceArray.push(parseFloat(arr.price));
      })

      let historyDateArray = [];

      productHistory.forEach((arr) => {
        historyDateArray.push(arr.date);
      })

      function lowestPrice(arr){
        let index = 0;
        let value = arr[0];
        for (let i = 1; i < arr.length; i++) {
          if (arr[i] < value) {
            value = arr[i];
            index = i;
          }
        }
        return {
          lowest: value,
          index: index
        }
      }

      const lowestPriceData = lowestPrice(historyPriceArray);
      const lowestPriceValue = lowestPriceData.lowest;
      const lowestPriceIndex = lowestPriceData.index;
      const lowestPriceDate = historyDateArray[lowestPriceIndex];

      function highestPrice(arr){
        let index = 0;
        let value = arr[0];
        for(let i = 1; i < arr.length; i++) {
          if(arr[i] > value) {
            value = arr[i];
            index = i;
          }
        }
        return {
          highest: value,
          index: index
        }
      }

      const highestPriceData = highestPrice(historyPriceArray);
      const highestPriceValue = highestPriceData.highest;
      const highestPriceIndex = highestPriceData.index;
      const highestPriceDate = historyDateArray[highestPriceIndex];

      allProducts[id].lowest = {
        value: lowestPriceValue,
        date: lowestPriceDate
      }

      allProducts[id].highest = {
        value: highestPriceValue,
        date: highestPriceDate
      }

      // Set last movement

      function percentChange(previous, current){
        const difference = previous - current;
        return (difference / previous) * 100;
      }

      function lastMovement(arr) {
        let index = 0;
        let value = arr[0];
        for (let i = 1; i < arr.length; i++) {
          if(arr[i] !== value) {
            return {
              trend: arr[i] > value ? "Down" : "Up",
              from: arr[i],
              to: value,
              index: i,
              percentChange: percentChange(value, arr[i])
            }
            value = arr[i];
            index = i;
          }
        }
        return {
          trend: "No Movement Recorded",
          from: null,
          to: null,
          index: null,
          percentChange: 0,
        };
      }

      const lastMovementData = lastMovement(historyPriceArray);
      console.log("historyPriceArray", historyPriceArray);
      console.log("lastMovementData", lastMovementData);

      allProducts[id].movement = {
        trend: lastMovementData.trend,
        from: lastMovementData.from,
        to: lastMovementData.to,
        date: historyDateArray[lastMovementData.index - 1],
        percentChange: (Math.sign(lastMovementData.percentChange) == 1 ? "+" : "") + (lastMovementData.percentChange).toFixed(2) + "%"
      }

    //Set State

      this.setState({
        productList: allProducts}, () => this.saveAll());
      })
  }
 
  componentWillUnmount() {
    this.saveAll()
  }

  saveAll = () => {
    console.log("save all triggered")
    console.log(this.state);
    ipcRenderer.send('save-state', this.state);
  }

  addProductBasic = (product) => {
    ipcRenderer.send('add-product', product.name, product.url);
  }

  setPrice = (setPrice, id, type, index) => {
    let current = {...this.state.currentItem};
    current.price = setPrice;
    current.type = type;
    current.priceIndex = index;
    current.priceSet = true;
    this.setState({
      currentItem: current,
    });
  }

  addTag = (tag) => {
    let current = {...this.state.currentItem};
    current.tags = current.tags || [];
    current.tags.push(tag);
    this.setState({
      currentItem: current
    })
  }

  deleteTag = (tag) => {
    let current = {...this.state.currentItem};
    const newTags = current.tags.filter(item => item !== tag);
    current.tags = newTags;
    this.setState({
      currentItem: current
    })
  }

  saveCurrent = () => {
    let products = {...this.state.productList};
    products[`product${Date.now()}`] = this.state.currentItem;
    this.setState({
      productList: products,
      stepper: 0,
      currentItem: '',
      productLoading: false
    }, () => this.saveAll())
    
  }


  toggleEditMode = (id) => {
    let products = {...this.state.productList};
    products[id].editMode = !products[id].editMode;
    this.setState({productList: products});
  }

  deleteProduct = (key) => {
    let products = {...this.state.productList};
    delete products[key];
    this.saveAll();
    this.setState({
      productList: products
    })
  }

  refreshProducts = (products) => {
    Object.keys(products).map(key => {
      console.log("full products", products[key]);
      console.log("products type", products[key].type);
      let productToRefresh = {
        "productName": products[key].productName,
        "url": products[key].url,
        "id": products[key].id,
        "type": products[key].type, 
        "priceIndex": products[key].priceIndex
      }
      console.log("product to refresh", productToRefresh);
      ipcRenderer.send('update-product', productToRefresh)
    })  
  }
  
  handleNext = () => {
    this.setState({
      stepper: this.state.stepper + 1,
    });
  };

  handleBack = () => {
    this.setState ({
      stepper: this.state.stepper - 1,
    });
  };

  handleReset = () => {
    this.setState({
      stepper: 0,
    });
  };

  productIsLoading = () => {
    this.setState({
      productLoading: true
    })
  }

  productIsNotLoading = () => {
    this.setState({
      productLoading: false
    })
  }

  displayError = () => {
    this.setState({
      error: true
    })
  }

  hideError = () => {
    this.setState({
      error: false
    })
  }


render() {
    
    return (
      
      <MuiThemeProvider theme={theme}>
      <section className="app-wrapper">
      <ProductStepper addProduct={this.addProductBasic} currentItem={this.state.currentItem} setPrice={this.setPrice} saveCurrent={this.saveCurrent} stepper={this.state.stepper} handleNext={this.handleNext} handleBack={this.handleBack} handleReset={this.handleReset} addTag={this.addTag} deleteTag={this.deleteTag} productIsLoading={this.productIsLoading} productIsNotLoading={this.productIsNotLoading} loading={this.state.productLoading} error={this.state.error} hideError={this.hideError} response={this.state.response}/>
      <br/>
      <br/>
      {Object.keys(this.state.productList).length &&
      <Paper className="products-wrapper">
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Product Price</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell className="text-right">Refresh / Delete</TableCell>
            </TableRow>
            </TableHead>
            {this.state.productList && Object.keys(this.state.productList).map(key => (
              <ProductTable
                key={key}
                id={key}
                details={this.state.productList[key]}
                setPrice={this.setPrice}
                refreshProducts={this.refreshProducts}
                deleteProduct = {this.deleteProduct}
              /> 
            ))}
        </Table>
      </Paper>
      }
        <span onClick={() => this.refreshProducts(this.state.productList)}><i className="material-icons">refresh</i></span>
        <button onClick={() => this.saveAll()}>Save All</button>
        </section>
        </MuiThemeProvider>
    );
  }
}

export default App;