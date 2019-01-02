import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import '../App.css';


class Edit extends React.Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleToggle = (event) => {
        console.log(event.target.value)
    }

    render() {

        return (
            <div>
                <Button onClick={this.handleOpen} variant="outlined" className="edit-btn">Edit Product</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                    id="edit-modal"
                >
                    <Paper id="modal-inner">
                        <h2 className="edit-heading">Edit Product</h2>
                    </Paper>
                </Modal>
            </div>
        )
    }
}

export default Edit;