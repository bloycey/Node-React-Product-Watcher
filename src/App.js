import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AddProductBasic from "./components/AddProductBasic";
import OuterGrid from "./components/OuterGrid";
import Product from "./components/Product";
import logo from './logo.svg';
import './App.css';
const { ipcRenderer } = window.require('electron');

class App extends Component {
  state = {
    productList: {},
    numOfItems: 0,
    history: [],
    response: ''
  };

  componentDidMount() {
    this.loadFromLocal();
    window.addEventListener("beforeunload", (this.saveStateToLocalStorage.bind(this)))
    ipcRenderer.on('product-price', (event, data) => {
      if (data.status == 200) {
        console.log(data);
        const products = {...this.state.productList};
        products[`product${Date.now()}`] = data;
        this.setState({productList: products});
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


  addProduct = (product) => {
    this.callApi(`addproduct/${product.name}/${product.selector}/?url=${product.url}`)
    .then(res => {
      const products = {...this.state.productList};
      products[`product${Date.now()}`] = res;
      this.setState({productList: products});
    }
    )
    .catch(err => console.log(err));
  }

  addProductBasic = (product) => {
    ipcRenderer.send('add-product', product.name, product.url);
  }

  setPrice = (setPrice, id, type, index) => {
    let products = {...this.state.productList};
    products[id].price = setPrice;
    products[id].type = type;
    products[id].priceIndex = index;
    products[id].editMode = false;
    this.setState({productList: products});
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
      // const endPoint = `addproduct/${products[key].name}/${products[key].selector.replace('#', '%23')}/?url=${products[key].url}`;
      // this.callApi(endPoint)
      // .then(res => {
      //   const allProducts = {...this.state.productList};
      //   allProducts[key] = res;
      //   this.setState({productList: allProducts});
      // })
    })  
  }  


  render() {

    
    return (
      
      <div className="App">
      <br/>
      <br/>
      <OuterGrid addProduct={this.addProductBasic}/>
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
      </div>
    );
  }
}

export default App;