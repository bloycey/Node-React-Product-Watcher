import React, { Component } from 'react';

class Product extends React.Component {

    render() {
    const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex} = this.props.details;
    const id = this.props.id;
    let singleProductList = {};
    singleProductList[this.props.id] = this.props.details;
    singleProductList[this.props.id].id = id;
    let pricelist = [];
    const jsonldlength = jsonld.length;
    const metapricelength = metaprice.length;
    const itemproplength = itemprop.length;
    const genericmetalength = genericMeta.length;
    if (editMode) {
        return (
            <li>
                key: {id} <br/>    
                Name: {productName} <br/>
                Url: {url}<br/>
                Price: {price}<br/>
                Type: {type}<br/>
                Price Index: {priceIndex}<br/>
                MetaPrice: {metaprice.map((price, index) => (
                    <button onClick={() => this.props.setPrice(price, this.props.id, "metaprice", index)} key={index}>{price}</button>
                ))}
                {metapricelength == 0 &&
                    <span>No facebook meta details found</span>
                }
                <br/>
                JsonLd: {jsonld.map((price, index) => (
                    <button onClick={() => this.props.setPrice(price, this.props.id, "jsonld", index)} key={index}>{price}</button>
                ))}
                {jsonldlength == 0 &&
                    <span>No LD+JSON meta details found</span>
                }
                <br/>
                itemProp: {itemprop.map((price, index) => (
                    <button onClick={() => this.props.setPrice(price, this.props.id, "itemprop", index)} key={index}>{price}</button>
                ))}
                {itemproplength == 0 &&
                    <span>No itemprop meta details found</span>
                }    
                <br/>
                GenericMeta: {genericMeta.map((price, index) => (
                    <button onClick={() => this.props.setPrice(price, this.props.id, "genericMeta", index)} key={index}>{price}</button>
                ))}
                {genericmetalength == 0 &&
                    <span>No generic meta details found</span>
                }

                <br/>
                Last Updated: {date} <br/>
                <button onClick={() => this.props.refreshProducts(singleProductList)}>Refresh</button>
                <button onClick={() => this.props.deleteProduct(id)}>Delete Product</button>
                <button onClick={() => this.props.toggleEditMode(id)}>Toggle Edit Panel</button>
            </li>         
        );
    } else {
        return (
            <li>
                Name: {productName} <br/>
                Url: {url}<br/>
                Price: {price}<br/>
                Last Updated: {date} <br/>
                <button onClick={() => this.props.refreshProducts(singleProductList)}>Refresh</button>
                <button onClick={() => this.props.deleteProduct(id)}>Delete Product</button>
                <button onClick={() => this.props.toggleEditMode(id)}>Toggle Edit Panel</button>
            </li>   
        );
    }
    }
}

export default Product;