import * as React from 'react';
import type { IQuizWpWithTimeIoProps } from './IQuizWpWithTimeIoProps';
import './QuizWpWithTimeIO.css'
import { IQuizWpWithTimeIoStates } from './IQuizWpWithTimeIoStates';
import 'bootstrap/dist/css/bootstrap.min.css';
import { instructionsHeaderText, reactRoutes } from '../../../helper/constants';
import QuizInstructions from './QuizInstructions';
import QuizUserDetails from './QuizUserDetails';
import { HashRouter, Route, Routes } from 'react-router-dom';
import QuizQuestions from './QuizQuestions';
import QuizResult from './QuizResults';

export default class QuizWpWithTimeIo extends React.Component<IQuizWpWithTimeIoProps, IQuizWpWithTimeIoStates> {
  constructor(props: IQuizWpWithTimeIoProps) {
    super(props);
    this.state = {
      name: '',
      country: '',
      showQuiz: false,
      headerText: instructionsHeaderText
    };
  }

  public render(): React.ReactElement<IQuizWpWithTimeIoProps> {
    return (
      <div className="background-image">
         <HashRouter>
                  <Routes>
                    <Route path={reactRoutes.instructions} Component={QuizInstructions}></Route>
                    <Route path={reactRoutes.userDetails} Component={QuizUserDetails}></Route>
                    <Route path={reactRoutes.quiz} Component={QuizQuestions}></Route>
                    <Route path={reactRoutes.results} Component={QuizResult}></Route>
                  </Routes>
                </HashRouter>  
      </div>
    );
  }

}
