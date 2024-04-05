import * as React from 'react';
import { quizHeaderText, quizQuestionsMasterTitle } from '../../../helper/constants';
import { Component } from 'react';
import { TimerComponent } from '../../../components/TimerControl';
import { getListItems } from '../../../service/service';
import { RadioButtonComponent } from '../../../components/radioButtonComponent';

export interface QuizQuestionsProps {
    context: any
}
export interface QuizQuestionsStates {
    currentQuestionIndex: number,
    questions: any[],
    selectedAnswers: string[]
}

export default class QuizQuestionsNext extends Component<QuizQuestionsProps, QuizQuestionsStates> {
    constructor(props: QuizQuestionsProps) {
        super(props);
        this.state = {
            currentQuestionIndex: 0,
            questions: [],
            selectedAnswers: []
        };
    }

    handleChange = (value:string,questionID:number) =>{
        try {
            console.log(questionID," - ",value)
        } catch (error) {
            console.log(error)
        }
    } 

    handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    }

    handleNext = () => {
        const { currentQuestionIndex, selectedAnswers } = this.state;
        // Save selected answer for current question
        // Assuming you have a function to get selected answer from your radio button component
        const selectedAnswer = ""; // Get selected answer here
        selectedAnswers[currentQuestionIndex] = selectedAnswer;
        // Move to next question
        this.setState(prevState => ({
            currentQuestionIndex: prevState.currentQuestionIndex + 1
        }));
    }

    async componentDidMount(): Promise<void> {
        try {
            let questions = await getListItems(this.props.context, quizQuestionsMasterTitle, '$select=Id,Title,Answer,Choices,QuestionType&$orderby=Sequence');
            this.setState(
                {
                    questions: questions
                }
            )
            console.log(questions);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { currentQuestionIndex, questions } = this.state;
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{quizHeaderText}</h2>
                    </div>
                    <div className="container form-container instructions">
                        <div className='text-right'>
                            {`${currentQuestionIndex+1} of ${questions.length}`}
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group text-center">
                                <label>{questions.length > 0 ? questions[currentQuestionIndex].Title : ''}</label><br />

                                {
                                    questions.length > 0 ?
                                        questions[currentQuestionIndex].Choices != null ?
                                            <RadioButtonComponent radioItems={questions[currentQuestionIndex].Choices.split(";")} groupName={questions[currentQuestionIndex].Title} onChange={this.handleChange} questionID={questions[currentQuestionIndex].Id} answer={questions[currentQuestionIndex].Answer}></RadioButtonComponent>
                                            :
                                            <TimerComponent></TimerComponent>
                                        :
                                        null
                                }

                                <div className="text-center nextButton">
                                    {currentQuestionIndex !== questions.length - 1 ? (
                                        <button type="button" onClick={this.handleNext} className="btn btn btn-submit btn-next">
                                            Next
                                            <svg aria-hidden="true" className="rmd-icon rmd-icon--svg next-arrow" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                                        </button>
                                    ) : (
                                        <button type="submit" className="btn btn-submit">Submit</button>
                                    )}
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}
