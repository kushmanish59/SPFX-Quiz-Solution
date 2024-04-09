import * as React from 'react';
import { forwardRef } from 'react';

export interface AnswerFeedbackProps {
    correctAnswer:string;
    isCorrect:boolean
}

export const AnswerFeedback = forwardRef((props:AnswerFeedbackProps , ref) => {
  const {isCorrect, correctAnswer } = props;
  return (
    <>
      {
            isCorrect ? 
            <div className="form-group text-center">
              <label className='correct-answer text-green'>{`Bingo!! That's a correct answer.`}</label><br />
            </div>:
            <div className="form-group text-center">
            <label className='correct-answer text-red'>{`Oops!! The correct Answer is '${correctAnswer}'`}</label><br />
          </div>
          }
    </>
  )
}
)

// export class AnswerFeedback extends Component<AnswerFeedbackProps> {
//     render() {
        
//     }
// }
