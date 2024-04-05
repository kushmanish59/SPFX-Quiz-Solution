import * as React from 'react';
import { Form } from 'react-bootstrap';
import { reactRoutes, userDetailHeaderText } from '../../../helper/constants';

export interface  QuizUserDetailsProps{
}
export interface QuizUserDetailsStates{
    name: string,
    country: string
}

export default class QuizUserDetails extends React.Component<QuizUserDetailsProps, QuizUserDetailsStates> {
    constructor(props: QuizUserDetailsProps) {
        super(props);
        this.state = {
            name: '',
            country: ''
        };
    }

    public render(): React.ReactElement<QuizUserDetailsProps> {
        return (
          <div className="container-fluid">
          <div className="container">
            <div className="header">
              <h2 className="text-center">{userDetailHeaderText}</h2>
            </div>
              <div className="container form-container instructions">
              <form onSubmit={this.handleSubmit}>
            {/* User Details */}
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }) }} required />
            </div>

            <div className="form-group">
              <label htmlFor="country">Country:</label>
              <Form.Select aria-label="Default select example" id="country" name="country" value={this.state.country} onChange={(e) => { this.setState({ country: e.target.value }) }} required>
                <option value="" disabled>Select Country</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
              </Form.Select>
            </div>
            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-submit">Submit</button>
            </div>
            </form>

          </div>
          </div>
        </div>
            
        );
    }

    handleSubmit = (e: any) => {
      e.preventDefault();
      const result = window.confirm("Are you sure you want to proceed?");
      if (result) {
        // Perform the action you want to proceed with
        console.log("Action confirmed!");
        window.location.href = `#${reactRoutes.quiz}`
      } else {
        // User clicked "Cancel" or closed the dialog
        console.log("Action canceled!");
      }
    }

}