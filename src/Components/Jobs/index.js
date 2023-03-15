import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import JobItemDetails from '../JobItemDetails'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'IN PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    profile: {},
    searchInput: '',
    apiJobStatus: apiStatusConstants.initial,
    activeCheckBoxList: [],
    activeSalaryRangeId: '',
    jobsData: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getJobsData()
  }

  getProfile = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileData = data.profile_details
      const upDatedProfile = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }

      this.setState({
        apiStatus: apiStatusConstants.success,
        profile: upDatedProfile,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getJobsData = async () => {
    this.setState({apiJobStatus: apiStatusConstants.inProgress})

    const {activeCheckBoxList, activeSalaryRangeId, searchInput} = this.state
    const type = activeCheckBoxList.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const filteredJobsList = data.jobs.map(each => ({
        id: each.id,
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobsData: filteredJobsList,
        apiJobStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiJobStatus: apiStatusConstants.failure})
    }
  }

  renderJobSuccessView = () => {
    const {jobsData} = this.state

    const noOfJobs = jobsData.length > 0

    return noOfJobs ? (
      <ul className="unOrderJobList">
        {jobsData.map(each => (
          <JobItemDetails key={each.id} each={each} />
        ))}
      </ul>
    ) : (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
        />
        <h1>No jobs found</h1>
        <p>We could not find any jobs. Try other filters.</p>
      </div>
    )
  }

  onClickRetryJobsList = () => this.getJobsData()

  renderJobFailureView = () => (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something went Wrong</h1>
        <p>we cannot seem to find the page you are looking for</p>

        <button type="button" onClick={this.onClickRetryJobsList}>
          Retry
        </button>
      </div>
    </>
  )

  renderProfileSuccessView = () => {
    const {profile} = this.state

    const {name, profileImageUrl, shortBio} = profile

    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profileName">{name}</h1>
        <p className="shortBio">{shortBio}</p>
      </div>
    )
  }

  onClickRetryProfile = () => this.getProfile()

  renderProfileFailureView = () => (
    <div className="retry-btn-container">
      <button
        type="button"
        className="retryBtn"
        onClick={this.onClickRetryProfile}
      >
        Retry
      </button>
    </div>
  )

  renderProfileInProgressView = () => (
    <>
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </>
  )

  renderProfileViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileInProgressView()
      default:
        return null
    }
  }

  onChangeInputCheckbox = event => {
    const {activeCheckBoxList} = this.state

    if (activeCheckBoxList.includes(event.target.id)) {
      const updatedList = activeCheckBoxList.filter(
        each => each !== event.target.id,
      )

      this.setState({activeCheckBoxList: updatedList}, this.getJobsData)
    } else {
      this.setState(
        prevState => ({
          activeCheckBoxList: [
            ...prevState.activeCheckBoxList,
            event.target.id,
          ],
        }),
        this.getJobsData,
      )
    }
  }

  employmentViews = () => (
    <ul className="unOrderInputType">
      {employmentTypesList.map(eachItem => (
        <li className="ListStyle" key={eachItem.employmentTypeId}>
          <input
            type="checkbox"
            id={eachItem.employmentTypeId}
            className="input"
            onChange={this.onChangeInputCheckbox}
          />

          <label htmlFor={eachItem.employmentTypeId} className="inputLabel">
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onSelectSalaryRage = event => {
    this.setState({activeSalaryRangeId: event.target.id}, this.getJobsData)
  }

  salaryRangeViews = () => (
    <ul className="unOrderInputType">
      {salaryRangesList.map(eachItem => (
        <li className="ListStyle" key={eachItem.salaryRangeId}>
          <input
            type="radio"
            id={eachItem.salaryRangeId}
            className="input"
            name="option"
            onChange={this.onSelectSalaryRage}
          />

          <label htmlFor={eachItem.salaryRangeId} className="inputLabel">
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onchangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobsData()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobsData()
    }
  }

  onRenderSearchViews = () => {
    const {searchInput} = this.state
    return (
      <div className="searchInput-container">
        <input
          type="search"
          className="search-input"
          value={searchInput}
          placeholder="Search"
          onChange={this.onchangeSearchInput}
          onKeyDown={this.onEnterSearchInput}
        />

        <button
          type="button"
          data-testid="searchButton"
          onClick={this.onSubmitSearchInput}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  onRenderJobsView = () => {
    const {apiJobStatus} = this.state

    switch (apiJobStatus) {
      case apiStatusConstants.success:
        return this.renderJobSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderProfileInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-jobs-container">
        <div>
          <Header />
          <div className="jobs-container">
            <div className="side-bar-container">
              {this.renderProfileViews()}
              <hr className="hr-line" />
              <h1 className="filter-heading">Type of Employment</h1>
              {this.employmentViews()}
              <hr className="hr-line" />
              <h1 className="filter-heading">Salary Range</h1>
              {this.salaryRangeViews()}
            </div>

            <div className="jobSearchContainer">
              {this.onRenderSearchViews()}

              <div>{this.onRenderJobsView()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
