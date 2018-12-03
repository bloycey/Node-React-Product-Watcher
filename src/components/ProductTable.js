import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tag from './FormComponents/micro/Tag';

const ProductTable = (props) => {
    
    const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, tags} = props.details;
    const id = props.id;
    // let singleProductList = {};
    // singleProductList[this.props.id] = this.props.details;
    // singleProductList[this.props.id].id = id;
    // let pricelist = [];
    // const jsonldlength = jsonld.length;
    // const metapricelength = metaprice.length;
    // const itemproplength = itemprop.length;
    // const genericmetalength = genericMeta.length;

    return (
            <TableBody>
                <TableRow>
                    <TableCell>{productName}</TableCell>
                    <TableCell>
                    <ul className="tags-table-wrapper">
                        {tags && tags.map((tag)=> {
                            return <li key={tag}>{tag}</li>
                        })}
                    </ul>
                    </TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>Refresh/Delete</TableCell>
                </TableRow>
            </TableBody>
    )
}

export default ProductTable;