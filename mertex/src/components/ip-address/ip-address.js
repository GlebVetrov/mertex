import React, {PureComponent} from "react";
import './ip-address.scss';
import {FormControlLabel, Input, Radio, RadioGroup} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    icon: {
        borderRadius: '50%',
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
});

function StyledRadio(props) {
    const classes = useStyles();
    return (
        <Radio
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={`${classes.icon} ${classes.checkedIcon}`} />}
            icon={<span className={classes.icon} />}
            {...props}
        />
    );
}

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
        this.clearError = this.clearError.bind(this);
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
        const {data} = this.state;
        console.log(data.manual[name]);
        if (name in data.manual) {
            const {value} = event.target;
            data.manual[name] = value;
            this.setState({data: {...data}});

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
        const that = this;
        const names = {
            ipAddress(value) {
                that.setError('ipAddress', value);
            },
            mask(value) {
                that.setError('mask', value);
            },
        };
        if (names[name]) {
            names[name](event.target.value);
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
        return (
            <div className={`ip-address`}>
                <RadioGroup onChange={this.handleRadioGroup} defaultValue="automatically" aria-label="ip" name="ip-radios">
                    <FormControlLabel value="automatically" control={<StyledRadio />} label="Obtain in IP address automatically (DHCP/BootP)" />
                    <FormControlLabel value="manual" control={<StyledRadio />} label="Use the following IP address" />
                </RadioGroup>
                <div className={`ip-address__manual ${this.state.data.automatically === true && 'transparent'}`}>
                    <label>
                        { this.state.errors.ipAddress.empty && <span className={`error`}>Field is empty</span>}
                        { this.state.errors.ipAddress.valid && <span className={`error`}>Wrong value</span>}
                        <span  className={`ip-address__manual-desc required`}>IP address: </span>
                        <Input
                            ref={this.ipRef}
                            onChange={this.handleChange.bind(this, 'ipAddress')}
                            onBlur={this.handleValidation.bind(this, 'ipAddress')}
                            disabled={this.state.data.automatically}
                            value={this.state.data.manual.ipAddress}>
                        </Input>

                    </label>
                    <label>
                        { this.state.errors.mask.empty && <span className={`error`}>Field is empty</span>}
                        { this.state.errors.mask.valid && <span className={`error`}>Wrong value</span>}
                        <span className={`ip-address__manual-desc required`}>Subnet Mask: </span>
                        <Input
                            ref={this.maskRef}
                            onChange={this.handleChange.bind(this, 'mask')}
                            onBlur={this.handleValidation.bind(this, 'mask')}
                            disabled={this.state.data.automatically}
                            value={this.state.data.manual.mask}>
                        </Input>
                    </label>
                    <label>
                        <span className={`ip-address__manual-desc`}>Default Gateway: </span>
                        <Input
                            ref={this.gatewayRef}
                            onChange={this.handleChange.bind(this, 'gateway')}
                            onBlur={this.handleValidation.bind(this, 'gateway')}
                            disabled={this.state.data.automatically}
                            value={this.state.data.manual.gateway}>
                        </Input>
                    </label>
                </div>
            </div>
        )
    }
}
