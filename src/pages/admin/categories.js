import React from 'react'
import { Container } from 'react-bootstrap'
import CategoriesList from '../../components/Admin/Categories/CategoriesList'

const Categories = () => {
  return (
    <Container fluid="xxl" className="mt-5">
      <CategoriesList />
    </Container>
  )
}

Categories.isOnlyAdmin = true

export default Categories
