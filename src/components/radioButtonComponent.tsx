import * as React from 'react';
import { Form } from 'react-bootstrap';

export const RadioButtonComponent = (props: { radioItems: any[]; }) => {
  return(
    <>
        {props.radioItems.map((item)=>
            <Form.Check
                            inline
                            label={item.name}
                            name={item.group}
                            type="radio"
                            id={Math.random().toString()}
                        />
        )}
    </>
  )
 }
 
