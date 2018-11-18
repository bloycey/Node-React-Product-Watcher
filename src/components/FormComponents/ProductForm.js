import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../../App.css';


class ProductForm extends React.Component {

state = {
    productName: '',
    productUrl: '',
    productNameEmpty: true,
    productUrlEmpty: true
}


handleChange = name => event => {
    let empty = name + "Empty";
    this.setState({
        [name]: event.target.value,
        [empty]: event.target.value == '' ? true : false, 
    })
  };


createProduct = (event) => {
    event.preventDefault();
    if(this.state.productNameEmpty == false && this.state.productUrlEmpty == false) {
        const product = {
            name: this.state.productName,
            url: this.state.productUrl
        }
        this.props.addProduct(product);
    } else {
        if(this.state.productNameEmpty) {
            console.log("Please add a product name to proceed")
        }
        if(this.state.productUrlEmpty) {
            console.log("Please add a URL to proceed")
        }

    }
};

    render(){

        return(
        <form className="add-product-form" onSubmit={this.createProduct}>
        <div className="input-wrapper">
                <TextField ref={this.nameRef} id="filled-name" label="Product Name" margin="normal" variant="filled" onChange={this.handleChange('productName')}/>
                <TextField ref={this.urlRef} id="filled-url" label="Product URL" margin="normal" variant="filled" onChange={this.handleChange('productUrl')}/> 
        </div>
            <Button variant="contained" color="primary"type='submit'>NEXT</Button>
        </form>
        )
    }
}

export default ProductForm;