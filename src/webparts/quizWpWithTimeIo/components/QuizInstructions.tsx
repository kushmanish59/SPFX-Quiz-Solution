import * as React from 'react';
import { SPAPIQueryString, SPLists, instructionsHeaderText, reactRoutes } from '../../../helper/constants';
import { ErrorLogging } from '../../../service/ErrorLogging';
import { getListItems } from '../../../service/SPService';
import { QuizInstructionsProps, QuizInstructionsStates } from './models/IQuizInstructionsModel';
import { SpinnerControl } from '../../../components/SpinnerControl';
import { HeaderControl } from '../../../components/HeaderControl';

export default class QuizInstructions extends React.Component<QuizInstructionsProps, QuizInstructionsStates> {
    constructor(props: QuizInstructionsProps) {
        super(props);
        this.state = {
            instructions: [],
            isLoading: true
        }
    }

    async componentDidMount(): Promise<void> {
        try {
            const instructions = await getListItems(this.props.context, SPLists.quizInstructionsTitle, SPAPIQueryString.quizInstructionsQueryString);
            this.setState({
                instructions: instructions,
                isLoading:false // stop the loader
            });
        } catch (error) {
            ErrorLogging(this.props.context, error, "QuizInstructions");
        }
    }

    public render(): React.ReactElement<QuizInstructionsProps> {
        const { instructions, isLoading } = this.state;
        return (
            <div className="container-fluid">
                <div className="container">
                    <HeaderControl title={instructionsHeaderText} />
                    {isLoading && (
                        <SpinnerControl />
                    )}
                    {
                        !isLoading &&
                        <div className="container form-container instructions">
                            <p>Welcome to the quiz! Before you begin, please read the following instructions:</p>
                            <ol>
                                {
                                    instructions.map((item) =>
                                        <li>{item.Instruction}</li>
                                    )
                                }
                            </ol>
                            <p>Good luck!</p>
                            <div className="text-center">
                                <button type="submit" onClick={this.handleSubmit} className="btn btn-submit mb-30">Start Quiz</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }

    handleSubmit = (e: any) => {
        try {
            e.preventDefault();
            window.location.href = `#${reactRoutes.userDetails}`
        } catch (error) {
            ErrorLogging(this.props.context, error, "QuizInstructions");
        }
    }
}