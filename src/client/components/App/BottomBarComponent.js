import React from 'react';

import BottomNavigation , { BottomNavigationAction } from 'material-ui/BottomNavigation';
//import BottomNavigationAction from 'material-ui/BottomNavigation';
import RestoreIcon from 'material-ui-icons/Restore';
import FavoriteIcon from 'material-ui-icons/Favorite';
import LocationOnIcon from 'material-ui-icons/LocationOn';

import People from 'material-ui-icons/People';
import PhotoCamera from 'material-ui-icons/PhotoCamera';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import DonutSmall from 'material-ui-icons/DonutSmall';
import Toys from 'material-ui-icons/Toys';
import { withRouter } from 'react-router';

class BottomBarComponent extends React.Component{
  state = {
      value: 0,
    };

  handleChange = (event, value) => {
      this.props.history.push(value);
    this.setState({ value });
  };
  render(){
    const { value  } = this.state;
    const{authenticated , role}=this.props;
    if(authenticated){
      return(
        <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        >
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="Attendies Status" icon={<People />} value="/listattendies" />)}
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="Capture Code" icon={<PhotoCamera />} value="/agent"/>)}
        {(role=='agent_in' || role=='agent_out'|| role=='agent_workshop')&&(<BottomNavigationAction label="Dashboard" icon={<DonutSmall />} value="/dashboard"/>)}
        {(role=='admin')&&(<BottomNavigationAction label="Attendies Status" icon={<People />} value="/listguests" />)}
        {(role=='admin')&&(<BottomNavigationAction label="Activity" icon={<SwapHoriz />} value="/activitylog"/>)}
        {(role=='admin')&&(<BottomNavigationAction label="Dashboard" icon={<DonutSmall />} value="/event-dashboard/:id"/>)}
        {(role=='admin')&&(<BottomNavigationAction label="Sessions" icon={<Toys />} value="/activitylog"/>)}
      </BottomNavigation>
    )
    }
    return (<p style={{position:'fixed'}}>All rights reserved</p>)
  }
}
export default withRouter(BottomBarComponent);
