import React, { Component } from 'react';

class Product extends React.Component {

    render() {
    const {name, price, prices, url, selector, date, image, editMode} = this.props.details;
    const id = this.props.id;
    let singleProductList = {};
    singleProductList[this.props.id] = this.props.details;
    
    
    const pricelist = prices.map((price, index) =>
        <button onClick={() => this.props.setPrice(price, this.props.id, index)} key={index}>{price}</button>
    )
        return (
            <li>
                {editMode == true &&
                    pricelist
                }
                key: {id} <br/>    
                Name: {name} <br/>
                {image !== undefined &&
                    <img src={image} alt={name}/>
                }
                Price: {price} <br/>
                Url: {url}<br/>
                Selector: {selector}<br/>
                Last Updated: {date} <br/>
                <button onClick={() => this.props.refreshProducts(singleProductList)}>Refresh</button>
                <button onClick={() => this.props.deleteProduct(id)}>Delete Product</button>
                <button onClick={() => this.props.toggleEditMode(id)}>Toggle Edit Panel</button>
            </li>         
        );
    }
}

export default Product;