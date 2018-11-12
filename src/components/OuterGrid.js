import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AddProductBasic from "./AddProductBasic";

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function OuterGrid(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Grid container spacing={24} className="outer-wrapper">
        <Grid item xs={12}>
          <AddProductBasic addProduct={props.addProduct}/>
        </Grid>
      </Grid>
    </div>
  );
}

OuterGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OuterGrid);