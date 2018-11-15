import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


class Options extends React.Component {


    render(){
        const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, id} = this.props.currentItem;
        const itempropPrices = itemprop.map((price, index) => (
            <Paper className="price-paper" onClick={() => this.props.setPrice(price, id, "itemprop", index)}>
            <span className="price-type">Itemprop</span>
                <h2 className="product-price">{price}</h2>
            </Paper>
        ))

        return(
        <div>
            {itempropPrices}
        </div>
        )
    }
}

export default Options;