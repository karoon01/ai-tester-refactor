import { useState } from 'react'
import { NavLink } from 'react-bootstrap'
import { FiMinus, FiPlus } from 'react-icons/fi'
import PropTypes from 'prop-types'
import style from './index.module.css'

const CategoryItem = ({ category }) => {
  const [childVisible, setChildVisiblity] = useState(false)

  const hasChild = category.subCategories.length > 0 ? true : false
  return (
    <li className={`pro-menu-item pro-sub-menu ${childVisible ? 'open' : ''}`}>
      <div className={`pro-inner-item ${style.item}`}>
        <NavLink href={`/category/${category.slug}`} className={style.link}>
          {category.name}
        </NavLink>
        {hasChild && (
          <span
            className={`pro-arrow-wrapper ${style.wrapper}`}
            onClick={() => setChildVisiblity((current) => !current)}
          >
            {childVisible ? <FiMinus fontSize={20} /> : <FiPlus fontSize={20} />}
          </span>
        )}
      </div>
      {hasChild && (
        <div
          className={`react-slidedown pro-inner-list-item ${!childVisible ? 'closed' : ''}`}
          style={{ height: 'auto', transitionProperty: 'none' }}
        >
          <div>
            <ul>
              {category.subCategories.map((subCategory) => (
                <CategoryItem category={subCategory} key={subCategory._id} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}

CategoryItem.propType = {
  category: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
}

export default CategoryItem
