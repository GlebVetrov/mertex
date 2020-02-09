import React, {PureComponent} from 'react';
import './App.scss';
import Ethernet from '../ethernet/ethernet';
import Wireless from '../wireless/wireless';
import data from './data';

export default class App extends PureComponent{

  constructor() {
    super()

    this.changeState = this.changeState.bind(this);
    this.saveData = this.saveData.bind(this);
  }

  state = {...data};

  changeState(name, data) {
    this.setState({[name]: {...data}});
  }

  saveData() {
    console.log(JSON.stringify(this.state));
  }

  render() {
    return (
        <div className={`settings`}>
          <div className={`settings__ethernet-wireless`}>
            <Ethernet cbChangeState={this.changeState} data={this.state.ethernet}>
            </Ethernet>
            <Wireless cbChangeState={this.changeState} data={this.state.wireless}>
            </Wireless>
          </div>
          <div className={`settings__controls`}>
            <button onClick={this.saveData} className={`settings__controls-btn`}>Save</button>
            <button className={`settings__controls-btn`}>Cancel</button>
          </div>
        </div>
    );
  }
}
