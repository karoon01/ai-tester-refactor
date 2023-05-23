import React from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import ScriptCard from '../ScriptCard'
import style from './index.module.css'

function ScriptsList({
  title,
  scripts,
  userId,
  setScriptsUpdated,
  canUninstall,
  toast,
  token,
  categoryName,
  moreUrl,
  showAuthModal,
}) {
  const router = useRouter()
  return (
    <div className="mt-3">
      {title}
      <div className="mt-3">
        <div className={style.scripts}>
          {scripts.map((script) => (
            <ScriptCard
              key={script._id}
              script={script}
              canEdit={script.author === userId}
              canRemove={script.author === userId}
              canUninstall={script.author !== userId && canUninstall}
              setScriptsUpdated={setScriptsUpdated}
              toast={toast}
              token={token}
              showAuthModal={showAuthModal}
              categoryName={categoryName}
            />
          ))}
        </div>
      </div>
      {moreUrl && (
        <div className={style.more} onClick={() => router.push(moreUrl)}>
          {'More >>>'}
        </div>
      )}
    </div>
  )
}

ScriptsList.propTypes = {
  title: PropTypes.object,
  scripts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
  toast: PropTypes.func.isRequired,
  userId: PropTypes.string,
  setScriptsUpdated: PropTypes.func,
  canUninstall: PropTypes.bool,
  token: PropTypes.string.isRequired,
  categoryName: PropTypes.string,
  moreUrl: PropTypes.string,
  showAuthModal: PropTypes.func.isRequired,
}

ScriptsList.defaultProps = {
  canUninstall: false,
  userId: '',
}

export default ScriptsList
