import React from 'react'
import UpsertScript from '../../../components/UpsertScript/UpsertScript'
import { getAllUserInfoFields, saveScript, tryScript } from '../../../services/admin/scriptsService'

const CreateScript = () => {
  return (
    <UpsertScript
      sendRequest={saveScript}
      tryScriptMethod={tryScript}
      getAllUserInfoFields={getAllUserInfoFields}
      isAdmin={true}
    />
  )
}

CreateScript.isOnlyAdmin = true

export default CreateScript
