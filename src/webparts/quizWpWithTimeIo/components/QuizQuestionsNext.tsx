import * as React from 'react';
import { IdQueryParamName, SPLists, answerNotSelectedText, currentDateReplacePlaceHolder, momentDateFormat, momentTimeFormat, questionTypes, quizHeaderText, reactRoutes, userResponseJsonKeys } from '../../../helper/constants';
import { Component } from 'react';
import { TimerComponent } from '../../../components/TimerControl';
import { getListItems, updateListItem } from '../../../service/SPService';
import { RadioButtonComponent } from '../../../components/radioButtonComponent';
import { TimeService } from '../../../service/TimeAPIService';
import * as moment from 'moment';
import { AnswerFeedback } from '../../../components/AnswerFeedback';

export interface QuizQuestionsProps {
    context: any;

}
export interface QuizQuestionsStates {
    currentQuestionIndex: number,
    questions: any[],
    selectedAnswer: string,
    resetComponent: boolean,
    showAnswerSelectionError: boolean;
    showAnswerFeedback: boolean;
    userRecordID: number;
    isAnswerCorrect: boolean;
    score: number;
}

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
            score: 0
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
            console.log(error)
        }
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userResponseBody = JSON.stringify({
            __metadata: { type: `SP.Data.${SPLists.quizResponseInternalName}ListItem` },
            'QuizResponseJson': JSON.stringify(this.userResponses),
            'Score': this.state.score
        })

        const updateResponse = await updateListItem(this.props.context, this.state.userRecordID, userResponseBody, SPLists.quizResponseTitle);
        if (updateResponse) {
            //this.props.getUserInfoID(createItemResponse);
            window.location.href = `#${reactRoutes.results}?&${IdQueryParamName}=${this.state.userRecordID}`
        }
        else {
            console.log("Something went wrong.")
        }
    }

    handleNext = () => {
        const { isAnswerCorrect } = this.state;
        // Save selected answer for current question
        // Assuming you have a function to get selected answer from your radio button component
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
    }

    async componentDidMount(): Promise<void> {
        try {
            const questions = await getListItems(this.props.context, SPLists.quizQuestionsMasterTitle, '$select=Id,Question,Answer,Choices,QuestionType,Config,APIURL&$orderby=Sequence');
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
                        userRecordID: userRecordID
                    }
                )
            }
            console.log(questions);
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        const { currentQuestionIndex, questions } = this.state;

        const answerToTimeQuestion =
            // @ts-ignore
            questions.length > 0 && this.questionTypeTimeAnswers.filter(x => x[userResponseJsonKeys.questionObjectKey] == questions[currentQuestionIndex].Id).length > 0 ?
                // @ts-ignore
                this.questionTypeTimeAnswers.filter(x => x[userResponseJsonKeys.questionObjectKey] == questions[currentQuestionIndex].Id)[0][userResponseJsonKeys.correctAnswerObjKey]
                : '';

        const correctAnswer = questions.length > 0 && questions[currentQuestionIndex].QuestionType === questionTypes.choice ? questions[currentQuestionIndex].Answer : answerToTimeQuestion

        return (
            questions.length > 0 &&
            <div className="container-fluid">
                <div className="container">
                    <div className="header">
                        <h2 className="text-center">{quizHeaderText}</h2>
                    </div>
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
                                            <svg aria-hidden="true" className="rmd-icon rmd-icon--svg next-arrow" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
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
                </div>
            </div>
        );
    }
}
