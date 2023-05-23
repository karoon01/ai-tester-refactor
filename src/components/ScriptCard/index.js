import React, { createRef, useCallback, useState } from 'react'
import { Button, Card } from 'react-bootstrap'
import { FiEdit, FiHeart } from 'react-icons/fi'
import { BoxArrowLeft, Download, Trash } from 'react-bootstrap-icons'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import { toggleLikeScript } from '../../services/user/likesService'
import { removeScript, uninstallScript } from '../../services/user/scriptsService'
import { RedoIcon, UndoIcon } from '../../utils/icons'
import { debounce } from '../../utils/utils'
import ConfirmActionModal from '../Commons/ConfirmActionModal'
import { MODAL_HELPER_TEXT } from '../../utils/constants'
import style from './index.module.css'

function ScriptCard({
  token,
  toast,
  script,
  categoryName = null,
  canEdit = false,
  canRemove = false,
  canUninstall = false,
  setScriptsUpdated = null,
  showAuthModal,
}) {
  const [modal, setModal] = useState(false)
  const [cardSide, setCardSide] = useState(false)
  const [isLiked, setIsLiked] = useState(script.isLiked)

  const router = useRouter()

  const arrowRightRef = createRef()
  const arrowLeftRef = createRef()
  const likeRef = createRef()
  const editRef = createRef()
  const removeRef = createRef()
  const uninstallRef = createRef()

  const refArr = [arrowRightRef, arrowLeftRef, likeRef, editRef, removeRef, uninstallRef]
  const isNotTargetRef = (event) => !refArr.some((ref) => ref?.current?.contains(event.target))

  const scriptRedirection = (event) => {
    event.preventDefault()
    if (isNotTargetRef(event)) {
      const pathToNavigate =
        script.type === 'Public' ? `/scripts/${script.slug}` : `/scripts/edit/${script._id}`
      router.push(pathToNavigate)
    }
  }

  const handleLike = async () => {
    if (token) {
      setIsLiked((current) => !current)

      if (isLiked) {
        script.likes--
      } else {
        script.likes++
      }

      await toggleLikeScript(script?._id)

      if (setScriptsUpdated) {
        setScriptsUpdated()
      }
    } else {
      toast.error('Authorize first to like scripts')
      showAuthModal(() => router.reload(window.location.pathname))
    }
  }

  const debouncedLikeHandler = useCallback(debounce(handleLike, 500), [handleLike])

  const showRemoveScriptModal = (scriptId) => {
    const action = async () => {
      await removeScript(scriptId)
      setScriptsUpdated(true)
      setModal(false)
    }

    const RemoveScriptButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <Trash className="button-icon" /> Remove
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={RemoveScriptButton}
        helperText={MODAL_HELPER_TEXT.REMOVE_SCRIPT}
      />
    )
  }

  const showUninstallScriptModal = (scriptId) => {
    const action = async () => {
      await uninstallScript(scriptId)
      setScriptsUpdated(true)
      setModal(false)
    }

    const RemoveScriptButton = () => {
      return (
        <Button className="modal-button" variant="outline-danger" onClick={action}>
          <BoxArrowLeft className="button-icon" /> Uninstall
        </Button>
      )
    }

    setModal(
      <ConfirmActionModal
        setModal={setModal}
        ActionButton={RemoveScriptButton}
        helperText={MODAL_HELPER_TEXT.UNINSTALL_SCRIPT}
      />
    )
  }

  return (
    <>
      {modal}
      <Card className={`${style.card}`} onClick={scriptRedirection}>
        <div className={style.cardInner} style={cardSide ? { transform: 'rotateY(180deg)' } : {}}>
          <div className={style.cardFront}>
            <div className={style.actions}>
              {canEdit && script.type === 'Public' && (
                <div onClick={() => router.push(`/scripts/edit/${script._id}`)} ref={editRef}>
                  <FiEdit />
                </div>
              )}
              {canRemove && script.type !== 'Public' && (
                <div onClick={() => showRemoveScriptModal(script._id)} ref={removeRef}>
                  <Trash />
                </div>
              )}
              {canUninstall && (
                <div onClick={() => showUninstallScriptModal(script._id)} ref={uninstallRef}>
                  <BoxArrowLeft />
                </div>
              )}
            </div>
            {script.description && (
              <div
                className={style.arrowRight}
                ref={arrowRightRef}
                onClick={() => setCardSide(true)}
              >
                <UndoIcon />
              </div>
            )}
            <div>
              <Card.Title className={style.title}>
                <div className={style.titleText}>{script.title}</div>
              </Card.Title>
              <div className={style.category}>
                <b>{categoryName ?? script?.category?.name}</b>
              </div>
              <div className={style.likes} ref={likeRef}>
                <FiHeart
                  className={`${style.cardIcon} ${isLiked ? style.likeActive : style.like}`}
                  onClick={debouncedLikeHandler}
                />{' '}
                <div>{script.likes}</div>
              </div>
              <div className={style.installs}>
                <Download className={style.cardIcon} /> <div>{script.installs}</div>
              </div>
            </div>
          </div>
          {script.description && (
            <div className={style.cardBack}>
              <div>
                <div
                  className={style.arrowRight}
                  onClick={() => setCardSide(false)}
                  ref={arrowLeftRef}
                >
                  <RedoIcon />
                </div>

                <div className={style.description}>
                  <div className={style.descriptionText}>{script.description}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

ScriptCard.propTypes = {
  script: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    installs: PropTypes.number.isRequired,
    category: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
  categoryName: PropTypes.string,
  isRedirected: PropTypes.bool,
  canEdit: PropTypes.bool,
  token: PropTypes.string,
  canUninstall: PropTypes.bool,
  setScriptsUpdated: PropTypes.func,
  showAuthModal: PropTypes.func.isRequired,
}

export default ScriptCard
