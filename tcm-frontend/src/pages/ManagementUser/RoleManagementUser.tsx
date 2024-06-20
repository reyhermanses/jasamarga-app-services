import RoleManagementListUser from "./RoleManagementListUser"
import RoleManagementModalAddUser from "./RoleManagementModalAddUser"

const RoleManagementUser = () => {
    return (
        <>
            Role Management User
            <br /><br />
            <RoleManagementModalAddUser/>
            <br />
            <RoleManagementListUser />
        </>
    )
}

export default RoleManagementUser