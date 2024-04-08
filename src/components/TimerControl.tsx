import * as React from 'react';
import { forwardRef, useState } from 'react';
import { momentTimeFormat, timePickerPlaceholder } from '../helper/constants';
import { TimePicker } from '@fluentui/react';
import * as moment from 'moment';

export interface TimerProps {
  onChange: any,
  questionID: number,
  answer: string,
  reset: boolean
}
export const TimerComponent = forwardRef((props: TimerProps, ref) => {
  // @ts-ignore
  const [selectedValue, setSelectedValue] = useState(new Date());
  const [disabledControl, setdisabledControl] = useState(false);
  const [highlightBasedOnAnswer, setHighlightBasedOnAnswer] = useState('');
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  // Handler for text input changes
  // @ts-ignore
  const handleTextInputChange = (e, time) => {
    e.preventDefault();
    const selectedTime = moment(time).format(momentTimeFormat);
    props.onChange(selectedTime, props.questionID);
    if (selectedTime !== props.answer) {
      setHighlightBasedOnAnswer('red-border');
      setShowCorrectAnswer(true);
    }
    else {
      setHighlightBasedOnAnswer('green-border');
    }
    //console.log(moment(time).format(momentTimeFormat));
    //setWrongAnswerClass('red-border');
    setdisabledControl(true);
  };

  React.useEffect(() => {
    setHighlightBasedOnAnswer('');
    setdisabledControl(false);
    setShowCorrectAnswer(false);
  }, [props.reset]);


  return (
    <div>
      {showCorrectAnswer &&
        <div className="form-group text-center">
          <label className='correct-answer'>{`Correct Answer: ${props.answer}`}</label><br />
        </div>
      }
      <TimePicker disabled={disabledControl} className={highlightBasedOnAnswer} key={props.questionID} onChange={(e, time) => { handleTextInputChange(e, time) }} placeholder={timePickerPlaceholder} useHour12={true} dropdownWidth={2} />
      {/* <TimePicker
            onChange={handleTextInputChange}
            value='10:00'
          /> */}
    </div>
  )
}
)

