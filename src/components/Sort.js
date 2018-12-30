import React, { Component } from 'react';
import '../App.css';


class Sort extends React.Component {
    state = {

    }


    render() {


        return (
            <div>
                <button onClick={() => this.props.sortProducts(this.props.productList, "totalPrice", "desc")}>Sort Total Price Desc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "totalPrice", "asc")}>Sort Total Price Asc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "price", "desc")}>Sort Price Desc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "price", "asc")}>Sort Price Asc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "shippingPrice", "desc")}>Sort Shipping Price Desc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "shippingPrice", "asc")}>Sort Shipping Price Asc</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "productName", "asc")}>Sort by Name (A-Z)</button>
                <button onClick={() => this.props.sortProducts(this.props.productList, "productName", "desc")}>Sort by Name (Z-A)</button>

            </div>
        )
    }
}

export default Sort;