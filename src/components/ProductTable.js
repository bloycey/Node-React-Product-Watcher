import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
                <TableRow className={"expanded-"+this.state.expanded}>
                    <TableCell className="table-text pointer" onClick={this.toggleExpanded}><span className="name-cell">{productName}</span><span className="float-right expand-toggle-icon"><i className="material-icons">{expandIcon}</i></span></TableCell>
                    <TableCell className="table-text">
                    <ul className="tags-table-wrapper">
                        {tags && tags.map((tag)=> {
                            return <li key={tag}>{tag}</li>
                        })}
                    </ul>
                    </TableCell>
                    <TableCell className="table-text">{price}</TableCell>
                    <TableCell className="table-text">{date}</TableCell>
                    <TableCell className="text-right">
                        <span className="pointer" onClick={() => this.props.refreshProducts(singleProductList)}><i className="material-icons">refresh</i></span>
                        <span className="pointer" onClick={() => this.props.deleteProduct(id)}><i className="material-icons">delete_outline</i></span>
                    </TableCell>
                </TableRow>
                {this.state.expanded === true &&
                    <TableRow>
                        <TableCell colSpan={5}>
                        <div className="additional-info">
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <h3 className="uppercase">Additional Information</h3>
                                    <hr/>
                                </Grid>
                                <Grid item xs={5} className="meta-desc">
                                    <h4 className="uppercase">Meta description</h4>
                                    <p>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsumv lorem ipsum lorem ipsum</p>
                                </Grid>
                                <Grid item xs={5} className="additional-product-details">
                                    <p>
                                        <strong>URL: </strong> <br/>
                                        <strong>Date Added: </strong> <br/>
                                        <strong>Scrape Method: </strong> <br/>
                                        <strong>Index: </strong> <br/>
                                        <strong>Lowest Price: </strong> <br/>
                                        <strong>Highest Price: </strong> <br/>
                                    </p>
                                </Grid>
                                <Grid item xs={2}>
                                    IMG / PLACEHOLDER IMG
                                </Grid>  
                            </Grid>
                        </div>
                        
                        </TableCell>
                    </TableRow>
                }
            </TableBody>
    )
    }
}

export default ProductTable;