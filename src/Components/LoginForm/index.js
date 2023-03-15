import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginForm extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({
      showSubmitError: true,
      errorMsg,
    })
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginBtn = () => (
    <div className="loginBtnContainer">
      <button className="loginBtn" type="submit">
        Login
      </button>
    </div>
  )

  passwordDetails = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label htmlFor="PasswordInput" className="input-label">
          PASSWORD
        </label>
        <input
          type="password"
          id="PasswordInput"
          placeholder="Password"
          value={password}
          onChange={this.onChangePassword}
          className="input-field"
        />
      </div>
    )
  }

  userNameDetails = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label htmlFor="UserNameInput" className="input-label">
          USERNAME
        </label>

        <input
          type="text"
          id="UserNameInput"
          placeholder="Username"
          value={username}
          onChange={this.onChangeUsername}
          className="input-field"
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="main-app-container">
        <div className="app-container">
          <div className="input-bg-container">
            <div className="logo-container">
              <img
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
                className="website-logo"
              />
            </div>

            <form onSubmit={this.submitForm}>
              {this.userNameDetails()}
              {this.passwordDetails()}
              {this.loginBtn()}
              {showSubmitError && <p className="errorMsg">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
