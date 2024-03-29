import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemSecondaryAction, ListItemIcon, ListItemText } from 'material-ui/List';
import { Link } from 'react-router-dom';
import DirectionsWalk from 'material-ui-icons/DirectionsWalk';
import RemoveCircleOutline from 'material-ui-icons/RemoveCircleOutline';
import Done from 'material-ui-icons/Done';
import AirlineSeatReclineExtra from 'material-ui-icons/AirlineSeatReclineExtra';
import Checkbox from 'material-ui/Checkbox';
import Avatar from 'material-ui/Avatar';
import SearchComponent from './SearchComponent';
import { red, lightblue } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import Search from 'material-ui-icons/Search';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import EmptyActivityIcon from '../App/EmptyActivityAttendeesForAgents.svg';
import NavBarContainer from '../../containers/NavBarContainer';
import BottomToolbarContainer from '../../containers/BottomToolbarContainer';
import { observer } from 'mobx-react';
import UserStore from '../../mobx/gueststore';
import {REMOTE_ASSETS_PATH} from '../../app/config';
import { withLastLocation } from 'react-router-last-location';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const styles = (theme) => ({
	root: {
		width: '100%',
		maxWidth: '700px',
		margin: 'auto',
		padding: '60px 16px 8px'
	},
	progressCircle: {
		margin: '16px 0 0 0'
	},
	IN:{
		marginLeft:16,
    fill :"#00abc7",
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    '-ms-transform': 'rotateY(180deg)',
    '-o-transform': 'rotateY(180deg)',
    'transform': 'rotateY(180deg)',
  },
  OUT:{
    fill :"#ef4035",
		marginLeft:16,
  },
	search: {
		width: '100%'
	},
	listItemText: {
		maxWidth: '500px',
		width:'100%'
	},
	empty_img: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		width: '280px',
		height: '280px',
		minHeight: '280px',
		minWidth: '280px',
		borderRadius: '50%',
		background: '#ffffff'
	},
	empty_imgSvg: {
		width: '200px',
		height: '200px'
	},
	empty: {
		height: '100vh',
		minHeight: '80vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: '10vh 10vw',
		background: '#f7f7f7',
		fontFamily: 'Roboto, sans-serif'
	},
	empty_title: {
		fontSize: '2em',
		color: 'rgba(0, 0, 0, 0.34)'
	},
	empty_description: {
		color: 'rgba(0, 0, 0, 0.56)'
	},
	attendeesListContainer: {
		background: '#fff',
		boxShadow: '0 1px 4px 0 rgba(0,0,0,.14)',
		textAlign: 'left',
		marginBottom: '70px'
	}
});
const id = localStorage.getItem('loogedin_id');

@observer
class Attendies extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checked: [ 1 ],
			attendies_list: [],
			unfiltered_list: []
		};
		UserStore.fetchGuestForAgentWorkshop(id);
	}

	// componentWillReceiveProps(newProps) {
	// 	if (newProps.data.guestusers) {
	// 		let out = newProps.data.guestusers.filter((user) => user.status == 'IN');
	// 		this.setState({
	// 			attendies_list: newProps.data.guestusers,
	// 			unfiltered_list: newProps.data.guestusers,
	// 			total: newProps.data.guestusers.length,
	// 			in_attendies: out.length,
	// 			out_attendies: newProps.data.guestusers.length - out.length,
	// 			present_precent: out.length / newProps.data.guestusers.length * 100
	// 		});
	// 	}
	// }
	handleToggle = (value) => () => {
		const { checked } = this.state;
		const currentIndex = checked.indexOf(value);
		const newChecked = [ ...checked ];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			checked: newChecked
		});
	};
	filterList = (event) => {
		var updatedList = this.state.attendies_list;
		if (event.target.value == '') {
			updatedList = this.state.unfiltered_list;
		} else {
			updatedList = updatedList.filter(function(item) {
				return (
					item.profile.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1 ||
					item.profile.forname.toLowerCase().search(event.target.value.toLowerCase()) !== -1
				);
			});
		}

		this.setState({ attendies_list: updatedList });
	};

	render() {
		const { classes } = this.props;

		let transitionName = "fadeSamelvlToRight";
		if(this.props.lastLocation==null){
			transitionName = "fadeHightlvl";
    	} else if (this.props.lastLocation!=null){
					if (this.props.lastLocation.pathname == "/agent" || this.props.lastLocation.pathname == "/operateonguestlist" || this.props.lastLocation.pathname == "/dashboard"){
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
							{(UserStore.loading == true) && (
							<div className={classes.root}>
									<CircularProgress color="primary" className={classes.progressCircle} />
							</div>
					)}


							{(UserStore.users == null) && (
							<div className="emptyStatus">
								<div className="emptyStatusIcon">
									<EmptyActivityIcon />
								</div>
								<h3 className="emptyStatusTitle">NoBody has presented his pass yet</h3>
								<p className="emptyStatusDesciption">
									Use the capture code to register the entry and the exit of the participants
								</p>
							</div>
					)}


							{((UserStore.loading != true && UserStore.users != null)) && (
						<div className={classes.root}>
							<Input
								endAdornment={
									<InputAdornment position="end">
										<IconButton>
											<Search />
										</IconButton>
									</InputAdornment>
								}
								className={classes.search}
								placeholder="Search Attendies"
								onChange={this.filterList}
							/>
							<List className={classes.attendeesListContainer}>
								{UserStore.users.map((value) => {
									if (value.profile != null) {
										return (
											<ReactCSSTransitionGroup
													transitionName="fadeItem"
													transitionEnterTimeout={400}
													transitionLeaveTimeout={400}>
															<ListItem key={value._id} button className={classes.listItem}>
															<Avatar alt="" src={`${REMOTE_ASSETS_PATH}/${value.profile.avatar}`} />
															<ListItemText primary={`${value.profile.name} ${value.profile.forname}`} className={classes.listItemText}/>
															<ListItemText secondary={value.status=='ABSCENT' ?   'غائب(ة)'  : 'حاضر(ة)'}/>
															{value.status == 'ABSCENT' ? (
																<DirectionsWalk className={classes.OUT} />
															) : (
																<AirlineSeatReclineExtra className={classes.IN} />
															)}

															{
															// 	value.status == 'OUT' && <DirectionsWalk className={classes.OUT} />}
															// {value.status == <DirectionsWalk /> && (
															// 	<AirlineSeatReclineNormal className={classes.IN} />
															// )
														}
														</ListItem>
											</ReactCSSTransitionGroup>
										);
									}
								})}
							</List>
						</div>
					)}

				</ReactCSSTransitionGroup>
			)


	}
}

Attendies.propTypes = {
	classes: PropTypes.object.isRequired
};
// const CurrentUserForLayout = gql`
//   query CurrentUserForLayout {
//     guestusers {
//       username
//       status
//       profile{
//         name
//         forname
//         avatar
//         tel
//
//       }
//
//     }
//   }
// `;

//const AttendeesWithData = graphql(CurrentUserForLayout)(Attendies);
const AttendiesWithStyles = withStyles(styles)(Attendies);
export default withLastLocation(AttendiesWithStyles);
