import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { observer } from 'mobx-react';
import {LOCAL_IMPORT_PATH} from '../../../app/config';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';

const Inputstyle = {
  display:'none'
};

@observer
class FileInput extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			value:""
		}
	}

  handleFile=(e)=>{
    var reader = new FileReader();
    var file = e.target.files[0];
		const data = new FormData();
		data.set('importedfile',file, file.filename);
    // '/files' is your node.js route that triggers our middleware
    axios.post(LOCAL_IMPORT_PATH, data).then((response) => {
			this.props.form.$('file').value = response.data.filename
    });
    if (!file) return;
  }

  render() {
		const {field , type , placeholder} = this.props
    return (
			<div>
				<input
	        accept=".json"
	        id="raised-button-file"
	        multiple
	        type="file"
					ref="file"
					onChange={this.handleFile} name="importedfile"
					style={Inputstyle}
	      />
				<input type="hidden" {...field.bind()} value={this.state.value} />

	      <label htmlFor="raised-button-file">
	        <Button raised="true" color="secondary" component="div">
	          تحميل قائمة المشا ركين
	        </Button>
	      </label>
			</div>
    );
  }
}

export default FileInput;
