import UpsertScript from '../../../components/UpsertScript/UpsertScript'
import {
  editScript,
  getAllUserInfoFields,
  getScriptById,
  getScriptExample,
  getUserInfoFields,
  tryScript,
} from '../../../services/user/scriptsService'

function EditScript() {
  return (
    <UpsertScript
      sendRequest={editScript}
      tryScriptMethod={tryScript}
      isEditing={true}
      isAdmin={false}
      getAllUserInfoFields={getAllUserInfoFields}
      getScriptById={getScriptById}
      getUserInfoFields={getUserInfoFields}
      getScriptExample={getScriptExample}
    />
  )
}

EditScript.title = 'Edit Script'
EditScript.isOnlyUser = true

export default EditScript
