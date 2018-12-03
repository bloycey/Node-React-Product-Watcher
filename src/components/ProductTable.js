import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Tag from './FormComponents/micro/Tag';

class ProductTable extends React.Component {

    state = {
        expanded: false
    }

    toggleExpanded = () => {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
    
    const {productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, tags} = this.props.details;
    const id = this.props.id;

    let singleProductList = {};
    singleProductList[this.props.id] = this.props.details;
    singleProductList[this.props.id].id = id;

    let expandIcon = this.state.expanded === true ? "expand_less" : "expand_more";


    return (
            <TableBody>
                <TableRow>
                    <TableCell><span className="name-cell">{productName}</span><span className="float-right" onClick={this.toggleExpanded}><i className="material-icons">{expandIcon}</i></span></TableCell>
                    <TableCell>
                    <ul className="tags-table-wrapper">
                        {tags && tags.map((tag)=> {
                            return <li key={tag}>{tag}</li>
                        })}
                    </ul>
                    </TableCell>
                    <TableCell>{price}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell>
                        <button onClick={() => this.props.refreshProducts(singleProductList)}>Refresh</button>
                        <button onClick={() => this.props.deleteProduct(id)}>Delete Product</button></TableCell>
                </TableRow>
                {this.state.expanded === true &&
                    <TableRow>
                        <TableCell colSpan={5}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum ad molestias consectetur libero, reprehenderit blanditiis deleniti dolor veritatis dolore iusto assumenda excepturi labore eaque quaerat, similique corporis repellat veniam expedita.
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
    )
    }
}

export default ProductTable;