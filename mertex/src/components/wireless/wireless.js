import React, {PureComponent} from "react";
import  './wireless.scss';
import {Checkbox} from "@material-ui/core";

export default class Wireless  extends PureComponent{
    render() {
        return (
            <div className={`settings-wireless`}>
                <h3>Wireless settings</h3>
                <Checkbox color="primary"></Checkbox>
            </div>
        );
    }
}