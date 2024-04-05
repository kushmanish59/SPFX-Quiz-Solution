import * as React from 'react';
import { reactRoutes, resultsHeaderText } from '../../../helper/constants';

export interface QuizResultProps {
}
export interface QuizResultStates {
    name: string,
    country: string,
    q1: string,
    q2: string,
    q3: string
}

export default class QuizResult extends React.Component<QuizResultProps, QuizResultStates> {
    constructor(props: QuizResultProps) {
        super(props);
    }

    public render(): React.ReactElement<QuizResultProps> {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{resultsHeaderText}</h2>
                    </div>
                    <div className="container form-container quizResults">
                        <h1>Quiz Result</h1>
                        <div className="result">
                            Congratulations!
                        </div>
                        <div className="score">
                            You scored <span>5 out of 5</span> points.
                        </div>
                        <button className="quiz-restart" onClick={this.handleSubmit}>Restart Quiz</button>
                    </div>
                </div>
            </div>

        );
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission here
        window.location.href = `#${reactRoutes.instructions}`
        console.log('Form submitted:', this.state);
    }

}