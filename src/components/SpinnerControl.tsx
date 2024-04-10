import { Spinner, SpinnerSize } from "@fluentui/react";
import * as React from "react";
import { forwardRef } from "react";

export const SpinnerControl = forwardRef((ref) => {
    return (
      <div className="loader container form-container">
          <Spinner label="Loading..." size={SpinnerSize.large} />
      </div>
    )
  }
  )