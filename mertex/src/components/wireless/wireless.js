import React, {PureComponent} from "react";
import  './wireless.scss';
import {Checkbox, Input, IconButton} from "@material-ui/core";
import RefreshIcon from '@material-ui/icons/Refresh';
import IpAddress from "../ip-address/ip-address";
import Dns from "../dns/dns";

export default class Wireless  extends PureComponent{

    constructor(props) {
        super(props);

        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.changeState = this.changeState.bind(this);
        this.returnState = this.returnState.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.networkName = this.networkName.bind(this);
    }

    state = {
        ...this.props.data,
        errors: {
            name: {
                empty: false
            },
            key: {
                empty: false
            }
        }
    };

    handleCheckboxChange(name, event) {
        const {checked} = event.target;
        const {state} = this;
        state[name].is = checked;
        this.setState({[name]: {...state[name]}}, this.returnState);
    }

    handleInputChange(name, event) {
        const {value} = event.target;
        const {wifi, security, errors} = this.state;
        if (name === 'name') {
            wifi[name] = value;
            this.setState({wifi: {...wifi}}, this.returnState);
        }
        if (name === 'key') {
            security[name] = value;
            this.setState({security: {...security}}, this.returnState);
        }

        if (name in errors) {
            if (errors[name].empty === true || errors[name].valid === true) {
                errors[name].empty = false;
                errors[name].valid = false;
                this.setState({errors: {...errors}}, this.returnState);
            }
        }

    }

    handleValidation(name, event) {
        const {errors} = this.state;
        const {value} = event.target;
        if (name in errors) {
            if (value === '' && errors[name].empty === false) {
                errors[name].empty = true;
            }
        }
        this.setState({error: {...errors}});
    }

    changeState(name, data) {
        this.setState({[name]: {...data}}, this.returnState);
    }

    returnState() {
        const {cbChangeState} = this.props;
        cbChangeState('wireless', {...this.state});
    }

    networkName() {
        const {wifi} = this.state;
        wifi.name = '';
        this.setState({wifi: {...wifi}}, this.returnState);
    }

    render() {
        const {wifi, security, ip, dns} = this.state;
        return (
            <div className={`wireless`}>
                <h3 className={`wireless__title`}>Wireless settings</h3>
                <label>
                    <Checkbox onChange={this.handleCheckboxChange.bind(this, 'wifi')} color="primary" checked={wifi.is}></Checkbox>
                    <span className={`wireless__desc`}>Enable wifi</span>
                </label>
                <div className={`wireless__container ${!wifi.is && 'transparent'}`}>
                    <label className={`wireless__wrap`}>
                        { this.state.errors.name.empty && <span className={`error`}>Field is empty</span>}
                        <span className={`wireless__desc required`}>Wireless Network Name: </span>
                        <Input
                            onChange={this.handleInputChange.bind(this, 'name')}
                            onBlur={this.handleValidation.bind(this, 'name')}
                            disabled={!wifi.is}
                            value={wifi.name}
                        ></Input>
                        <IconButton onClick={this.networkName} color="primary" component="span" disabled={!wifi.is}>
                            <RefreshIcon />
                        </IconButton>
                    </label>
                    <label>
                        <Checkbox onChange={this.handleCheckboxChange.bind(this, 'security')} color="primary" checked={security.is} disabled={!wifi.is}></Checkbox>
                        <span className={`wireless__desc`}>Enable Wireless Security</span>
                    </label>
                    <label className={`wireless__wrap ${!security.is && 'transparent'}`}>
                        { this.state.errors.key.empty && <span className={`error`}>Field is empty</span>}
                        <span className={`wireless__desc required`}>Security key: </span>
                        <Input
                            onChange={this.handleInputChange.bind(this, 'key')}
                            onBlur={this.handleValidation.bind(this, 'key')}
                            disabled={!security.is}
                            value={security.key}
                        ></Input>
                    </label>
                    <IpAddress
                        disabled={!wifi.is}
                        cbChangeState={this.changeState}
                        data={ip}>
                    </IpAddress>
                    <Dns
                        disabled={!wifi.is}
                        cbChangeState={this.changeState}
                        data={dns}>
                        ></Dns>
                </div>
            </div>
        );
    }
}