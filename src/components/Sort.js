import React, { Component } from 'react';
import FilledInput from '@material-ui/core/FilledInput';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../App.css';


class Sort extends React.Component {
    state = {
        sort: 'Date Added'
    }

    handleChange = (event) => {
        this.setState({
            sort: event.target.value
        }, () => {
            this.props.setSort(this.state.sort)
        })
    }

    render() {

        return (
            <FormControl>
                <InputLabel htmlFor="sort">Sort By</InputLabel>
                <Select
                    animated={false}
                    value={this.state.sort}
                    onChange={this.handleChange}
                    input={<Input name="Sort By" id="sort" />}
                >
                    <MenuItem value="Total Price (Cheapest First)">Total Price (Cheapest First)</MenuItem>
                    <MenuItem value="Total Price (Most Expensive First)">Total Price (Most Expensive First)</MenuItem>
                    <MenuItem value="Price (Cheapest First)">Total Price (Cheapest First)</MenuItem>
                    <MenuItem value="Price (Most Expensive First)">Total Price (Most Expensive First)</MenuItem>
                    <MenuItem value="Date Added">Date Added</MenuItem>
                </Select>
            </FormControl>
        )
    }
}

export default Sort;