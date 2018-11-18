import React, { Component } from 'react';
import ProductForm from "./FormComponents/ProductForm";
import PricePick from "./FormComponents/PricePick";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import '../App.css';

function getSteps() {
  return ["Enter product name and URL", "Choose the price to watch", "Configure options"];
}

class ProductStepper extends React.Component {

    state = {
        activeStep: 0,
      };

      componentDidUpdate(prevProps) {
        console.log("updated productStepper")
        if(this.props.currentItem.id !== prevProps.currentItem.id) {
          this.setState({
            activeStep: 1
          })
        }
      }

      componentDidMount() {
        console.log("mounted productStepper")
      }

      componentWillUnmount() {
        console.log("unmounting productStepper");
      }

      getStepContent = (step) => {
        switch (step) {
          case 0:
            return <ProductForm addProduct={this.props.addProduct} handleNext={this.handleNext}/>;
          case 1:
            return <PricePick currentItem={this.props.currentItem} setPrice={this.props.setPrice}/>
          case 2:
            return `Try out different ad textasd to see what brings in the most customers,
                    and learn how to enhance your ads using features like ad extensions.
                    If you run into any problems with your ads, find out how to tell if
                    they're running and how to resolve approval issues.`;
          default:
            return 'Unknown step';
        }
      }
    
      handleNext = () => {
        this.setState(state => ({
          activeStep: state.activeStep + 1,
        }));
      };
    
      handleBack = () => {
        this.setState(state => ({
          activeStep: state.activeStep - 1,
        }));
      };
    
      handleReset = () => {
        this.setState({
          activeStep: 0,
        });
      };
    

    render() {

        const steps = getSteps();
        const { activeStep } = this.state;
        
        return (
        <section className="add-product-wrapper">
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <div>{this.getStepContent(index)}</div>
                  <div>
                    <div>
                    {activeStep !== 0 &&
                      <Button
                        onClick={this.handleBack}
                      >
                        Back
                      </Button>
                    }
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleNext}
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'OLD Next'}
                      </Button>
                    </div>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0}>
            <Typography>All steps completed - you&quot;re finished</Typography>
            <Button onClick={this.handleReset} >
              Reset
            </Button>
          </Paper>
        )}
        </section>
        );
    }
}

export default ProductStepper;