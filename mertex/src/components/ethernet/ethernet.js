import React, {PureComponent} from "react";
import './ethernet.scss';
import IpAddress from '../ip-address/ip-address';
import Dns from '../dns/dns';

export default class Ethernet extends PureComponent{

    constructor(props) {
        super(props);

        this.changeState = this.changeState.bind(this);
        this.returnState = this.returnState.bind(this);
    }

    state = {...this.props.data};

    changeState(name, data) {
        this.setState({[name]: {...data}}, this.returnState);
    }

    returnState() {
        const {cbChangeState} = this.props;
        cbChangeState('ethernet', {...this.state});
    }

    render() {
        const {ip, dns} = this.state;
        return (
               <div  className={`ethernet`}>
                   <h3>Ethernet settings</h3>
                   <IpAddress
                       cbChangeState={this.changeState}
                       data={ip}>
                   </IpAddress>
                   <Dns
                       cbChangeState={this.changeState}
                       data={dns}>
                   ></Dns>
               </div>
        );
    }
}
