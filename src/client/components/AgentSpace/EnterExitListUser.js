import React from 'react';
import {observer} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import UserStore from '../../mobx/gueststore';
import List, { ListItem, ListItemSecondaryAction,ListItemIcon, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import {REMOTE_ASSETS_PATH} from '../../app/config';
import { withLastLocation } from 'react-router-last-location';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const styles = theme => ({
  containerLists:{
    margin:'56px auto 70px',
    backgroundColor:"#fff",
    maxWidth: '700px',
    borderTop: '5px solid #003489',
    boxShadow:'0 1px 4px 0 rgba(0,0,0,.14)',
  },
  profileName:{
    maxWidth: '500px',
    marginLeft: '0',
  },
});

@observer
class EnterExitListUser extends React.Component{
  constructor(props){
    super(props)
    UserStore.fetchGuestForAgentWorkshop(props.userid);
    UserStore.fetchUserRole(props.userid);

  }
  addOperationToGuest =(guest , operation , agent , workshop)=>{
    UserStore.alterGuestStatus(guest , operation , agent, workshop);
  }

  render(){
    const {classes}=this.props;

    let transitionName = "fadeSamelvlToRight";
		if(this.props.lastLocation==null){
			transitionName = "fadeHightlvl";
    	} else if (this.props.lastLocation!=null){
					if (this.props.lastLocation.pathname == "/listattendies" || this.props.lastLocation.pathname == "/agent"){
		      	transitionName = "fadeSamelvlToLeft";
		      } else if(this.props.lastLocation.pathname == "/dashboard") {
		      	transitionName = "fadeSamelvlToRight";
		      } else {
		      	transitionName = "fadeHightlvl";
		      }
		}
return(
  <ReactCSSTransitionGroup
    transitionName={transitionName}
    transitionAppear={true}
    transitionAppearTimeout={270}
    transitionEnter={false}
    transitionLeave={true}
    transitionLeaveTimeout={270}>
        {(UserStore.users!=null) && (
          <div>
          <List className={classes.containerLists}>
          {UserStore.users.map(value => {
            return(
              <ReactCSSTransitionGroup
                  transitionName="fadeItem"
                  transitionEnterTimeout={400}
                  transitionLeaveTimeout={400}>
                  <div key={`div${value._id}`}>{value.profile!=null &&(
                          <ListItem button>
                          <Avatar alt="" src={`${REMOTE_ASSETS_PATH}/${value.profile.avatar}`} />
                          <ListItemText className={classes.profileName} primary={`${value.profile.name} ${value.profile.forname}`}/>
                          <ListItemText primary={value.status== "IN" && ' حاضر(ة) داخل الجلسة' || value.status== "OUT" && ' غادر(ة) الجلسة ' || value.status== "ABSCENT" && ' غائب(ة) '} />
                          {UserStore.currentAgent!=null&&(<div>
                              {(UserStore.currentAgent.role=='agent_in' || UserStore.currentAgent.role=='agent_in_out') &&(<Button  raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "IN" , UserStore.currentAgent , UserStore.selectWorkshopAgent._id )}>
                              دخول
                               </Button>)}
                              {(UserStore.currentAgent.role=='agent_out' || UserStore.currentAgent.role=='agent_in_out')&&(<Button   raised="true" color="secondary"   onClick={()=>this.addOperationToGuest(value._id , "OUT" , UserStore.currentAgent , UserStore.selectWorkshopAgent._id)}>
                                خروج
                                </Button>)}</div>
                          )}

                        </ListItem>)}
                    </div>
                </ReactCSSTransitionGroup>
                )
              }

              )}
            </List>
          </div>
        )}
        {(UserStore.users==null) && (
          <div>Either you're not affected to any workshop or no guest are present yet </div>
        )}

  </ReactCSSTransitionGroup>)


  }
}
function mapStateToProps(state) {
  return { userid: state.auth.userid ,
  role:state.auth.role};
}

const EnterExiteUserMapConnectedWithSlyles = withStyles(styles)(connect(mapStateToProps)(EnterExitListUser));
export default withLastLocation(EnterExiteUserMapConnectedWithSlyles);
