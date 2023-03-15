import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN PROGRESS',
}

class AboutJob extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const optionsJobData = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const responseJobData = await fetch(jobDetailsApiUrl, optionsJobData)
    if (responseJobData.ok === true) {
      const fetchedJobData = await responseJobData.json()
      const updatedJobDetailsData = [fetchedJobData.job_details].map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          companyWebsiteUrl: eachItem.company_website_url,
          employmentType: eachItem.employment_type,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          lifeAtCompany: {
            description: eachItem.life_at_company.description,
            imageUrl: eachItem.life_at_company.image_url,
          },
          location: eachItem.location,
          packagePerAnnum: eachItem.package_per_annum,
          rating: eachItem.rating,
          skills: eachItem.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          title: eachItem.title,
        }),
      )

      const updatedSimilarJobDetails = fetchedJobData.similar_jobs.map(
        eachItem => ({
          companyLogoUrl: eachItem.company_logo_url,
          id: eachItem.id,
          jobDescription: eachItem.job_description,
          employmentType: eachItem.employment_type,
          location: eachItem.location,
          rating: eachItem.rating,
          title: eachItem.title,
        }),
      )
      console.log(updatedJobDetailsData)
      console.log(updatedSimilarJobDetails)
      this.setState({
        jobDataDetails: updatedJobDetailsData,
        similarJobsData: updatedSimilarJobDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetailsInProgressView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDataDetails[0]

    return (
      <div className="jobDetails-container">
        <div className="bg-job-details">
          <div className="logo-title-container">
            <div>
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
            </div>
            <div>
              <h1 className="job-title">{title}</h1>
              <div className="star-rating-container">
                <AiFillStar className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-employment-package-container">
            <div className="location-employment-container">
              <div className="location-container">
                <MdLocationOn className="location-icon" />
                <p className="location">{location}</p>
              </div>
              <p className="employmentType">{employmentType}</p>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="hr-line" />

          <div className="link-description-container">
            <h1 className="description">Description</h1>

            <div className="link-container">
              <a href={companyWebsiteUrl} className="visit-text">
                Visit
              </a>
              <BiLinkExternal className="link-icon" />
            </div>
          </div>

          <p className="jobDescription">{jobDescription}</p>

          <h1 className="skills-heading">Skills</h1>

          <ul className="unOrderSkillSet">
            {skills.map(each => (
              <li key={each.name} className="skill-list-item">
                <img
                  src={each.imageUrl}
                  alt={each.name}
                  className="skill-image"
                />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="life-at-company-text">Life at Company</h1>

          <div className="life-at-company-container">
            <div>
              <p className="life-at-company-text-desc">
                {lifeAtCompany.description}
              </p>
            </div>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>

        <h1 className="similar-jobs">Similar Jobs</h1>

        <ul className="unOrderSimilarJobs">
          {similarJobsData.map(each => (
            <SimilarJobs key={each.id} each={each} />
          ))}
        </ul>
      </div>
    )
  }

  onRetryJobDetailsAgain = () => this.getJobDetails()

  renderJobDetailsFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>we cannot seem to find the page you are looking for.</p>
      <div className="btn-container-failure">
        <button
          className="failure-jod-details-btn"
          type="button"
          onClick={this.onRetryJobDetailsAgain}
        >
          retry
        </button>
      </div>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobDetailsInProgressView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobDetailsPage">
        <Header />
        <div className="main-jobDetails-container">
          {this.renderJobDetails()}
        </div>
      </div>
    )
  }
}

export default AboutJob
