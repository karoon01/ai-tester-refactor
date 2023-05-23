import React, { useEffect, useRef, useState } from 'react'
import { Button, Container, Dropdown, Form, InputGroup } from 'react-bootstrap'
import { Search } from 'react-bootstrap-icons'
import { useForm } from 'react-hook-form'
import PropTypes from 'prop-types'
import { searchScripts } from '../../../services/scriptsService'
import { useDebounce } from '../../../hooks/useDebounce'
import useFullPageLoader from '../../../hooks/useFullPageLoader'
import { INPUT_TYPES } from '../../../utils/constants'
import HookFormControllerField from '../../HookForm/ControllerField'
import FoundItem from './FoundItem'
import style from './index.module.css'

function SearchPanel({ toast }) {
  const [scripts, setScripts] = useState([])
  const [isVisibleSearch, setIsVisibleSearch] = useState(false)
  const [searchedScripts, setSearchedScripts] = useState('')
  const [loader, showLoader, hideLoader] = useFullPageLoader()

  const search = useRef(null)

  const debouncedSearchScript = useDebounce(searchedScripts, 750)

  useEffect(() => {
    const closeOpenMenus = (e) => {
      if (search.current.contains(e.target)) {
        setIsVisibleSearch(true)
      } else {
        setIsVisibleSearch(false)
      }
    }

    findScripts({ value: debouncedSearchScript })

    document.addEventListener('mousedown', closeOpenMenus)
    return () => {
      document.removeEventListener('mousedown', closeOpenMenus)
    }
  }, [debouncedSearchScript])

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      value: '',
    },
    mode: 'onSubmit',
  })

  const findScripts = async (values) => {
    showLoader()
    await searchScripts(
      values,
      (data) => setScripts(data),
      (message) => toast.error(message)
    )
    hideLoader()
  }

  const onSubmit = async (values) => findScripts(values)
  const onError = (errors) => toast.error(errors.value?.message)

  return (
    <Container ref={search} style={{ maxWidth: 800 }}>
      <div className={style.searchPanel}>
        <Form onSubmit={handleSubmit(onSubmit, onError)} className={style.searchContainer}>
          <InputGroup className={style.searchInput}>
            <HookFormControllerField
              inputType={INPUT_TYPES.SEARCH}
              control={control}
              name="value"
              rules={{
                required: {
                  value: true,
                  message: 'Enter something to search',
                },
              }}
              setSearchedScripts={setSearchedScripts}
            />

            <Button type="submit">
              <Search />
            </Button>
          </InputGroup>
          <Dropdown show={scripts.length > 0 && isVisibleSearch}>
            <Dropdown.Menu className={style.searchMenu}>
              {scripts.map((script) => (
                <FoundItem key={script._id} script={script} />
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown show={watch('value') && !scripts.length && !loader && isVisibleSearch}>
            <Dropdown.Menu className={`${style.searchMenu} ${style.notFound}`}>
              <h5>No scripts found</h5>
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </div>
    </Container>
  )
}
SearchPanel.propTypes = {
  toast: PropTypes.func.isRequired,
}
export default SearchPanel
