import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

class ProductForm extends React.Component {

state = {
    productName: '',
    productUrl: ''
}

handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

createProduct = (event) => {
    event.preventDefault();
    const product = {
        name: this.state.productName,
        url: this.state.productUrl,
    }
    this.props.addProduct(product);
}

    render(){

        return(
        <form className="add-product-form" onSubmit={this.createProduct}>
            <TextField ref={this.nameRef} id="filled-name" label="Product Name" margin="normal" variant="filled" onChange={this.handleChange('productName')}/>
            <TextField ref={this.urlRef} id="filled-url" label="Product URL" margin="normal" variant="filled" onChange={this.handleChange('productUrl')}/> 
            <button type="submit">+ Add Product</button>
        </form>
        )
    }
}

export default ProductForm;