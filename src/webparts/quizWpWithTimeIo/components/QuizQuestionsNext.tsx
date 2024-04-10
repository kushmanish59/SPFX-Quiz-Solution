import * as React from 'react';
import { IdQueryParamName, SPAPIQueryString, SPLists, answerNotSelectedText, currentDateReplacePlaceHolder, momentDateFormat, momentTimeFormat, questionTypes, quizHeaderText, reactRoutes, userResponseJsonKeys } from '../../../helper/constants';
import { Component } from 'react';
import { TimerComponent } from '../../../components/TimerControl';
import { getListItems, updateListItem } from '../../../service/SPService';
import { RadioButtonComponent } from '../../../components/radioButtonComponent';
import { TimeService } from '../../../service/TimeAPIService';
import * as moment from 'moment';
import { AnswerFeedback } from '../../../components/AnswerFeedback';
import { ErrorLogging } from '../../../service/ErrorLogging';
import { QuizQuestionsProps, QuizQuestionsStates } from './models/IQuizQuestionsModel';
import { SpinnerControl } from '../../../components/SpinnerControl';
import { HeaderControl } from '../../../components/HeaderControl';

//const { hash } = useLocation();
export default class QuizQuestionsNext extends Component<QuizQuestionsProps, QuizQuestionsStates> {
    public userResponses: any = [];
    public questionTypeTimeAnswers: any = [];
    constructor(props: QuizQuestionsProps) {
        super(props);
        this.state = {
            currentQuestionIndex: 0,
            questions: [],
            selectedAnswer: '',
            resetComponent: false,
            userRecordID: 0,
            isAnswerCorrect: false,
            showAnswerSelectionError: false,
            showAnswerFeedback: false,
            score: 0,
            isLoading: true
        };
    }

