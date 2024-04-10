import * as React from 'react';
import { IdQueryParamName, SPAPIQueryString, SPLists, congratulationText, failedText, qualificationScore, reactRoutes, resultsHeaderText } from '../../../helper/constants';
import { getListItemByID, getListItems } from '../../../service/SPService';
import { ErrorLogging } from '../../../service/ErrorLogging';
import { SpinnerControl } from '../../../components/SpinnerControl';
import { HeaderControl } from '../../../components/HeaderControl';

export interface QuizResultProps {
    context:any
}
export interface QuizResultStates {
    score:number;
    totalScore:number;
    isLoading:boolean;
}

export default class QuizResult extends React.Component<QuizResultProps, QuizResultStates> {
    constructor(props: QuizResultProps) {
        super(props);
        this.state = {
            score:0,
            totalScore:0,
            isLoading:true
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            const params = new URLSearchParams(window.location.hash);
            const userRecordID: any = params.get(IdQueryParamName);
            const [quizResponse, questions] = await Promise.all([
                getListItemByID(this.props.context, SPLists.quizResponseTitle, userRecordID, SPAPIQueryString.quizResultQueryString),
                getListItems(this.props.context, SPLists.quizQuestionsMasterTitle, SPAPIQueryString.questionsQueryString)
              ]);
            if(quizResponse && questions){
                this.setState({
                    score:quizResponse.Score,
                    totalScore:questions.length,
                    isLoading:false
                });
            }
            else{
                ErrorLogging(this.props.context,"Quiz response or questions are empty.","QuizResults (componentDidMount)");
            }
            
        } catch (error) {
            ErrorLogging(this.props.context,error,"QuizResults (componentDidMount)");
        }
    }

    public render(): React.ReactElement<QuizResultProps> {
        const {score, totalScore, isLoading} = this.state;
        const percentageScore = (score / totalScore) * 100;
        const feedbackText = percentageScore > qualificationScore ? congratulationText  : failedText;
        const feedbackTextClass = percentageScore > qualificationScore ? "text-green"  : "text-red";
        return (
            <div className="container-fluid">
                <div className="container">
                <HeaderControl title={resultsHeaderText} />
                    <>
                        {isLoading && (
                            <SpinnerControl />
                        )}
                        {
                            !isLoading &&
                            <div className="container form-container quizResults">
                            <div className={`result ${feedbackTextClass}`}>
                                {
                                    feedbackText
                                }
                            </div>
                            <div className="score mb-30">
                                You scored <span className={feedbackTextClass}>{score} out of {totalScore}</span> points.
                            </div>
                            <button className="quiz-restart mb-30" onClick={this.handleSubmit}>Restart Quiz</button>
                        </div>
                        }
                    </>
                </div>
            </div>

        );
    }

    handleSubmit = (e: any) => {
        try {
            e.preventDefault();
            window.location.href = `#${reactRoutes.instructions}`
            console.log('Form submitted:', this.state);
        } catch (error) {
            ErrorLogging(this.props.context,error,"QuizResults (handleSubmit)");
        }
    }

}