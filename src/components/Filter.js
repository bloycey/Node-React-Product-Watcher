import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import '../App.css';


class Filter extends React.Component {
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

        let tagList = [];

        const list = Object.keys(this.props.list).map(key => {
            let tags = this.props.list[key].tags;
            tags.map(tag => {
                if (tagList.includes(tag) == false) {
                    tagList.push(tag);
                }
            })
        })
        console.log("filter list", tagList);

        return (
            <div>
                <Button onClick={this.handleOpen}>Filter Results {this.props.filterBy.length == 0 ? '' : '(' + this.props.filterBy.length + ')'}</Button>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                    id="filter-modal"
                >
                    <Paper id="modal-inner">
                        <h1>MODAL TEXT</h1>
                        <List>
                            {tagList.map(tag => {
                                const filterList = this.props.filterBy;
                                let checkedStatus = filterList.includes(tag);
                                return <ListItem> <Checkbox tabIndex={-1} id={tag} checked={checkedStatus} onClick={() => this.props.editFilters({ tag })} /><ListItemText primary={tag} className="pointer" onClick={() => this.props.editFilters({ tag })} /></ListItem>
                            })}
                        </List>
                    </Paper>
                </Modal>
            </div>
        )
    }
}

export default Filter;