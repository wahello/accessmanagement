import React , {Fragment} from 'react';
import { observer } from 'mobx-react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import update from 'immutability-helper';
import {REMOTE_ASSETS_PATH} from '../../../app/config';
import TemporaryStore  from '../../../mobx/tempStore';
// styles
const $input = 'input-reset ba b--black-10 br1 pa2 mb2 db w-100 f6';
const $label = 'f7 db mb2 mt3 light-silver';
const $small = 'f6 black-60 db red';
const styles ={
  guestItem :{
    padding : '8px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    textAlign:'right',
    height:'56px',
    cursor:'pointer',
  } ,
  avatarGuest :{
    width : '40px' ,
    height : '40px' ,
    marginLeft:'8px',
  },
  guestName :{
    fontWeight : '0.8em',
  },
  chipsContainer:{
		maxWidth: '600px',
    textAlign:'right'
,    border : '2px solid #eee',
    borderRadius:'2px',
    minHeight: '40px',
    padding:'8px',
    marginTop:'16px',
  },
  GuestContainer:{
    padding:'8px',
    background:'#eee',
    maxHeight:'265px',
    overflow:'auto',
    borderBottom:'3px solid #003489',
  },
  guestCounter:{
      margin : '8px',
      color:'#acacac',
  },
  guestChip:{
        margin : '3px',
    },
}


const invited=[];
@observer
class MaterialSelectField extends React.Component{
  constructor(props){
    super(props)

    this.props.items.map(item=>{
      invited.push(item);
    });
    TemporaryStore.initGuestList(this.props.items);
    this.state = {
      chipData: [],
      invited : invited,
      names : [],
      numberguest : 0


    };
  }
  handleAddGuest = (item , index) => {
    TemporaryStore.addGuest(item , index);
  //   this.setState((prevState) => ({
  //     invited: update(prevState.invited, {$splice: [[index, 1]]}) ,
  //     chipData : update(prevState.chipData, {$push: [ item ]}) ,
  //     names : update(prevState.names, {$push: [ item._id ]}) ,
  //     numberguest : prevState.numberguest+1

  // }))

  this.props.form.$('users').value = TemporaryStore.names

 };
 handleDeleteChip = (item , index) => {

  TemporaryStore.removeGuest(item);
  this.props.form.$('users').value = TemporaryStore.names
};

  render(){
    const { field , placeholder , type ,form} = this.props;
    return(
        <Fragment>
              <div>
                <div style={styles.chipsContainer}>

                  {TemporaryStore.chipData.map((data , index) => {
//console.log(data)
                        return(
                          <Chip
                          key={`{chip${data._id}}`}
                          avatar={<Avatar src={`${REMOTE_ASSETS_PATH}/${data.profile.avatar}`} />}
                          label={`${data.profile.name} ${data.profile.forname}`}
                          onDelete={()=>this.handleDeleteChip(data , index)}
                          style={styles.guestChip}
                          />)


                  })}
                  <p style={styles.guestCounter}> المشاركون في الورشة : {TemporaryStore.number_guests}</p>
                  </div>
                  <ul style={styles.GuestContainer}>

                        {TemporaryStore.invited_guests.map((item , index) => (


                          <li onClick={()=>this.handleAddGuest(item , index)} key={item._id} style={styles.guestItem}>
                                  {(item.profile!=null)&&(

                                    <Avatar
                                    src={`${REMOTE_ASSETS_PATH}/${item.profile.avatar}`}
                                    style={styles.avatarGuest}
                                  />)}
                                  {(item.profile!=null)&&(<p style={styles.guestName}> {item.profile.name} {item.profile.forname}</p>)}
                          </li>

                        ))}
                      </ul>
                      <Input {...field.bind({type})} value={this.state.names}/>
                    </div>
              </Fragment>
            )
  }
}
export default MaterialSelectField;
