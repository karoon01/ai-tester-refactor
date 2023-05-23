import React from 'react'
import { Badge, NavLink } from 'react-bootstrap'
import style from './CategoriesList.module.css'

function CategoriesList({ subCategories }) {
  return (
    <div>
      <h2>Subcategories</h2>
      <div className={style.subcategories}>
        {subCategories.map((category) => (
          <Badge bg="#01004e" className={style.categoryBadge} key={category._id}>
            <NavLink href={`/category/${category.slug}`}> {category.name}</NavLink>
          </Badge>
        ))}
      </div>
    </div>
  )
}

export default CategoriesList
