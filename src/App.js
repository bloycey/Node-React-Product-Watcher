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
      });
    })
    ipcRenderer.on('product-price', (event, data) => {
      if (data.status == 200) {
        console.log(data);
        this.setState({
          currentItem: data,
          stepper: 1
        })
      } else {
        console.log("This website cannot be scraped")
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
    this.setState({
      productList: products
    }, () => this.saveAll())
  }

  refreshProducts = (products) => {
    Object.keys(products).map(key => {
      console.log("full product", products[key]);
      console.log("products type", products[key].type);
      let productToRefresh = {
        "productName": products[key].productName,
        "url": products[key].url,
        "id": products[key].id,
        "type": products[key].type, 
        "priceIndex": products[key].priceIndex
      }
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


render() {
    
    return (
      
      <MuiThemeProvider theme={theme}>
      <section className="app-wrapper">
      <ProductStepper addProduct={this.addProductBasic} currentItem={this.state.currentItem} setPrice={this.setPrice} saveCurrent={this.saveCurrent} stepper={this.state.stepper} handleNext={this.handleNext} handleBack={this.handleBack} handleReset={this.handleReset} addTag={this.addTag} deleteTag={this.deleteTag}/>
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