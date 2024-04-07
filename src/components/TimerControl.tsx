import * as React from 'react';
import { forwardRef, useState } from 'react';
import { momentTimeFormat, timePickerPlaceholder } from '../helper/constants';
import { TimePicker } from '@fluentui/react';
import * as moment from 'moment';

export interface TimerProps {
  onChange: any,
  questionID: number,
  answer: string,
  reset:boolean
}
export const TimerComponent = forwardRef((props:TimerProps, ref) => {
  // @ts-ignore
  const [selectedValue, setSelectedValue] = useState(new Date());
  const [disabledControl, setdisabledControl] = useState(false);
  const [wrongAnswerClass, setWrongAnswerClass] = useState('');
  // Handler for text input changes
  // @ts-ignore
  const handleTextInputChange = (e,time) => {
    e.preventDefault();
    props.onChange(moment(time).format(momentTimeFormat),props.questionID);
    console.log(moment(time).format(momentTimeFormat));
    //setWrongAnswerClass('red-border');
    setdisabledControl(true);
  };

  React.useEffect(() => {
    setWrongAnswerClass('');
    setdisabledControl(false);
  },[props.reset]);


  return (
    <div>
      <TimePicker disabled={disabledControl} className={wrongAnswerClass} key={props.questionID} onChange={(e, time) => { handleTextInputChange(e,time) }} placeholder={timePickerPlaceholder} useHour12={true} dropdownWidth={2} />
      {/* <TimePicker
            onChange={handleTextInputChange}
            value='10:00'
          /> */}
    </div>
  )
}
)

