import React, { Component } from 'react';
import AddProduct from "./components/AddProduct";
import AddProductBasic from "./components/AddProductBasic";
import Product from "./components/Product";
import logo from './logo.svg';
import './App.css';

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

  testFunction = () => {
    this.callApi("test")
    .then(res => console.log(res.test))
    .catch(err => console.log(err));
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
    this.callApi(`addproductbasic/${product.name}/?url=${product.url}`)
    .then(res => {
      console.log(res);
      // const products = {...this.state.productList};
      // products[`product${Date.now()}`] = res;
      // this.setState({productList: products});
    }
    )
    .catch(err => console.log(err));
  }

  deleteProduct = (key) => {
    let products = {...this.state.productList};
    delete products[key];
    this.setState({productList: products})
  }

  refreshProducts = (products) => {
    Object.keys(products).map(key => {
      const endPoint = `addproduct/${products[key].name}/${products[key].selector.replace('#', '%23')}/?url=${products[key].url}`;
      this.callApi(endPoint)
      .then(res => {
        const allProducts = {...this.state.productList};
        allProducts[key] = res;
        this.setState({productList: allProducts});
      })
    })  
  }

  callApi = async (endpoint) => {
    const response = await fetch(`/api/${endpoint}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };



  render() {
    return (
      <div className="App">
      <br/>
      <br/>
        <AddProductBasic addProduct={this.addProductBasic}/>
        <AddProduct addProduct={this.addProduct}/>
        <ul className="products test">
             {Object.keys(this.state.productList).map(key => (
              <Product
                key={key}
                id={key}
                details={this.state.productList[key]}
                refreshProducts={this.refreshProducts}
                deleteProduct = {this.deleteProduct}
              /> 
            ))} 
        </ul>
        <button onClick={() => this.refreshProducts(this.state.productList)}>Refresh All</button>
      </div>
    );
  }
}

export default App;