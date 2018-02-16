import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';

import DirectionsRun from 'material-ui-icons/DirectionsRun';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CircularProgress } from 'material-ui/Progress';
import dateFormat from 'dateformat';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Divider from 'material-ui/Divider';
const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
  },
  IN:{
    fill :"#00B0FF",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',

  },
  OUT:{
    fill :"red",
  }
});
 class AttendeeActivity  extends React.Component{
  render(){
    const {classes} = this.props;
    if(this.props.data.loading==true)
      return(<div className={classes.root}><CircularProgress  color="secondary"   /></div>);
      else if (this.props.data.activity==null || Object.keys(this.props.data.activity).length === 0) {
          return (
              <div className={classes.root}>
                <Paper elevation={4}>
                 <Typography type="body1" component="h3">
                   No Activity registered yet
                 </Typography>
                 <Typography type="subheader" component="p">
                   You will see the entry and exit of the participants once the agents register them
                 </Typography>
               </Paper>
              </div>
            );
  }
  else{
    return(<div className={classes.root}>
        <List>
          {this.props.data.activity.map(value => (
            <div><ListItem key={value.id} dense>
              <Avatar src={value.user.profile.avatar} />
              <ListItemText secondary={`${dateFormat(value.dateEntry , 'hh:mm:ss')}`} />
              <ListItemText primary={`${value.user.profile.name} ${value.user.profile.forname}`} />
              <ListItemText secondary={`${value.action=="IN" ? "joined" : "left"} the conference`  }/>
              {value.agent &&(<ListItemText secondary={`Registered By ${value.agent.username}`  }/>)}
              <DirectionsRun className={classes[value.action]}/>
            </ListItem>
            <Divider inset/></div>
          ))}
        </List>
      </div>)
  }

  }
}
const historylist = gql`
  query historylist($id: String!) {
    activity(id :$id) {
      entryId
      dateEntry
      action
      user{
        username
        profile{
          name
          forname
          tel
          avatar
        }
      }
      agent{username}

    }
  }
`;


const AttendeeActivityWithData = graphql(historylist ,  {
  options: (props) => ({ variables: { id: props.match.params.id } })
})(AttendeeActivity);
export default withStyles(styles)(AttendeeActivityWithData);
