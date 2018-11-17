import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import styled from "styled-components";


class PricePick extends React.Component {

    render(){

    const PaperWrapper = styled.div`

    display: inline-block;

    > .price-paper {
        width: 125px;
        display: inline-block;
        margin: 8px;
    }
    `

    const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, id} = this.props.currentItem;
    const itempropPrices = itemprop.map((price, index) => (
        <PaperWrapper key={index}>
        <Paper className="price-paper" onClick={() => this.props.setPrice(price, id, "itemprop", index)}>
        <span className="price-type">Itemprop</span>
            <h2 className="product-price">{price}</h2>
        </Paper>
        </PaperWrapper>
    ))

    return(
    <div>
        {itempropPrices}
    </div>
    )
    }
}

export default PricePick;