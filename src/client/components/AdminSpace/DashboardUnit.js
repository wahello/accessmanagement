import React from 'react';
import  {PieChart, Pie, Legend , Tooltip, Sector, Cell , Label} from 'recharts';
import { withStyles } from 'material-ui/styles';
import QueryBuilder from 'material-ui-icons/QueryBuilder';
import People from 'material-ui-icons/People';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import moment from 'moment';
import { graphql , compose} from 'react-apollo';
import gql from 'graphql-tag';
import {observer , inject} from 'mobx-react'
import SessionStore from '../../mobx/sessionstore';
import {Link} from 'react-router-dom';
import './vendor/dashboard.css';
import { CircularProgress } from 'material-ui/Progress';

const styles = theme => ({
  cardInfos:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  button:{
    margin : '8px' ,
  },
  workshopName: {
   color: '#013084',
   fontSize: '2rem',
   fontFamily: 'Changa',
   fontWeight: '300',
   marginBottom: '24px',
  },
  timeDetail:{
    display: 'flex',
    alignItems: 'flex-start',
    paddingLeft: '10px',
    flexDirection: 'column',
    marginLeft: '10px',
  },
  timeDetailText:{
    color: '#959595',
    marginBottom: '5px',
  },
  timeDetailHour: {
    fontSize: '18pt',
    fontWeight: '500',
    fontFamily: 'Roboto, arial, sans-serif',
  },
  DashboardContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  ChartInfos :{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  leftIcon:{
    marginRight: '4px',
  },
});

const styleEndTime = {
    borderRight: '1px solid #eee',
};


class DashboardUnit extends React.Component{
  constructor(props){
    super(props);
  }
  getUsersStatistics =()=>{
      let in_length = this.props.INCOUNT.getSessionStatsForSession;
      let out_length = this.props.OUTCOUNT.getSessionStatsForSession;
      let abscent_length =this.props.ABSCENTCOUNT.getSessionStatsForSession;
      let data = [
        {name: 'داخل الورشة', value: in_length},
        {name: 'خارج الورشة', value:out_length },
        {name: 'غائب', value:abscent_length}]

                    return data ;
    }

  buildContentBasedOnData =(details , classes , name , size )=>{
                  const COLORS = ['#00abc7', '#686a77' , '#dcdcdc'];
                  let data;
                  if(details.stat=="OFF")
                   data = [
                     {name: 'داخل الورشة', value: details.closed_in},
                     {name: 'خارج الورشة', value: details.closed_out},
                     {name: 'غائب', value: details.closed_abscent}];
                  else
                  data= this.getUsersStatistics();
                  let end ;
                  let start = moment(moment(details.start_hour))
        if(details.end_hour!=null)
      {   end = moment(moment(details.end_hour))}
        else {
           end = moment(moment.now())
        }
        let difference = moment.duration(end.diff(start))
        return(
          <div key={details._id} className={classes.DashboardContainer}>
          <div  className="ChartContainer">
            <div  className="PieContainer">
                <PieChart width={400} height={320}>
                  <Tooltip wrapperStyle={{border:'none', borderRadius: '2px', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.08)'}}/>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={90} outerRadius={115} fill="#00abc7" >
                    {
                      data.map((entry, index) => <Cell key={`second_pie_cell_key${index}`} fill={COLORS[index % COLORS.length]}/>)
                    }
                    <Label width={30} position="center"
                      content={<CustomLabel value1={`الوقت المنقضي`}/>}>
                    </Label>
                    <Label width={30} position="center"
                      content={<CustomLabel value2={`${difference._data.hours} س ${difference._data.minutes} دق `}/>}>
                    </Label>
                  </Pie>
                  <Pie data={data} dataKey="value" nameKey="name"  cx="50%" cy="50%" innerRadius={126} outerRadius={130} label={<RenderCustomizedLabel value={data}/>}>

                    {
                      data.map((entry, index) => <Cell key={`first_pie_cell_key${index}`} fill={COLORS[index % COLORS.length]}/>)
                    }
                  </Pie>
                </PieChart>
                <div className="containerLegend">
                  <div className="subContaineLegend">
                    <p> داخل القاعة </p>
                    <div  className="legendChart in"></div>
                  </div>
                  <div className="subContaineLegend">
                    <p> غادر القاعة </p>
                    <div  className="legendChart out"></div>
                  </div>
                  <div className="subContaineLegend">
                    <p>غائب</p>
                    <div className="legendChart abscent"></div>
                  </div>
                </div>
              </div>
              <div className="ChartInfosContainer">
                <div className={classes.cardInfos}>
                  <Typography className={classes.workshopName}>
                    {name}
                  </Typography>
                  <div className={classes.ChartInfos}>
                    <Button   variant="fab"    disabled><QueryBuilder color="action"/>
                    </Button>
                    <div className={classes.timeDetail}>
                      <span className={classes.timeDetailText}>
                      البداية
                      </span>
                      <span className={classes.timeDetailHour}>{moment(details.start_hour).utcOffset(1, true).format('HH:mm')}</span>
                    </div>
                    {(details.end_hour!=null)&&(
                      <div className={classes.timeDetail} style={{...styleEndTime}}>
                        <span className={classes.timeDetailText}>
                          النهاية
                        </span>
                        <span className={classes.timeDetailHour}>{moment(details.end_hour).utcOffset(1, true).format('HH:mm')}</span>
                    </div>)}
                  </div>
                     <div  className={classes.ChartInfos}>
                      <Button   variant="fab"    disabled>
                        <People color="action"/>
                      </Button>

                        <div className={classes.timeDetail}>
                        <span className={classes.timeDetailText}>
                        الحضور المتوقع
                        </span>
                        <span className={classes.timeDetailHour}>{size}</span>
                      </div>
                    </div>

                  <div><Link to={`/sessionactivity/${details._id}`}><Button  raised="true"color="secondary" className={classes.button}><SwapHoriz  className={classes.leftIcon} />
                   الاطلاع على التحركات
                  </Button></Link>
                  <Link to={`/listusersbysession/${details._id}`}><Button  raised="true"color="secondary" className={classes.button}><People  className={classes.leftIcon} />
                  حالة الحضور
                </Button></Link></div>
                </div>
              </div>
        </div>
      </div>)
  }
  componentWillMount() {
    this.props.ABSCENTCOUNT.subscribeToMore({
      document: sessionSubscription,
      variables: {
        sessionId: this.props.details._id,
      },
      updateQuery :(prev , {subscriptionData})=>{
        if(!subscriptionData.data){
          return prev;
        }
        else{
          if(subscriptionData.data.refreshedSessionStats.id==this.props.details._id)
            return Object.assign({}, {
              getSessionStatsForSession:subscriptionData.data.refreshedSessionStats.abscent
            })
         else{
            return(prev)
          }
        }
      }
    });
    this.props.INCOUNT.subscribeToMore({
      document: sessionSubscription,
      variables: {
        sessionId: this.props.details._id,
      },
      updateQuery :(prev , {subscriptionData})=>{
        if(!subscriptionData.data){
          return prev;
        }
        else{
          if(subscriptionData.data.refreshedSessionStats.id==this.props.details._id)
            return Object.assign({}, {
              getSessionStatsForSession:subscriptionData.data.refreshedSessionStats.in
            })
          else
          return (prev)
        }
      }
    });
    this.props.OUTCOUNT.subscribeToMore({
      document: sessionSubscription ,
      variables: {
        sessionId: this.props.details._id,
      },
      updateQuery :(prev , {subscriptionData})=>{
        if(!subscriptionData.data){
          return prev;
        }
        else{
          if(subscriptionData.data.refreshedSessionStats.id==this.props.details._id)
            return Object.assign({}, {
              getSessionStatsForSession:subscriptionData.data.refreshedSessionStats.out
            })
          else
            return(prev)
        }

      }
    })
  }
  render(){
    const {classes , details , key , size} = this.props;

    if(!this.props.OUTCOUNT.loading &&!this.props.INCOUNT.loading && !this.props.ABSCENTCOUNT.loading )
      return(<div>{this.buildContentBasedOnData(details , classes ,details.title!=undefined ? details.title : "جلسة عامة" , size)}</div>)
    else{
      return(	<div>
        <CircularProgress color="primary" />
      </div>)
    }

  }
}
const pieOptions = {
  label: {
    fontFamily: 'Arial',
    fontSize: 50,
    fontWeight: true,
    color: 'red'
  }
}
function CustomLabel({viewBox, value1, value2}){
  const {cx, cy} = viewBox;
  return (
   <text x={cx} y={cy} className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
      <tspan x={cx} y={cy-13} fontSize="14" fill="#a0a0a0" >{value1}</tspan>
      <tspan x={cx} y={cy+12} fontSize="20" fill="#000000" fontFamily="Roboto">{value2}</tspan>
   </text>
  )
}
function RenderCustomizedLabel ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value, fill }) {
  const RADIAN = Math.PI / 180;
 	const radius = innerRadius + (outerRadius - innerRadius) * 9;
  const x  = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy  + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill={fill} textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
    	{value}
    </text>
  );
}
const getSessionStatsForSession= gql`query getSessionStatsForSession($sessionId:String! , $status:String!) {
  getSessionStatsForSession(sessionId:$sessionId , status:$status)
}`

const sessionSubscription=gql`
subscription {
  refreshedSessionStats{
    in
    out
    abscent
    id
  }
}
`
const GraphQledDashboardUnit = compose(
  graphql(getSessionStatsForSession , {
    name :"INCOUNT",
    options:(ownProps) => ({
      variables: {
        sessionId: ownProps.details._id ,
        status :"IN"
      }
    })}),
    graphql(getSessionStatsForSession , {
      name :"OUTCOUNT",
      options:(ownProps) => ({
        variables: {
          sessionId: ownProps.details._id ,
          status :"OUT"
        }
      })}),
      graphql(getSessionStatsForSession , {
        name :"ABSCENTCOUNT",
        options:(ownProps) => ({
          variables: {
            sessionId: ownProps.details._id ,
            status :"ABSCENT"
          }
        })}),
  graphql(sessionSubscription)
  )(DashboardUnit)
export default withStyles(styles)(GraphQledDashboardUnit);
