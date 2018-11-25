import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import '../../App.css';

class Options extends React.Component {

    state = {
        UpNotification: false,
        DownNotification: false,
        currentTagName: '',
      };
    
      handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
      };

      handleChangeInput = name => event => {
        this.setState({ [name]: event.target.value });
      };

      addTag = (event) => {
        event.preventDefault();
        let tag = this.state.currentTagName;
        this.props.addTag(tag);
        this.setState({
          currentTagName: ''
        })
      }
    

render(){

    return (
      <section className="options-wrapper">
      <div className="option-tags">

      <form className="add-product-form" onSubmit={this.addTag}>
            <TextField id="tag-name" label="Enter Tag" value={this.state.currentTagName} onChange={this.handleChangeInput('currentTagName')} margin="normal" variant="filled"/>
            <Button variant="contained" color="primary" type="submit">Add Tag</Button>
      </form>
      <ul className="tags-wrappers">
        {this.props.tags && this.props.tags.map((tag)=> {
      return <li>{tag}</li>})}
      </ul>
      </div>
      <div className="option-toggles">
        <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.UpNotification}
              onChange={this.handleChange('UpNotification')}
              value="UpNotification"
            />
          }
          label="Send me an email if the price of this product goes UP"
        />
        <br/>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.DownNotifcation}
              onChange={this.handleChange('DownNotification')}
              value="DownNotifcation"
              color="primary"
            />
          }
          label="Send me an email if the price of this product goes DOWN"
        />
      </FormGroup>
      </div>
      </section>
    )
}


}

export default Options;