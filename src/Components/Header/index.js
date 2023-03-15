import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')

    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="navbar-container">
      <Link to="/">
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
      </Link>

      <div className="nav-elements-container">
        <Link to="/">
          <p className="nav-element">Home</p>
        </Link>

        <Link to="/jobs">
          <p className="nav-element">Jobs</p>
        </Link>
      </div>

      <div>
        <button type="button" className="logoutBtn" onClick={onClickLogoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
