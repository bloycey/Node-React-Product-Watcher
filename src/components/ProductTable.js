import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tag from './FormComponents/micro/Tag';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format';
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick'
import Chart from 'chart.js'
ReactChartkick.addAdapter(Chart);


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

        const { productName, url, date, jsonld, metaprice, itemprop, genericMeta, editMode, status, price, type, priceIndex, tags, dateAdded, history, chartData, lowest, highest, movement } = this.props.details;
        const id = this.props.id;

        let singleProductList = {};
        singleProductList[this.props.id] = this.props.details;
        singleProductList[this.props.id].id = id;

        const MovementIcon = () => {
            if (movement && movement.from) {
                const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
                // const date = new Date();
                const distance = distanceInWordsToNow(Date.parse(movement.date), { addSuffix: true });
                // const change = format(movement.date, 'YYYY-MM-DD HH:mm:ss Z');
                // const now = format(Date.now(), 'YYYY-MM-DD HH:mm:ss Z');
                // console.log("now " + date);
                // console.log("change " + movement.date);
                // console.log(Date.parse(movement.date));

                if (movement.trend == 'up') {
                    return <div className="mvmnt-wrapper"><i className="material-icons up">trending_up</i> ({distance})</div>
                } else {
                    return <div className="mvmnt-wrapper"><i className="material-icons down">trending_down</i> ({distance})</div>
                }
            } else {
                return <div className="mvmnt-wrapper"><i className="material-icons flat">trending_flat</i></div>
            }
        }

        const movementString = movement && movement.from ? `${movement.trend} from $${movement.from} to $${movement.to} (${movement.percentChange}) on ${movement.date}` : `${movement.trend}`;

        let expandIcon = this.state.expanded === true ? "expand_less" : "expand_more";

        return (
            <TableBody>
                <TableRow className={"expanded-" + this.state.expanded}>
                    <TableCell className="table-text pointer" onClick={this.toggleExpanded}><span className="name-cell">{productName}</span><span className="float-right expand-toggle-icon"><i className="material-icons">{expandIcon}</i></span></TableCell>
                    <TableCell className="table-text">
                        <ul className="tags-table-wrapper">
                            &nbsp;
                        {tags && tags.map((tag) => {
                                return <li key={tag}>{tag}</li>
                            })}
                        </ul>
                    </TableCell>
                    <TableCell className="table-text table-price"><div>{price}</div><MovementIcon /></TableCell>
                    <TableCell className="table-text">{date}</TableCell>
                    <TableCell className="text-right">
                        <span className="pointer" onClick={() => this.props.refreshProducts(singleProductList)}><i className="material-icons">refresh</i></span>
                        <span className="pointer" onClick={() => this.props.deleteProduct(id)}><i className="material-icons">delete_outline</i></span>
                    </TableCell>
                </TableRow>
                {this.state.expanded === true &&
                    <TableRow>
                        <TableCell colSpan={5}>
                            {chartData &&
                                <LineChart data={chartData} messages={{ empty: "Refresh price for chart data" }} prefix="$" />
                            }
                            <div className="additional-info">
                                <Grid container spacing={24}>
                                    <Grid item xs={12}>
                                        <h3 className="uppercase">Additional Information</h3>
                                        <hr />
                                    </Grid>
                                    <Grid item xs={5} className="meta-desc">
                                        <h4 className="uppercase">Meta description</h4>
                                        <p>lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsumlorem ipsum lorem ipsum lorem ipsumv lorem ipsum lorem ipsum</p>
                                    </Grid>
                                    <Grid item xs={5} className="additional-product-details">
                                        <p>
                                            <strong>URL: </strong>{url} <br />
                                            <strong>Date Added: </strong>{dateAdded} <br />
                                            <strong>Scrape Method: </strong>{type} <br />
                                            <strong>Index: </strong>{priceIndex} <br />
                                            {lowest &&
                                                <React.Fragment>
                                                    <strong>Lowest Price: </strong>${lowest.value} ({lowest.date})<br />
                                                </React.Fragment>
                                            }
                                            {highest &&
                                                <React.Fragment>
                                                    <strong>Highest Price: </strong>${highest.value} ({highest.date})<br />
                                                </React.Fragment>
                                            }
                                            {movement &&
                                                <React.Fragment>
                                                    <strong>Last Change: </strong>{movementString}<br />

                                                </React.Fragment>
                                            }
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