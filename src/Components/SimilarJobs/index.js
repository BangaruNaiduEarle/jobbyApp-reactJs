import {MdLocationOn} from 'react-icons/md'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {each} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = each

  return (
    <div>
      <div className="similarJob-container">
        <div className="similar-jobs">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
            className="similar-job-logo"
          />
          <div className="title-star-container">
            <h1 className="job-title">{title}</h1>
            <div className="star-rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>

        <h1 className="job-desc-heading">Description</h1>
        <p className="job-desc">{jobDescription}</p>

        <div className="location-type-container">
          <MdLocationOn className="location-icon" />
          <p className="location">{location}</p>
          <p className="employmentType">{employmentType}</p>
        </div>
      </div>
    </div>
  )
}

export default SimilarJobs
