import Header from '../Header'

import './index.css'

const Home = props => {
  const onClickFindJobsBtn = () => {
    const {history} = props
    history.replace('/jobs')
  }

  return (
    <>
      <div className="header-container">
        <Header />
      </div>
      <div className="main-home-container">
        <div className="home-container">
          <h1 className="main-heading-home">
            Find The Job That <br />
            Fits Your Life
          </h1>
          <p className="para-home">
            Millions of people are searching for jobs, salary <br />
            information, company reviews. Find the job that fits your
            <br />
            abilities and potential
          </p>

          <button
            type="button"
            className="find-jobs-btn"
            onClick={onClickFindJobsBtn}
          >
            Find Jobs
          </button>
        </div>
      </div>
    </>
  )
}

export default Home
