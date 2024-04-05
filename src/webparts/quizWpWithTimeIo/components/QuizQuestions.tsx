import * as React from 'react';
import { RadioButtonComponent } from '../../../components/radioButtonComponent';
import { quizHeaderText, reactRoutes } from '../../../helper/constants';

export interface QuizQuestionsProps {
}
export interface QuizQuestionsStates {
    name: string,
    country: string,
    q1: string,
    q2: string,
    q3: string
}

export default class QuizQuestions extends React.Component<QuizQuestionsProps, QuizQuestionsStates> {
    constructor(props: QuizQuestionsProps) {
        super(props);
        this.state = {
            name: '',
            country: '',
            q1: '',
            q2: '',
            q3: ''
        };
    }

    public render(): React.ReactElement<QuizQuestionsProps> {
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{quizHeaderText}</h2>
                    </div>
                    <div className="container form-container instructions">
                        <form onSubmit={this.handleSubmit}>

                            {/* Question 1 */}
                            <div className="form-group" key={`inline-radio`}>
                                <label>What is the capital of France?</label><br />
                                <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent>
                            </div>

                            {/* Question 2 */}
                            <div className="form-group">
                                <label>Which planet is known as the “Red Planet”?</label><br />
                                <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent>
                            </div>

                            {/* Question 3 */}
                            <div className="form-group">
                                <label>What is the largest mammal on Earth?</label><br />
                                <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent>
                            </div>
                            <div className="form-group">
                                <label>Name a famous scientist or inventor.</label><br />
                                <input type="text" className="form-control" name="q1" value={this.state.q1} onChange={(e) => { this.setState({ q1: e.target.value }) }} placeholder="Your answer here" required />
                            </div>

                            {/* Question 2 */}
                            <div className="form-group">
                                <label>What’s your favorite color?</label><br />
                                <input type="text" className="form-control" name="q2" value={this.state.q2} onChange={(e) => { this.setState({ q2: e.target.value }) }} placeholder="Your answer here" required />
                            </div>

                            {/* Question 3 */}
                            <div className="form-group">
                                <label>Describe your dream vacation destination.</label><br />
                                <textarea className="form-control" name="q3" value={this.state.q3} onChange={(e) => { this.setState({ q3: e.target.value }) }} rows={4} placeholder="Your answer here" required />
                            </div>
                            <div className="text-center">
                                <button type="submit" onClick={this.handleSubmit} className="btn btn-submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        // Handle form submission here
        window.location.href = `#${reactRoutes.results}`
        console.log('Form submitted:', this.state);
    }

}