    handleChange = (answer: string, questionID: number, isAnswerCorrect: boolean, correctAnswer: string) => {
        try {
            let userResponseObj: any = {};
            userResponseObj[userResponseJsonKeys.questionObjectKey] = questionID;
            userResponseObj[userResponseJsonKeys.answerObjKey] = answer;
            userResponseObj[userResponseJsonKeys.correctAnswerObjKey] = correctAnswer;
            this.userResponses.push(userResponseObj);
            this.setState({ selectedAnswer: answer, showAnswerSelectionError: false, isAnswerCorrect: isAnswerCorrect, showAnswerFeedback: true });
            console.log(this.userResponses);
        } catch (error) {
            console.log(error);
            ErrorLogging(this.props.context, error, "QuizQuestions (handleChange)");
        }
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const userResponseBody = JSON.stringify({
                __metadata: { type: `SP.Data.${SPLists.quizResponseInternalName}ListItem` },
                'QuizResponseJson': JSON.stringify(this.userResponses),
                'Score': this.state.score
            })
    
            const updateResponse = await updateListItem(this.props.context, this.state.userRecordID, userResponseBody, SPLists.quizResponseTitle);
            if (updateResponse) {
                //navigate to results page
                window.location.href = `#${reactRoutes.results}?&${IdQueryParamName}=${this.state.userRecordID}`
            }
            else {
                ErrorLogging(this.props.context, "Update response is invalid.", "QuizQuestions (handleSubmit)");
            }
        } catch (error) {
            ErrorLogging(this.props.context, error, "QuizQuestions (handleSubmit)");
        }
    }

    handleNext = () => {
        try {
            const { isAnswerCorrect } = this.state;
            if (this.state.selectedAnswer) {
                // Move to next question
                this.setState(prevState => ({
                    currentQuestionIndex: prevState.currentQuestionIndex + 1,
                    resetComponent: !this.state.resetComponent,
                    selectedAnswer: '', // reset the selected answer pointer
                    showAnswerSelectionError: false,
                    showAnswerFeedback: false,
                    score: isAnswerCorrect ? prevState.score + 1 : prevState.score
                }));
            }
            else {
                this.setState({
                    showAnswerSelectionError: true,
                })
            }
        } catch (error) {
            ErrorLogging(this.props.context, error, "QuizQuestions (handleNext)");
        }
       
    }

    async componentDidMount(): Promise<void> {
        try {
            const questions = await getListItems(this.props.context, SPLists.quizQuestionsMasterTitle, SPAPIQueryString.questionsQueryString);
            const promises: Promise<void>[] = questions.map(async (question: any) => {
                if (question.QuestionType == questionTypes.time) {
                    if (question.Config && question.APIURL) {
                        let body = question.Config;
                        body = body.replaceAll(currentDateReplacePlaceHolder, moment().format(momentDateFormat));
                        let choiceTypeTimeAnswers: any = {};
                        const answerResponse = await TimeService('/Conversion/ConvertTimeZone', this.props.context, JSON.parse(body));
                        if (answerResponse) {
                            choiceTypeTimeAnswers[userResponseJsonKeys.questionObjectKey] = question.Id;
                            choiceTypeTimeAnswers[userResponseJsonKeys.correctAnswerObjKey] = moment(answerResponse.conversionResult.dateTime).format(momentTimeFormat);
                            this.questionTypeTimeAnswers.push(choiceTypeTimeAnswers);
                        }
                        else {
                            console.log("azure function error");
                        }
                        console.log(this.questionTypeTimeAnswers);
                    }
                    else {
                        console.log("config or API URL is missing");
                    }
                }
            });
            // Wait for all promises to resolve
            await Promise.all(promises);
            const params = new URLSearchParams(window.location.hash);
            const userRecordID: any = params.get(IdQueryParamName);
            if (userRecordID) {
                this.setState(
                    {
                        questions: questions,
                        userRecordID: userRecordID,
                        isLoading: false
                    }
                )
            }
            console.log(questions);
        } catch (error) {
            ErrorLogging(this.props.context, error, "QuizQuestions (componentDidMount)");
        }
    }

    render() {
        const { currentQuestionIndex, questions, isLoading } = this.state;
        const answerToTimeQuestion =
            // @ts-ignore
            questions.length > 0 && this.questionTypeTimeAnswers.filter(x => x[userResponseJsonKeys.questionObjectKey] == questions[currentQuestionIndex].Id).length > 0 ?
                // @ts-ignore
                this.questionTypeTimeAnswers.filter(x => x[userResponseJsonKeys.questionObjectKey] == questions[currentQuestionIndex].Id)[0][userResponseJsonKeys.correctAnswerObjKey]
                : '';
        const correctAnswer = questions.length > 0 && questions[currentQuestionIndex].QuestionType === questionTypes.choice ? questions[currentQuestionIndex].Answer : answerToTimeQuestion

        return (
           
            <div className="container-fluid">
                <div className="container">
                <HeaderControl title={quizHeaderText} />
                    <>
                        {isLoading && (
                            <SpinnerControl />
                        )}
                        {
                             questions.length > 0 &&
                             <div className="container form-container form-next">
                             <div className='quiz-status'>
                                 <div className='text-right question-numbers'>
                                     {`${currentQuestionIndex + 1} of ${questions.length}`}
                                 </div>
                                 <div className='text-right question-numbers'>
                                     {`Score: ${this.state.score}`}
                                 </div>
                             </div>
     
                             <form>
                                 <div className="form-group quiz text-center">
                                     <label className='question-label '>{questions.length > 0 ? questions[currentQuestionIndex].Question : ''}</label><br />
                                     {
                                         this.state.showAnswerSelectionError &&
                                         <div className="form-group text-center">
                                             <label className='select-answer'>{`${answerNotSelectedText}`}</label><br />
                                         </div>
                                     }
                                     {
                                         this.state.showAnswerFeedback &&
                                         <AnswerFeedback correctAnswer={correctAnswer} isCorrect={this.state.isAnswerCorrect}></AnswerFeedback>
                                     }
     
                                     {
                                         questions.length > 0 ?
                                             questions[currentQuestionIndex].QuestionType === questionTypes.choice ?
                                                 <RadioButtonComponent radioItems={questions[currentQuestionIndex].Choices.split(";")} groupName={questions[currentQuestionIndex].Question} onChange={this.handleChange} questionID={questions[currentQuestionIndex].Id} correctAnswer={correctAnswer}
                                                     disabled={this.state.resetComponent}
                                                 ></RadioButtonComponent>
                                                 :
                                                 <TimerComponent onChange={this.handleChange} questionID={questions[currentQuestionIndex].Id} correctAnswer={correctAnswer} reset={this.state.resetComponent}></TimerComponent>
                                             :
                                             null
                                     }
     
                                     <div className="text-center nextButton">
                                         {currentQuestionIndex !== questions.length - 1 ? (
                                             <button type="button" onClick={this.handleNext} className="btn btn btn-submit btn-next">
                                                 Next
                                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>
                                             </button>
                                         ) : (
                                             <button type="button"
                                                 onClick={(e: any) => {
                                                     this.setState(prevState => ({
                                                         score: this.state.isAnswerCorrect ? prevState.score + 1 : prevState.score
                                                     }), () => this.handleSubmit(e));
                                                 }}
                                                 className="btn btn-submit">Submit</button>
                                         )}
                                     </div>
     
                                 </div>
                             </form>
                         </div>
                        }
                    </>
                   
                </div>
            </div>
        );
    }
}
