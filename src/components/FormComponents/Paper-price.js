import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import '../../App.css';


class PaperPrice extends React.Component {

    state = {
        active: false,
    }

    render(){

    const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, id} = this.props.currentItem;

    return(
        <Paper className="price-paper" key={this.props.index} onClick={() => this.props.setPrice(price, id, "itemprop", this.propsindex)}>
        <span className="price-type">Itemprop</span>
            <h2 className="product-price">{price}</h2>
        </Paper>
    )
    }
}

export default PaperPrice;