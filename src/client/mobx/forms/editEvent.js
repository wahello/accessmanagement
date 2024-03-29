import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';
import EventStore from '../eventstore';
const plugins = {
  dvr: validatorjs
};
const fields = [{
    name: 'title',
    label: 'عنوان الحدث',
    placeholder: 'أضف عنوان الحدث',
    rules: 'required|string'
  }, {
    name: 'end_date',
    label: 'تاريخ الانتهاء',
    placeholder: 'اختر تاريخ الانتهاء',
    rules: 'date',
  }, {
    name: '_id',
    type: 'hidden'
  }]

const hooks = {
    onSuccess(form) {
      if (form.values()._id != null && form.values()._id != undefined && form.values()._id != "")
        EventStore.UpdateEvent(form.values())
      else
        EventStore.addNewEvent(form.values())
    },
    onError(form) {
      alert('Form has errors!');
      // get all form errors
      //  console.log('All form errors', form.errors());
    }
  }
  
  export default  new MobxReactForm({
    fields
  }, {
    plugins,
    hooks
  });