import * as React from 'react';
import { instructionsHeaderText, reactRoutes } from '../../../helper/constants';

export interface QuizInstructionsProps {
}
export interface QuizInstructionsStates {
    moveForward: boolean
}

export default class QuizInstructions extends React.Component<QuizInstructionsProps, QuizInstructionsStates> {
    constructor(props: QuizInstructionsProps) {
        super(props);
    }

    public render(): React.ReactElement<QuizInstructionsProps> {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{instructionsHeaderText}</h2>
                    </div>
                    <div className="container form-container instructions">
                        {/* <div className="form-group quiz text-center">
                            <label className='instructions-label'>
                                Quiz Instructions
                            </label>
                        </div> */}
                        <p>Welcome to the quiz! Before you begin, please read the following instructions:</p>
                        <ol>
                            <li>This quiz contains multiple-choice and time selection questions.</li>
                            <li>Each question will present you with a scenario or problem related to Time Zones and Time Conversion.</li>
                            <li>Answer all questions to the best of your ability.</li>
                            <li>If your answer is incorrect, don't worry! You'll be provided with the correct answer so you can learn from your mistakes.</li>
                            <li>Each question has only one correct answer.</li>
                            <li>Selecting an option from the time dropdown or clicking the choices button will count as your answer. So, choose wisely.</li>
                            {/* <li>You'll have a limited time to complete the quiz.</li> */}
                            {/* <li>Once you start the quiz, the timer will begin, and it cannot be paused.</li> */}
                            <li>Make sure you have a stable internet connection.</li>
                            <li>Click the "Start Quiz" button below when you're ready to begin.</li>
                        </ol>
                        <p>Good luck!</p>
                        <div className="text-center">
                            <button type="submit" onClick={this.handleSubmit} className="btn btn-submit">Start Quiz</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        window.location.href = `#${reactRoutes.userDetails}`
        // Handle form submission here
        console.log('Form submitted:', this.state);
    }

}