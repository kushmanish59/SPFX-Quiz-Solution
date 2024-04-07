import * as React from 'react';
import type { IQuizWpWithTimeIoProps } from './IQuizWpWithTimeIoProps';
import './QuizWpWithTimeIO.css'
import { IQuizWpWithTimeIoStates } from './IQuizWpWithTimeIoStates';
import 'bootstrap/dist/css/bootstrap.min.css';
import { instructionsHeaderText, reactRoutes } from '../../../helper/constants';
import QuizInstructions from './QuizInstructions';
import QuizUserDetails from './QuizUserDetails';
import { HashRouter, Route, Routes } from 'react-router-dom';
//import QuizQuestions from './QuizQuestions';
import QuizResult from './QuizResults';
import QuizQuestionsNext from './QuizQuestionsNext';

export default class QuizWpWithTimeIo extends React.Component<IQuizWpWithTimeIoProps, IQuizWpWithTimeIoStates> {
  constructor(props: IQuizWpWithTimeIoProps) {
    super(props);
    this.state = {
      name: '',
      country: '',
      showQuiz: false,
      headerText: instructionsHeaderText,
      recordID:0
    };
  }

  // getUserInfoID = (id:number) =>{
  //   try {
  //     console.log(id);
  //     this.setState({
  //       recordID:id
  //     })
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  public render(): React.ReactElement<IQuizWpWithTimeIoProps> {
    return (
      <div className="background-image">
          <HashRouter>
            <Routes>
              <Route path={reactRoutes.instructions} Component={() => (<QuizInstructions />)}></Route>
              <Route path={reactRoutes.userDetails} Component={() => (<QuizUserDetails context={this.props.context}/>)}></Route>
              {/* <Route path={reactRoutes.quiz} Component={() => (<QuizQuestions context={this.props.context} />)}></Route> */}
              <Route path={reactRoutes.results} Component={QuizResult}></Route>
              <Route path={reactRoutes.quiz} Component={() => (<QuizQuestionsNext context={this.props.context}/>)} ></Route>
            </Routes>
          </HashRouter>
      </div>
    );
  }

}

