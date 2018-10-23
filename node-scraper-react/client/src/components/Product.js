import React, { Component } from 'react';

class Product extends React.Component {

    render() {
    const {name, price, url, selector, date} = this.props.details;
    const id = this.props.id;

    let singleProductList = {};
    singleProductList[this.props.id] = this.props.details;
    
        return (
            <li>
                key: {this.props.id} <br/>    
                Name: {name} <br/>
                Price: {price} <br/>
                Url: {url}<br/>
                Selector: {selector}<br/>
                Last Updated: {date} <br/>
                <button onClick={() => this.props.refreshProducts(singleProductList)}>Refresh</button>
                <button onClick={() => this.props.deleteProduct(id)}>Delete Product</button>
            </li>         
        );
    }
}

export default Product;