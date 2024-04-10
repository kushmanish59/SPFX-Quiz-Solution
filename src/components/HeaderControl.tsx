import * as React from "react";
import { forwardRef } from "react";

export interface HeaderControlProps { 
  title:string;
}

export const HeaderControl = forwardRef((props : HeaderControlProps,ref) => {
  return (
    <div className="header">
      <h3 className="text-center">{props.title}</h3>
    </div>
  )
}
)