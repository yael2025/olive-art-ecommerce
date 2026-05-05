import {Navigate } from "react-router-dom"
import {useUser} from "../context/UserContext"

function ProtectedRoute({children, adminOnly = false}) {
    const {user} = useUser()

    if(!user){
        return <Navigate to = "/login" replace />
    }

    if(adminOnly && !user.isAdmin){
        return <Navigate to = "/login" replace/>
     }

     return children
    
}

export default ProtectedRoute