import React, { Component } from 'react';

class AddProduct extends React.Component {

nameRef = React.createRef();
urlRef = React.createRef();
selectorRef = React.createRef();

createProduct = (event) => {
    event.preventDefault();
    const product = {
        name: this.nameRef.current.value,
        url: this.urlRef.current.value,
        selector: this.selectorRef.current.value.replace("#", "%23")
    }
    this.props.addProduct(product);
    // event.currentTarget.reset();
}

    render() {
        return (
                <form className="add-product-form" onSubmit={this.createProduct}>
                    <input name="name" ref={this.nameRef} type="text" placeholder="Product Name" />
                    <input name="url" ref={this.urlRef} type="text" placeholder="Product URL" />
                    <input name="selector" ref={this.selectorRef} type="text" placeholder="Product Selector" />
                    <button type="submit">+ Add Product</button>
                </form> 
        );
    }
}

export default AddProduct;