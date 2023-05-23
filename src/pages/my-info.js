import InfoPage from '../components/UserInfoFields'
import {
  getAllUserInfoFieldsForUserScripts,
  createUserInfoField,
  editUserInfoField,
  removeUserInfoField,
} from '../services/user/userInfoFieldService'

function MyInfoPage() {
  return (
    <InfoPage
      getFieldsMethod={getAllUserInfoFieldsForUserScripts}
      createFieldMethod={createUserInfoField}
      editFieldsMethod={editUserInfoField}
      removeFieldsMethod={removeUserInfoField}
    />
  )
}

MyInfoPage.title = 'User Info Fields'
MyInfoPage.isOnlyUser = true

export default MyInfoPage
