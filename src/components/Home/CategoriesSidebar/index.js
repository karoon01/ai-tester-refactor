import React from 'react'
import { Menu, SidebarContent } from 'react-pro-sidebar'
import PropTypes from 'prop-types'
import CategoryItem from './CategoryItem'
import styles from './index.module.css'

function CategoriesSidebar({ categories, isShow }) {
  return (
    <div className={`pro-sidebar ${styles.sidebarMenu} ${isShow ? styles.showCategories : ''}`}>
      <div className={`${styles.inner} pro-sidebar-inner`}>
        <div className="pro-sidebar-layout">
          <Menu>
            <SidebarContent>
              {categories.map((category) => (
                <CategoryItem category={category} key={category._id} />
              ))}
            </SidebarContent>
          </Menu>
        </div>
      </div>
    </div>
  )
}

CategoriesSidebar.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array,
    })
  ),
}

export default CategoriesSidebar
