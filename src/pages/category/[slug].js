import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Container } from 'react-bootstrap'
import { ArrowLeftCircle } from 'react-bootstrap-icons'

import useFullPageLoader from '../../hooks/useFullPageLoader'
import { getAllScriptsFromNestedCategories } from '../../services/scriptsService'
import Pagination from '../../components/Layout/Pagination'
import { getCategoryDetails, getSubCategories } from '../../services/categoriesService'
import ScriptsList from '../../components/ScriptsList'
import CategoriesList from '../../components/CategoryDetail/CategoriesList'
import style from './category.module.css'

function Category({ token, toast, showAuthModal }) {
  const ITEMS_PER_PAGE = 20

  const [scripts, setScripts] = useState([])
  const [category, setCategory] = useState()
  const [loader, showLoader, hideLoader] = useFullPageLoader()
  const [subCategories, setSubCategories] = useState([])
  const [scriptsTotalLength, setScriptsTotalLength] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [notFound, setNotFound] = useState(false)

  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    const fetchData = async () => {
      showLoader()
      await getCategoryDetails(slug, setCategory).catch(() => setNotFound(true))
      await getSubCategories(slug, setSubCategories)
      await getAllScriptsFromNestedCategories(
        slug,
        setScripts,
        setScriptsTotalLength,
        currentPage,
        ITEMS_PER_PAGE
      )
      hideLoader()
    }

    if (slug) fetchData()
  }, [slug, currentPage])

  if (notFound) {
    return (
      <section>
        <h1>Category not found</h1>
        <p>We can't find category with such slug. Maybe you were looking for something else</p>
      </section>
    )
  }
  return (
    <>
      {loader}
      <Container className={`${style.container} ${loader ? 'blur' : ''}`}>
        <ArrowLeftCircle className={style.backButton} size={30} onClick={router.back} />
        {category && (
          <>
            <h1>{category.name}</h1>
            <p className={style.description}>{category.description}</p>
          </>
        )}
        {subCategories.length > 0 && <CategoriesList subCategories={subCategories} />}
        {scripts.length > 0 && (
          <div>
            <ScriptsList
              title={<h2>Scripts</h2>}
              scripts={scripts}
              categoryName={category.name}
              token={token}
              toast={toast}
              showAuthModal={showAuthModal}
            />
            <Pagination
              setCurrentPage={setCurrentPage}
              itemsPerPage={ITEMS_PER_PAGE}
              totalItems={scriptsTotalLength}
            />
          </div>
        )}
      </Container>
    </>
  )
}

Category.propTypes = {
  token: PropTypes.string,
  toast: PropTypes.func.isRequired,
  showAuthModal: PropTypes.func.isRequired,
}

export default Category
