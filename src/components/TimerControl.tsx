import * as React from 'react';
import { forwardRef, useState } from 'react';
import { timePickerPlaceholder } from '../helper/constants';
import { TimePicker } from '@fluentui/react';

export const TimerComponent = forwardRef((props, ref) => {

  const [selectedValue, setSelectedValue] = useState('');

   // Handler for text input changes
   // @ts-ignore
   const handleTextInputChange = (e:any) => {
    setSelectedValue(e.target.value);
  };
  
  // @ts-ignore
  const getSelectedValues = () => {
    return {
      selectedValue
    };
  };

  return(
    <>
        <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
    </>
  )
 }
)
 
