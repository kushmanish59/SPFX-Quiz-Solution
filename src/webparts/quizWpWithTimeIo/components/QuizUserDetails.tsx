import * as React from 'react';
import { Form } from 'react-bootstrap';
import { IdQueryParamName, SPLists, reactRoutes, userDetailHeaderText, userDetailsValidationText } from '../../../helper/constants';
import { createListItem } from '../../../service/SPService';

export interface QuizUserDetailsProps {
  context: any;
  // getUserInfoID:any
}
export interface QuizUserDetailsStates {
  email: string;
  name: string;
  country: string
}

export default class QuizUserDetails extends React.Component<QuizUserDetailsProps, QuizUserDetailsStates> {
  constructor(props: QuizUserDetailsProps) {
    super(props);
    this.state = {
      email: '',
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
          <div className="container form-container user-details">
            <form onSubmit={this.handleSubmit}>
              {/* User Details */}
              <div className="form-group">
                <label htmlFor="name">Email:</label>
                <input type="email" className="form-control" id="email" name="email" value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }} required />
              </div>
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

  handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if(this.validateForm()){
        const result = window.confirm("Are you sure you want to proceed?");
        if (result) {
          const userDetailsBody = JSON.stringify({
            __metadata: { type: `SP.Data.${SPLists.quizResponseInternalName}ListItem` },
            'Title': this.state.email,
            'Name': this.state.name,
            'Country': this.state.country
          })
  
          const createItemResponse = await createListItem(this.props.context, userDetailsBody, SPLists.quizResponseTitle);
          if (createItemResponse > 0) {
            //this.props.getUserInfoID(createItemResponse);
            window.location.href = `#${reactRoutes.quiz}?&${IdQueryParamName}=${createItemResponse}`
          }
          else {
            console.log("Something went wrong.");
          }
        }
      }
      else{
        alert(userDetailsValidationText);
      }
    } catch (error) {
      console.log(error);
    }
  }

  validateEmail = (email:string) => {
    try {
      if (!email) {
        return false
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        return false
      }
      else {
        return true
      }
    } catch (error) {
      console.log(error);
    }
  }

  validateForm = () => {
    try {
      if(!this.validateEmail(this.state.email)){
        return false;
      }
      else if (!this.state.name.trim()){
        return false;
      }
      else if(!this.state.country){
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}