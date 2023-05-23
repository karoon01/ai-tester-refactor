import UpsertScript from '../../components/UpsertScript/UpsertScript'
import { createScript, getAllUserInfoFields, tryScript } from '../../services/user/scriptsService'

const CreateScript = () => {
  return (
    <UpsertScript
      sendRequest={createScript}
      tryScriptMethod={tryScript}
      getAllUserInfoFields={getAllUserInfoFields}
      isAdmin={false}
    />
  )
}

CreateScript.title = 'Create Script'
CreateScript.isOnlyUser = true

export default CreateScript
