import React, { Component } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Cancel from '@material-ui/icons/Cancel'
import '../../App.css';

class Options extends React.Component {

    state = {
        UpNotification: false,
        DownNotification: false,
        currentTagName: '',
        missingTag: false
      };
    
      handleChange = name => event => {
        this.setState({ [name]: event.target.checked });
      };

      handleChangeInput = name => event => {
        this.setState({ 
          [name]: event.target.value,
          missingTag: false
         });
      };


      addTag = (event) => {
        event.preventDefault();
        let tag = this.state.currentTagName;
        if (this.state.currentTagName !== '') {
          this.props.addTag(tag);
          this.setState({
          currentTagName: ''
          })
        } else {
          this.setState({
            missingTag: true
          })
          console.log("Please add a tag first")
        } 
      }
    

render(){

  const tagError = "Please add a tag first!"

    return (
      <section className="options-wrapper">
      <div className="option-tags">

      <form className="add-product-form" onSubmit={this.addTag}>
            <TextField error={this.state.missingTag} id="tag-name" label="Enter Tag" helperText={this.state.missingTag === true ? tagError : "Press 'enter' to add"} value={this.state.currentTagName} onChange={this.handleChangeInput('currentTagName')} margin="normal" variant="filled"/>
            {/* <Button variant="contained" color="primary" type="submit">Add Tag</Button> */}
      </form>
      <ul className="tags-wrapper">
        {this.props.tags && this.props.tags.map((tag)=> {
      return <li key={tag}>{tag} <i className="material-icons" onClick={() => this.props.deleteTag(tag)}>cancel</i></li>})}
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