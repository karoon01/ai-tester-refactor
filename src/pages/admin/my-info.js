import InfoPage from '../../components/UserInfoFields'
import {
  createUserInfoField,
  editUserInfoField,
  getAllUserInfoFieldsForUserScripts,
  removeUserInfoField,
} from '../../services/admin/userInfoFieldService'

function MyInfoPage() {
  return (
    <InfoPage
      getFieldsMethod={getAllUserInfoFieldsForUserScripts}
      createFieldMethod={createUserInfoField}
      editFieldsMethod={editUserInfoField}
      removeFieldsMethod={removeUserInfoField}
      isAdmin={true}
    />
  )
}

export default MyInfoPage
