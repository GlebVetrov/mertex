import React, {PureComponent} from "react";
import './dns.scss';
import {FormControlLabel, Input, RadioGroup} from "@material-ui/core";
import StyledRadio from "../styled-radio/styled-radio";

export default class Dns extends PureComponent{

    constructor(props) {
        super(props);

        this.handleValidation = this.handleValidation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadioGroup = this.handleRadioGroup.bind(this);
        this.isValid = this.isValid.bind(this);
        this.setError = this.setError.bind(this);
        this.clearError = this.clearError.bind(this);
        this.returnState = this.returnState.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    state = {
        data: {...this.props.data},
        errors: {
            prefDns: {
                empty: false,
                valid: false
            }
        }
    };

    handleChange(name, event) {
        const {data} = this.state;
        if (name in data.manual) {
            const {value} = event.target;
            data.manual[name] = value;
            this.setState({data: {...data}}, this.returnState);
        }
    }

    isValid(value) {
        const validRegExp = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
        return validRegExp.test(value.trim());
    }

    clearError(name, errors) {
        errors[name].empty = false;
        errors[name].valid = false;
    }

    setError(name, value) {
        const errors = {...this.state.errors};
        this.clearError(name, errors);
        if (value === '') {
            errors[name].empty = true;
        }
        if (!this.isValid(value) && value !== '') {
            errors[name].valid = true;
        }
        this.setState({error: {...errors}});
    }

    handleValidation(name, event) {
        const {manual} = this.state.data;
        const {value} = event.target;
        if (name in manual) {
            this.setError(name, value);
        }
    }

    clearFields() {
        const {data} = this.state;
        const {errors} = this.state;
        data.manual.ipAddress = data.manual.mask = data.manual.gateway = '';
        for (let value in errors) {
            for (let key in errors[value]) {
                errors[value][key] = false;
            }
        }
        this.setState({data: {...data}, errors: {...errors}}, this.returnState);
    }

    handleRadioGroup(event) {
        const {data} = this.state;
        const {value} = event.target;
        data.automatically = value === 'automatically';
        data.manual.is = !data.automatically;
        this.setState({data: {...data}}, this.clearFields);
    }

    returnState() {
        const {automatically} = this.state.data;
        const {cbChangeState} = this.props;
        if (automatically) {
            cbChangeState('dns', {...this.state.data});
            return;
        }
        const {errors} = this.state;
        for (let value in errors) {
            for (let key in errors[value]) {
                if (errors[value][key] === true) {
                    const {data} = this.state;
                    data.manual.errors = true;
                    this.setState({data: {...data}}, cbChangeState('dns', {...this.state.data}));
                }
            }
        }
    }

    render() {
        return (
            <div className={`dns`}>
                <RadioGroup onChange={this.handleRadioGroup} defaultValue="automatically" aria-label="dns" name="dns-radios">
                    <FormControlLabel value="automatically" control={<StyledRadio />} label="Obtain DNS server address automatically" />
                    <FormControlLabel value="manual" control={<StyledRadio />} label="Use the following DNS server address" />
                </RadioGroup>
                <div className={`dns__manual ${this.state.data.automatically === true && 'transparent'}`}>
                    <label>
                        { this.state.errors.prefDns.empty && <span className={`error`}>Field is empty</span>}
                        { this.state.errors.prefDns.valid && <span className={`error`}>Wrong value</span>}
                        <span  className={`dns__manual-desc required`}>Preferred DNS server: </span>
                        <Input
                            onChange={this.handleChange.bind(this, 'prefDns')}
                            onBlur={this.handleValidation.bind(this, 'prefDns')}
                            disabled={this.state.data.automatically}
                            value={this.state.data.manual.prefDns}>
                        </Input>

                    </label>
                    <label>
                        <span className={`dns__manual-desc`}>Alternative DNS server: </span>
                        <Input
                            onChange={this.handleChange.bind(this, 'alterDns')}
                            disabled={this.state.data.automatically}
                            value={this.state.data.manual.alterDns}>
                        </Input>
                    </label>
                </div>
            </div>
        )
    }
}