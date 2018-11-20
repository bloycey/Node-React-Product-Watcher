import React, { Component } from 'react';
import ProductStepper from "./components/ProductStepper";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import Product from "./components/Product";
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
    history: [],
    response: '',
    currentItem: '',
    stepper: 0
  };

  componentDidMount() {
    this.loadFromLocal();
    window.addEventListener("beforeunload", (this.saveStateToLocalStorage.bind(this)))
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
      this.setState({productList: allProducts});
    })

  }
 
  componentWillUnmount() {
    window.removeEventListener("beforeunload",this.saveStateToLocalStorage.bind(this));
    // saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  loadFromLocal() {
    for (let key in this.state) {
      if (localStorage.hasOwnProperty(key)) {
        let value = localStorage.getItem(key)
        try {
          value = JSON.parse(value);
          this.setState({ [key]: value });
        } catch (e) {
          // handle empty string
          this.setState({ [key]: value });
        }
      }
    }
  }

  saveStateToLocalStorage() {
    for(let key in this.state) {
      localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
  }


  addProductBasic = (product) => {
    ipcRenderer.send('add-product', product.name, product.url);
  }

  setPrice = (setPrice, id, type, index) => {
    let current = {...this.state.currentItem};
    current.price = setPrice;
    current.type = type;
    current.priceIndex = index;
    this.setState({
      currentItem: current,
    });
  }

  saveCurrent = () => {
    let products = {...this.state.productList};
    products[`product${Date.now()}`] = this.state.currentItem;
    this.setState({
      productList: products,
      stepper: 0,
      currentItem: '',
    })
  }

  toggleEditMode = (id) => {
    let products = {...this.state.productList};
    products[id].editMode = !products[id].editMode;
    this.setState({productList: products});
  }

  deleteProduct = (key) => {
    let products = {...this.state.productList};
    delete products[key];
    this.setState({productList: products})
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
      <ProductStepper addProduct={this.addProductBasic} currentItem={this.state.currentItem} setPrice={this.setPrice} saveCurrent={this.saveCurrent} stepper={this.state.stepper} handleNext={this.handleNext} handleBack={this.handleBack} handleReset={this.handleReset}/>
      <br/>
      <br/>
        <ul className="products test">
             {Object.keys(this.state.productList).map(key => (
              <Product
                key={key}
                id={key}
                details={this.state.productList[key]}
                setPrice={this.setPrice}
                refreshProducts={this.refreshProducts}
                deleteProduct = {this.deleteProduct}
                toggleEditMode = {this.toggleEditMode}
              /> 
            ))} 
        </ul>
        <button onClick={() => this.refreshProducts(this.state.productList)}>Refresh All</button>
        </section>
        </MuiThemeProvider>
    );
  }
}

export default App;