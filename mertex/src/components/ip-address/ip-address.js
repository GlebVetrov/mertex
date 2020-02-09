import React, {PureComponent} from "react";
import './ip-address.scss';
import {FormControlLabel, Input, RadioGroup} from "@material-ui/core";
import StyledRadio from "../styled-radio/styled-radio";

export default class IpAddress extends PureComponent{

    constructor(props) {
        super(props);
        this.ipRef = React.createRef();
        this.maskRef = React.createRef();
        this.gatewayRef = React.createRef();

        this.handleValidation = this.handleValidation.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleRadioGroup = this.handleRadioGroup.bind(this);
        this.isValid = this.isValid.bind(this);
        this.setError = this.setError.bind(this);
        this.returnState = this.returnState.bind(this);
        this.clearFields = this.clearFields.bind(this);
    }

    state = {
        data: {...this.props.data},
        errors: {
            ipAddress: {
                empty: false,
                valid: false
            },
            mask: {
                empty: false,
                valid: false
            }
        }
    };

    handleChange(name, event) {
        const {data, errors} = this.state;
        if (name in data.manual) {
            const {value} = event.target;
            data.manual[name] = value;
            this.setState({data: {...data}}, this.returnState);
        }
        if (name in errors) {
            if (errors[name].empty === true || errors[name].valid === true) {
                errors[name].empty = false;
                errors[name].valid = false;
                this.setState({errors: {...errors}}, this.returnState);
            }
        }
    }

    isValid(value) {
        const validRegExp = /^\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}$/;
        return validRegExp.test(value.trim());
    }

    setError(name, value) {
        const errors = {...this.state.errors};
        errors[name].empty = false;
        errors[name].valid = false;
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
            cbChangeState('ip', {...this.state.data});
            return;
        }
        const {errors} = this.state;
        for (let value in errors) {
            for (let key in errors[value]) {
                if (errors[value][key] === true) {
                    const {data} = this.state;
                    data.manual.errors = true;
                    this.setState({data: {...data}}, cbChangeState('ip', {...this.state.data}));
                }
            }
        }
    }

    render() {
        const {data, errors} = this.state;
        const {disabled} = this.props;
        return (
            <div className={`ip-address`}>
                <RadioGroup onChange={this.handleRadioGroup} value={data.automatically === true ? 'automatically' : 'manual'} aria-label="ip" name="ip-radios">
                    <FormControlLabel value="automatically" control={<StyledRadio />} label="Obtain in IP address automatically (DHCP/BootP)"  disabled={disabled}/>
                    <FormControlLabel value="manual" control={<StyledRadio />} label="Use the following IP address"  disabled={disabled}/>
                </RadioGroup>
                <div className={`ip-address__manual ${data.automatically === true && 'transparent'}`}>
                    <label>
                        { errors.ipAddress.empty && <span className={`error`}>Field is empty</span>}
                        { errors.ipAddress.valid && <span className={`error`}>Wrong value</span>}
                        <span  className={`ip-address__manual-desc required`}>IP address: </span>
                        <Input
                            ref={this.ipRef}
                            onChange={this.handleChange.bind(this, 'ipAddress')}
                            onBlur={this.handleValidation.bind(this, 'ipAddress')}
                            disabled={data.automatically}
                            value={data.manual.ipAddress}>
                        </Input>

                    </label>
                    <label>
                        { errors.mask.empty && <span className={`error`}>Field is empty</span>}
                        { errors.mask.valid && <span className={`error`}>Wrong value</span>}
                        <span className={`ip-address__manual-desc required`}>Subnet Mask: </span>
                        <Input
                            ref={this.maskRef}
                            onChange={this.handleChange.bind(this, 'mask')}
                            onBlur={this.handleValidation.bind(this, 'mask')}
                            disabled={data.automatically}
                            value={data.manual.mask}>
                        </Input>
                    </label>
                    <label>
                        <span className={`ip-address__manual-desc`}>Default Gateway: </span>
                        <Input
                            ref={this.gatewayRef}
                            onChange={this.handleChange.bind(this, 'gateway')}
                            disabled={data.automatically}
                            value={data.manual.gateway}>
                        </Input>
                    </label>
                </div>
            </div>
        )
    }
}
