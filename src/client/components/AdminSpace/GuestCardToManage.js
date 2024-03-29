import React from 'react';
import './vendor/testlist.css';
import Grid from 'material-ui/Grid';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import gouvernement, { whatido } from './vendor/states';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import Delete from 'material-ui-icons/Delete';
import AssignmentInd from 'material-ui-icons/AssignmentInd';
import { Link } from 'react-router-dom';
import Phone from 'material-ui-icons/Phone';
import SwapHoriz from 'material-ui-icons/SwapHoriz';
import { withStyles } from 'material-ui/styles';
import UserStore from '../../mobx/gueststore';
import { observer } from 'mobx-react';
import Noavatar from '../App/defaultAvatar.svg';
import { REMOTE_ASSETS_PATH } from '../../app/config';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  phoneNbr: {
    fontFamily: 'Roboto, sans-serif'
  },
  phoneNbrText: {
    marginLeft: '5px'
  }
});
@observer
class GuestCardToManage extends React.Component {
  constructor(props) {
    super(props);
  }
  handleChange = (user, form) => {
    UserStore.selectUser(user);
    form.update({
      _id: user._id,
      name: user.profile.name,
      forname: user.profile.forname,
      cin: user.cin,
      tel: user.profile.tel,
      function: user.profile.function,
      region: user.profile.region,
      gouvernorat: user.profile.gouvernorat
    });
  };
  render() {
    const { classes, data, readonly } = this.props;
    return (
      <div>
        {!readonly && (
          <input
            id={`message-${data._id}`}
            type="checkbox"
            onChange={() => this.handleChange(this.props.data, this.props.form)}
          />
        )}
        <label
          className="labelGuestList"
          htmlFor={`message-${data._id}`}
          href="#move">
          {data.profile !== null && (
            <div className="container_ui__item">
              <div className="face">
                {data.profile.avatar !== '' ? (
                  <img
                    id={`avatar_${data.identifiant}`}
                    src={`${REMOTE_ASSETS_PATH}/${data.profile.avatar}`}
                  />
                ) : (
                  <Noavatar />
                )}
                <canvas
                  height={0}
                  width={0}
                  id={`canvas_${data.identifiant}`}
                />
              </div>

              <div className={!readonly ? 'itemInfos' : 'itemInfosResponsive'}>
                <h2>
                  {data.profile.name} {data.profile.forname}
                </h2>
                {
                  // <h3> {data.identifiant} </h3>
                }
                <h3>
                  {data.status == 'ABSCENT' && 'غائب (ة)'}
                  {data.status == 'IN' && 'حاضر (ة) داخل القاعة'}
                  {data.status == 'OUT' && 'غادر (ة) القاعة'}
                </h3>
              </div>
              {readonly && (
                <div className="itemActions">
                  <Button disabled className={classes.phoneNbr}>
                    <Phone />
                    <p className={classes.phoneNbrText}>{data.profile.tel}</p>
                  </Button>
                  <Link to={`/useractivity/${data._id}`}>
                    <Button color="secondary">
                      <SwapHoriz />
                      الاطلاع على التحركات
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </label>
      </div>
    );
  }
}
export default withStyles(styles)(GuestCardToManage);
