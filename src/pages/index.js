import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { FiX } from 'react-icons/fi'
import PropTypes from 'prop-types'

import { getCategoriesTree } from '../services/categoriesService'
import CategoriesSidebar from '../components/Home/CategoriesSidebar'
import SearchPanel from '../components/Home/SearchPanel'
import { getTopInstalledScripts } from '../services/scriptsService'
import useFullPageLoader from '../hooks/useFullPageLoader'
import { CategoryMenuIcon } from '../utils/icons'
import ScriptsList from '../components/ScriptsList'

const Home = ({ toast, token, showAuthModal }) => {
  const [categories, setCategories] = useState()
  const [scripts, setScripts] = useState()
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false)

  const [loader, showLoader, hideLoader] = useFullPageLoader()

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      await getCategoriesTree(setCategories)
      await getTopInstalledScripts(setScripts)
      hideLoader()
    }

    fetchData()
  }, [])

  const toggleCategoriesVisibility = () => setIsCategoriesVisible((current) => !current)

  if (categories && scripts) {
    return (
      <Container fluid>
        <Row>
          <Col className="mb-3" xxl="3">
            <div className="categories-title" onClick={toggleCategoriesVisibility}>
              <div className="float-start">
                <h2>Categories</h2>
              </div>
              <div className="float-end toggle-menu-categories">
                <h2>{isCategoriesVisible ? <FiX /> : <CategoryMenuIcon />}</h2>
              </div>
            </div>
            <CategoriesSidebar categories={categories} isShow={isCategoriesVisible} />
          </Col>
          <Col xxl="9">
            <SearchPanel toast={toast} />
            <ScriptsList
              title={<h1>Top Installed</h1>}
              scripts={scripts}
              token={token}
              toast={toast}
              showAuthModal={showAuthModal}
            />
          </Col>
        </Row>
      </Container>
    )
  }

  return loader
}

Home.propTypes = {
  toast: PropTypes.func.isRequired,
  token: PropTypes.string,
  showAuthModal: PropTypes.func.isRequired,
}

export default Home
