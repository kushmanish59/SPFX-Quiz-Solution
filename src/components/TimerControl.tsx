import * as React from 'react';
import { forwardRef, useState } from 'react';
import { momentTimeFormat, timePickerPlaceholder } from '../helper/constants';
import { TimePicker } from '@fluentui/react';
import * as moment from 'moment';

export interface TimerProps {
  onChange: any,
  questionID: number,
  correctAnswer: string,
  reset: boolean
}
export const TimerComponent = forwardRef((props: TimerProps, ref) => {
  // @ts-ignore
  const [selectedValue, setSelectedValue] = useState(new Date());
  const [disabledControl, setdisabledControl] = useState(false);
  const [highlightBasedOnAnswer, setHighlightBasedOnAnswer] = useState('');
  // @ts-ignore
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  // Handler for text input changes
  // @ts-ignore
  const handleTextInputChange = (e, time) => {
    e.preventDefault();
    let isAnswerCorrect : boolean = false;
    const selectedTime = moment(time).format(momentTimeFormat);
    if (selectedTime !== props.correctAnswer) {
      setHighlightBasedOnAnswer('red-border');
      setShowCorrectAnswer(true);
      isAnswerCorrect = false;
    }
    else {
      props.onChange(selectedTime, props.questionID,true, props.correctAnswer);
      setHighlightBasedOnAnswer('green-border');
      isAnswerCorrect = true;
    }

    props.onChange(selectedTime, props.questionID,isAnswerCorrect,props.correctAnswer);
    setdisabledControl(true);
  };

  React.useEffect(() => {
    setHighlightBasedOnAnswer('');
    setdisabledControl(false);
    setShowCorrectAnswer(false);
  }, [props.reset]);


  return (
    <div>
      {/* {showCorrectAnswer &&
        <div className="form-group text-center">
          <label className='correct-answer'>{`Oops!! The correct Answer is ${props.correctAnswer}`}</label><br />
        </div>
      } */}
      <TimePicker disabled={disabledControl} className={highlightBasedOnAnswer} key={props.questionID} onChange={(e, time) => { handleTextInputChange(e, time) }} placeholder={timePickerPlaceholder} useHour12={true} dropdownWidth={2} />
      {/* <TimePicker
            onChange={handleTextInputChange}
            value='10:00'
          /> */}
    </div>
  )
}
)

