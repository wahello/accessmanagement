import React, { Component } from 'react'
import QrReader from 'react-qr-reader'
import {withRouter} from "react-router-dom";
import Dial , { DialPad  }  from './vendor/Dial'
import {observer} from 'mobx-react'
import { connect } from 'react-redux';

import { graphql} from 'react-apollo';
import gql from 'graphql-tag';

import UserStore from '../../mobx/gueststore';
import './vendor/agent.css';

import { withLastLocation } from 'react-router-last-location';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


@observer
class QReaderComponent extends Component {

  constructor(props){
    super(props)


    this.state = {
      delay: 300,
      result: 'No result'
    }
    this.handleScan = this.handleScan.bind(this);
    this.handleEntryNumber = this.handleEntryNumber.bind(this)

  }
  verifySession=(data)=>{
    if(data.workshop==null && data.session==null)
      return false ;
    if((data.workshop!=null && data.workshop.session_empty==true ) || (data.session!==null && data.session.stat=='OFF'))
      return false
    return true;
  }
  handleScan(data){


    let role = this.props.role ;

      if(data){
        this.setState({
          result: data,
        })
        if(this.verifySession(this.props.data.getRoleNameByUserId)){
          if(role==="agent_in")
          this.props.history.push('/verifyenter/'+data);
          if(role==="agent_out")
          this.props.history.push('/verifyexit/'+data);
          if(role==="agent_in_out"){
            this.props.history.push('/accessoperation/'+data);
          }
        }
        else{
          console.log('you\'re not connected to any session')
        }


      }

  }
  handleEntryNumber(data){

      let role = this.props.role ;
      if(data){
        this.setState({
          result: data,
        })
        if(this.verifySession(this.props.data.getRoleNameByUserId)){
          if(role==="agent_in")
          this.props.history.push('/verifyenter/'+data);
          if(role==="agent_out")
          this.props.history.push('/verifyexit/'+data);
          if(role==="agent_in_out"){
            this.props.history.push('/accessoperation/'+data);
          }}
        else{
          console.log('you\'re not connected to any session')
        }

      }
  }
  handleError(err){
    console.error(err)
  }
  render(){

    let transitionName = "fadeHightlvl";
		if(this.props.lastLocation==null){
			transitionName = "fadeHightlvl";
    	} else if (this.props.lastLocation!=null){
					if (this.props.lastLocation.pathname == "/dashboard" || this.props.lastLocation.pathname == "/operateonguestlist"){
		      	transitionName = "fadeSamelvlToRight";
		      } else if (this.props.lastLocation.pathname == "/listattendies"){
		      	transitionName = "fadeSamelvlToLeft";
		      }else {
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
          <div className="containerQrcodeDail">
            <QrReader
              className="section"
              delay={this.state.delay}
              onError={this.handleError}
              onScan={this.handleScan}
              facingMode="user"
              />
              <Dial className="section" handleValid = {this.handleEntryNumber}/>
          </div>
      </ReactCSSTransitionGroup>
    )
  }
}

const query = gql`query getRoleNameByUserId($id : ID) {
  getRoleNameByUserId(id : $id) {
    _id
    workshop{
      session_empty
    }
    session{
      stat
    }
    role{
      name
    }

  }
}`

function mapStateToProps(state) {
  return { userid: state.auth.userid ,
  role:state.auth.role};
}
const id = localStorage.getItem('loogedin_id')
const QReaderComponentWithAgent  = connect(mapStateToProps)(QReaderComponent)
const QReaderComponentWithAgentGRQL = graphql(query, {
  options: ({ ownProps }) => ({ variables: { id:id } }),
})(QReaderComponentWithAgent)
export default withLastLocation(QReaderComponentWithAgentGRQL);
