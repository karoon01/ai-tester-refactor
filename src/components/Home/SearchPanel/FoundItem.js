import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import { Download } from 'react-bootstrap-icons'
import { FiHeart } from 'react-icons/fi'
import style from './index.module.css'

function FoundItem({ script }) {
  const router = useRouter()

  return (
    <Dropdown.Item
      className={style.searchMenuItem}
      onClick={() => router.push(`/scripts/${script.slug}`)}
    >
      <div>
        <p className={style.title}>{script.title}</p>
        <div className={`float-end ${style.itemRating}`}>
          <div className={style.itemRatingValue}>
            <FiHeart className={style.itemRatingIcon} /> {script.likes}
          </div>
          <div className={style.itemRatingValue}>
            <Download className={style.itemRatingIcon} /> {script.installs}
          </div>
        </div>
      </div>
    </Dropdown.Item>
  )
}

FoundItem.propTypes = {
  script: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    installs: PropTypes.number.isRequired,
  }).isRequired,
}

export default FoundItem
