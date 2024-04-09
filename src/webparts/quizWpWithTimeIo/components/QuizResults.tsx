import * as React from 'react';
import { IdQueryParamName, SPLists, congratulationText, failedText, qualificationScore, reactRoutes, resultsHeaderText } from '../../../helper/constants';
import { getListItemByID, getListItems } from '../../../service/SPService';

export interface QuizResultProps {
    context:any
}
export interface QuizResultStates {
    score:number;
    totalScore:number;
}

export default class QuizResult extends React.Component<QuizResultProps, QuizResultStates> {
    constructor(props: QuizResultProps) {
        super(props);
        this.state = {
            score:0,
            totalScore:0
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            const params = new URLSearchParams(window.location.hash);
            const userRecordID: any = params.get(IdQueryParamName);
            const quizResponse = await getListItemByID(this.props.context, SPLists.quizResponseTitle,userRecordID, '$select=Id,Score');
            const questions = await getListItems(this.props.context, SPLists.quizQuestionsMasterTitle, '$select=Id,Question,Answer,Choices,QuestionType,Config,APIURL&$orderby=Sequence');
            if(quizResponse && questions){
                this.setState({
                    score:quizResponse.Score,
                    totalScore:questions.length
                });
            }
            else{
                console.log("Something went wrong.")
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    public render(): React.ReactElement<QuizResultProps> {
        const {score, totalScore} = this.state;
        const percentageScore = (score / totalScore) * 100;
        const feedbackText = percentageScore > qualificationScore ? congratulationText  : failedText;
        const feedbackTextClass = percentageScore > qualificationScore ? "text-green"  : "text-red";
        return (
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{resultsHeaderText}</h2>
                    </div>
                    <div className="container form-container quizResults">
                        <div className={`result ${feedbackTextClass}`}>
                            {
                                feedbackText
                            }
                        </div>
                        <div className="score">
                            You scored <span className={feedbackTextClass}>{score} out of {totalScore}</span> points.
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