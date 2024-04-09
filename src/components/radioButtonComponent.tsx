import * as React from 'react';
import { forwardRef, useState } from 'react';
//import { Form } from 'react-bootstrap';

export interface RadioButtonProps {
  radioItems: string[],
  groupName: string,
  onChange: any,
  questionID: number,
  correctAnswer: string,
  disabled: boolean
}

export const RadioButtonComponent = forwardRef((props: RadioButtonProps, ref) => {

  const [disabledButtons, setdisabledButtons] = useState(false);
  const [pressedButtonID, setpressedButtonID] = useState('');
  const [wrongButtonPressedID, setWrongButtonPressedID] = useState('');
  React.useEffect(() => {
    setdisabledButtons(false);
  },[props.disabled]);

  // // Handler for text input changes
  const handleClick = (e:any,item:string) => {
    e.preventDefault();
    setdisabledButtons(true);
    const isAnswerCorrect : boolean = item === props.correctAnswer ? true : false;
    props.onChange(item,props.questionID,isAnswerCorrect, props.correctAnswer)
    setpressedButtonID(props.correctAnswer);
    setWrongButtonPressedID(item);
  };

  return (
    <>
      <div className="button-grid" >
      {props.radioItems.map((item) =>
            {
              const className = pressedButtonID === item ? "button green-border" : 
              wrongButtonPressedID === item? "button red-border" : "button";
              return <button type='button' id={item} disabled={disabledButtons} className={className} onClick={(e)=>handleClick(e,item)}>{item}</button>
            }
          )}
         
      </div>
      {/* <div className="radio-group">
        <div className="radio-buttons">
          {props.radioItems.map((item) =>
            <button className="btn btn-radio" data-testid="Button">
              <span>{item}</span>
            </button>
          )}

        </div>
      </div> */}
    </>
  )
}
)

