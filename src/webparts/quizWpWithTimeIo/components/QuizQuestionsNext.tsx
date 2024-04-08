import * as React from 'react';
import { IdQueryParamName, SPLists, answerObjKey, currentDateReplacePlaceHolder, momentDateFormat, momentTimeFormat, questionObjectKey, questionTypes, quizHeaderText, reactRoutes } from '../../../helper/constants';
import { Component } from 'react';
import { TimerComponent } from '../../../components/TimerControl';
import { getListItems, updateListItem } from '../../../service/SPService';
import { RadioButtonComponent } from '../../../components/radioButtonComponent';
import { TimeService } from '../../../service/TimeAPIService';
import * as moment from 'moment';

export interface QuizQuestionsProps {
    context: any;

}
export interface QuizQuestionsStates {
    currentQuestionIndex: number,
    questions: any[],
    selectedAnswers: string[],
    resetComponent: boolean
    userRecordID: number;
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
            selectedAnswers: [],
            resetComponent: false,
            userRecordID: 0
        };
    }

    handleChange = (value: string, questionID: number) => {
        try {
            console.log(questionID, " - ", value);
            let userResponseObj: any = {};
            // let keyQuestion = questionObjectKey;
            // let keyAnswer = answerObjKey;
            userResponseObj[questionObjectKey] = questionID;
            userResponseObj[answerObjKey] = value;
            this.userResponses.push(userResponseObj);
            console.log(this.userResponses);
        } catch (error) {
            console.log(error)
        }
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userResponseBody = JSON.stringify({
            __metadata: { type: `SP.Data.${SPLists.quizResponseInternalName}ListItem` },
            'QuizResponseJson': JSON.stringify(this.userResponses)
        })

        const updateResponse = await updateListItem(this.props.context, this.state.userRecordID, userResponseBody, SPLists.quizResponseTitle);
        if (updateResponse > 0) {
            //this.props.getUserInfoID(createItemResponse);
            window.location.href = `#${reactRoutes.results}?${IdQueryParamName}=${updateResponse}`
        }
        else {
            console.log("Something went wrong.")
        }
    }

    handleNext = () => {
        const { currentQuestionIndex, selectedAnswers } = this.state;
        // Save selected answer for current question
        // Assuming you have a function to get selected answer from your radio button component
        const selectedAnswer = ""; // Get selected answer here
        selectedAnswers[currentQuestionIndex] = selectedAnswer;
        // Move to next question
        this.setState(prevState => ({
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            resetComponent: !this.state.resetComponent
        }));
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
                            choiceTypeTimeAnswers[questionObjectKey] = question.Id;
                            choiceTypeTimeAnswers[answerObjKey] = moment(answerResponse.conversionResult.dateTime).format(momentTimeFormat);
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

            // await questions.forEach(async (question: any) => {
            //     if (question.QuestionType == questionTypes.time) {
            //         //console.log(question.Config, question.APIURL);
            //         if (question.Config && question.APIURL) {
            //             let body = question.Config;
            //             body = body.replaceAll(currentDateReplacePlaceHolder, moment().format(momentDateFormat))
            //             let choiceTypeTimeAnswers: any = {};
            //             const answerResponse = await TimeService('/Conversion/ConvertTimeZone', this.props.context, JSON.parse(body));
            //             if (answerResponse) {
            //                 choiceTypeTimeAnswers[questionObjectKey] = question.Id;
            //                 choiceTypeTimeAnswers[answerObjKey] = moment(answerResponse.conversionResult.dateTime).format(momentTimeFormat);
            //                 this.questionTypeTimeAnswers.push(choiceTypeTimeAnswers);
            //             }
            //             else {
            //                 console.log("azure function error");
            //             }
            //             console.log(this.questionTypeTimeAnswers);
            //         }
            //         else {
            //             console.log("config or API URL is missing");
            //         }
            //     }
            // })
            //const answerResponse = await TimeService('/Conversion/ConvertTimeZone',this.props.context);
            //console.log(answerResponse);
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
            questions.length > 0 && this.questionTypeTimeAnswers.filter(x => x[questionObjectKey] == questions[currentQuestionIndex].Id).length > 0 ?
                // @ts-ignore
                this.questionTypeTimeAnswers.filter(x => x[questionObjectKey] == questions[currentQuestionIndex].Id)[0][answerObjKey]
                : '';

        const answer = questions.length > 0 && questions[currentQuestionIndex].QuestionType === questionTypes.choice ? questions[currentQuestionIndex].Answer : answerToTimeQuestion
       
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
                                {`Score: ${questions.length}`}
                            </div>
                        </div>

                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group quiz text-center">
                                <label className='question-label '>{questions.length > 0 ? questions[currentQuestionIndex].Question : ''}</label><br />

                                {
                                    questions.length > 0 ?
                                        questions[currentQuestionIndex].QuestionType === questionTypes.choice ?
                                            <RadioButtonComponent radioItems={questions[currentQuestionIndex].Choices.split(";")} groupName={questions[currentQuestionIndex].Question} onChange={this.handleChange} questionID={questions[currentQuestionIndex].Id} answer={answer}
                                                disabled={this.state.resetComponent}
                                            ></RadioButtonComponent>
                                            :
                                            <TimerComponent onChange={this.handleChange} questionID={questions[currentQuestionIndex].Id} answer={answer} reset={this.state.resetComponent}></TimerComponent>
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
