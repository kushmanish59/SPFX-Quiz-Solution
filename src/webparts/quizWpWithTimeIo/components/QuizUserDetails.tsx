import * as React from 'react';
import { Form } from 'react-bootstrap';
import { IdQueryParamName, SPLists, reactRoutes, userDetailHeaderText, userDetailsValidationText } from '../../../helper/constants';
import { createListItem } from '../../../service/SPService';
import { ErrorLogging } from '../../../service/ErrorLogging';
import { QuizUserDetailsProps, QuizUserDetailsStates } from './models/IQuizUserDetailsModel';
import { HeaderControl } from '../../../components/HeaderControl';

export default class QuizUserDetails extends React.Component<QuizUserDetailsProps, QuizUserDetailsStates> {
  constructor(props: QuizUserDetailsProps) {
    super(props);
    this.state = {
      email: '',
      name: '',
      country: '',
      profession: '',
      countries: []
    };
  }

  componentDidMount(): void {
    try {
      const countries: string[] = this.getCountries();
      this.setState({
        countries: countries
      })
    } catch (error) {
      ErrorLogging(this.props.context, error, "QuizUserDetails (componentDidMount)");
    }
  }

  public render(): React.ReactElement<QuizUserDetailsProps> {
    const { countries } = this.state;
    return (
      <div className="container-fluid">
        <div className="container">
          <HeaderControl title={userDetailHeaderText} />
          <div className="container form-container user-details">
            <form onSubmit={this.handleSubmit}>
              {/* User Details */}
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input type="text" className="form-control" id="name" name="name" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }) }} required />
              </div>
              <div className="form-group">
                <label htmlFor="name">Email:</label>
                <input type="email" className="form-control" id="email" name="email" value={this.state.email} onChange={(e) => { this.setState({ email: e.target.value }) }} required />
              </div>
              <div className="form-group">
                <label htmlFor="country">Profession:</label>
                <Form.Select aria-label="Default select example" id="country" name="country" value={this.state.profession} onChange={(e) => { this.setState({ profession: e.target.value }) }}>
                  <option value="" disabled>Select Profression</option>
                  <option value="USA">Bussines</option>
                  <option value="UK">Salaried</option>
                  <option value="Canada">Student</option>
                  <option value="Australia">Other</option>
                </Form.Select>
              </div>
              <div className="form-group">
                <label htmlFor="country">Country:</label>
                <Form.Select aria-label="Default select example" id="country" name="country" value={this.state.country} onChange={(e) => { this.setState({ country: e.target.value }) }} required>
                  <option value="" disabled>Select Country</option>
                  {
                    countries.map((country) =>
                      <option value={country}>{country}</option>
                    )
                  }
                  {/* <option value="USA">USA</option>
                  <option value="UK">UK</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option> */}
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
      if (this.validateForm()) {
        const result = window.confirm("Are you sure you want to proceed?");
        if (result) {
          const userDetailsBody = JSON.stringify({
            __metadata: { type: `SP.Data.${SPLists.quizResponseInternalName}ListItem` },
            'Title': this.state.email,
            'Name': this.state.name,
            'Country': this.state.country,
            'Profession': this.state.profession
          })

          const createItemResponse = await createListItem(this.props.context, userDetailsBody, SPLists.quizResponseTitle);
          if (createItemResponse > 0) {
            window.location.href = `#${reactRoutes.quiz}?&${IdQueryParamName}=${createItemResponse}`
          }
          else {
            ErrorLogging(this.props.context, "error in saving user details.", "QuizUserDetails (handleSubmit)");
          }
        }
      }
      else {
        ErrorLogging(this.props.context, userDetailsValidationText, "QuizUserDetails (handleSubmit)");
      }
    } catch (error) {
      ErrorLogging(this.props.context, error, "QuizUserDetails (handleSubmit)");
    }
  }

  validateEmail = (email: string) => {
    try {
      if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
        return false
      }
      else {
        return true
      }
    } catch (error) {
      ErrorLogging(this.props.context, error, "QuizUserDetails (validateEmail)");
    }
  }

  validateForm = () => {
    try {
      if (!this.validateEmail(this.state.email) || !this.state.name.trim() || !this.state.country) {
        return false;
      }
      return true;
    } catch (error) {
      ErrorLogging(this.props.context, error, "QuizUserDetails (validateForm)");
    }
  }

  getCountries = (): string[] => {
    try {
      const countries = require("i18n-iso-countries");
      countries.registerLocale(require("i18n-iso-countries/langs/en.json"))
      const countryObj = countries.getNames('en', { select: "official" });
      // const countriesArray : string [] = 
      return Object.keys(countryObj).map(key => countryObj[key]);
    } catch (error) {
      ErrorLogging(this.props.context, error, "QuizUserDetails (getCountries)");
      return []
    }
  }
}