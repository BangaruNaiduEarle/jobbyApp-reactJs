import {Link} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'

import './index.css'

const JobItemDetails = props => {
  const {each} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = each

  return (
    <Link to={`/jobs/${id}`} className="link">
      <li className="jobDetailsList">
        <div className="jobDetailsContainer">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div>
            <h1 className="job-title">{title}</h1>

            <div className="rating-container">
              <AiFillStar className="fillStar" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        <div className="location-employment-packagePerAnnum-container">
          <div className="location-employment-container">
            <div className="location-container">
              <MdLocationOn className="location-icon" />
              <p>{location}</p>
            </div>
            <p className="employmentType">{employmentType}</p>
          </div>
          <p className="packagePerAnnum">{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />

        <h1 className="description">Description</h1>
        <p className="jobDescription">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItemDetails
