import * as React from 'react';
import { forwardRef, useState } from 'react';
//import { Form } from 'react-bootstrap';

export interface RadioButtonProps {
  radioItems: string[],
  groupName: string,
  onChange: any,
  questionID: number,
  answer: string,
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
      props.onChange(item,props.questionID)
      setpressedButtonID(props.answer);
      setWrongButtonPressedID(item)
  };

  return (
    <>
      {/* {props.radioItems.map((item) =>
        <Form.Check
          inline
          label={item}
          name={props.groupName}
          type="radio"
          id={Math.random().toString()}
          onChange={(e) => props.onChange(e, props.questionID)}
        />
      )} */}

      <div className="button-grid" >
      {props.radioItems.map((item) =>
            {
              let className = pressedButtonID === item ? "button green-border" : 
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

