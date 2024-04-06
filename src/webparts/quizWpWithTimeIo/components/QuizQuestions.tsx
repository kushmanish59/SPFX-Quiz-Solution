import * as React from 'react';
//import { RadioButtonComponent } from '../../../components/radioButtonComponent';
import { quizHeaderText, quizQuestionsMasterTitle, timePickerPlaceholder } from '../../../helper/constants';
import { TimePicker } from '@fluentui/react';
import { getListItems } from '../../../service/service';

export interface QuizQuestionsProps {
    context:any
}
export interface QuizQuestionsStates {
    name: string,
    country: string,
    q1: string,
    q2: string,
    q3: string
}


export default class QuizQuestions extends React.Component<QuizQuestionsProps, QuizQuestionsStates> {
    public inputComponentRef: any;
    constructor(props: QuizQuestionsProps) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
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

                            {/* Question 2 */}
                            <div className="form-group">
                                <label>Which of the following time zones is ahead of UTC?</label><br />
                                {/* <RadioButtonComponent ref={(ref) => (this.inputComponentRef = ref)} radioItems={["Paris"]}></RadioButtonComponent> */}
                            </div>

                            {/* Question 3 */}
                            <div className="form-group">
                                <label>How many hours ahead of UTC is Eastern European Time (EET)?</label><br />
                                {/* <RadioButtonComponent radioItems={[{ name: "Paris"}]}></RadioButtonComponent> */}
                            </div>
                            <div className="form-group">
                                <label>How many minutes are there in a day?</label><br />
                                {/* <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent> */}
                            </div>
                            <div className="form-group">
                                <label>Which time zone is used as the reference for Coordinated Universal Time (UTC)?</label><br />
                                {/* <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent> */}
                            </div>
                            <div className="form-group">
                                <label>What is the term for the period when clocks are set one hour ahead in the spring?</label><br />
                                {/* <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent> */}
                            </div>
                            <div className="form-group">
                                <label>Rachel's flight departs from Chicago at 1:30 PM CST and arrives in Los Angeles at 3:45 PM PST. How long is the flight in hours and minutes?</label><br />
                                 {/* <RadioButtonComponent radioItems={[{ name: "Paris", group: "capital" }]}></RadioButtonComponent> */}
                            </div>
                            <div className="form-group text-center form-next">
                                <label>What is the current time in Sydney, Australia?</label><br />
                                <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
                            </div>

                            {/* Question 2 */}
                            <div className="form-group">
                                <label>Convert 8:30 AM Central Standard Time (CST) to Indian Standard Time (IST)</label><br />
                                <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
                            </div>

                            {/* Question 3 */}
                            <div className="form-group">
                                <label>Sarah has a flight departing from Los Angeles International Airport (LAX) at 3:45 PM PST. If she wants to check in 2 hours before her flight, what time should she arrive at the airport? </label><br />
                                <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
                            </div>
                            <div className="form-group">
                                <label>John is scheduling a virtual meeting with his colleagues in New York, London, and Tokyo. If he wants to find a suitable time that overlaps working hours for all locations, what would be the earliest possible time for the meeting? </label><br />
                                <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
                            </div>
                            <div className="form-group">
                                <label>Emily's favorite TV show starts airing every Sunday at 8:00 PM GMT. She recently moved to Singapore, which is 8 hours ahead of GMT. What time will Emily have to tune in to watch her favorite show in Singapore time?  </label><br />
                                <TimePicker placeholder={timePickerPlaceholder} useHour12={true} />
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

    async componentDidMount(): Promise<void> {
        try {
            let questions = await getListItems (this.props.context,quizQuestionsMasterTitle,'$select=Title,Answer,Choices,QuestionType&$orderby=Sequence');
            console.log(questions);
        } catch (error) {
            console.log(error) 
        }
    }

    handleSubmit = (e: any) => {
        try {
            e.preventDefault();
            // Handle form submission here
            console.log('Form submitted:', this.inputComponentRef.getSelectedValues());
            //window.location.href = `#${reactRoutes.results}`
            
        } catch (error) {
            console.log(error)
        }
    }

}