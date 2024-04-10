import * as React from 'react';
import type { IQuizWpWithTimeIoProps } from './models/IQuizWpWithTimeIoProps';
import './styles/QuizWpWithTimeIo.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { reactRoutes } from '../../../helper/constants';
import QuizInstructions from './QuizInstructions';
import QuizUserDetails from './QuizUserDetails';
import { HashRouter, Route, Routes } from 'react-router-dom';
import QuizResult from './QuizResults';
import QuizQuestionsNext from './QuizQuestionsNext';

export default class QuizWpWithTimeIo extends React.Component<IQuizWpWithTimeIoProps, {}> {
  constructor(props: IQuizWpWithTimeIoProps) {
    super(props);
  }

  public render(): React.ReactElement<IQuizWpWithTimeIoProps> {
    return (
      <div className="background-image">
          <HashRouter>
            <Routes>
              <Route path={reactRoutes.instructions} Component={() => (<QuizInstructions context={this.props.context} />)}></Route>
              <Route path={reactRoutes.userDetails} Component={() => (<QuizUserDetails context={this.props.context}/>)}></Route>
              <Route path={reactRoutes.results} Component={() => (<QuizResult context={this.props.context}/>)} ></Route>
              <Route path={reactRoutes.quiz} Component={() => (<QuizQuestionsNext context={this.props.context}/>)} ></Route>
            </Routes>
          </HashRouter>
      </div>
    );
  }

}

