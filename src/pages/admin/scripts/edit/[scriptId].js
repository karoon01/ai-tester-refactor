import UpsertScript from '../../../../components/UpsertScript/UpsertScript'
import {
  editScript,
  getAllUserInfoFields,
  getScriptById,
  getScriptExample,
  getUserInfoFields,
  tryScript,
} from '../../../../services/admin/scriptsService'

function EditScript() {
  return (
    <UpsertScript
      sendRequest={editScript}
      tryScriptMethod={tryScript}
      isEditing={true}
      isAdmin={true}
      getAllUserInfoFields={getAllUserInfoFields}
      getScriptById={getScriptById}
      getUserInfoFields={getUserInfoFields}
      getScriptExample={getScriptExample}
    />
  )
}

EditScript.isOnlyAdmin = true

export default EditScript
