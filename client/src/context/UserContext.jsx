import { createContext, useContext, useState } from "react";

const UserContext= createContext()

export function UserProvider({children}){
    const [user, setUser] = useState(()=>{
        const savedUser  = localStorage.getItem("userInfo")
        return savedUser ? JSON.parse(savedUser) : null
    })

    const login = (userData) =>{
        setUser(userData)
        localStorage.setItem("userInfo", JSON.stringify(userData))
    }

    const logout = () =>{
        setUser(null)
        localStorage.removeItem("userInfo")
    }
     return (
        <UserContext.Provider value={{user, login, logout}}>
            {children}
        </UserContext.Provider>
     )
}
export function useUser() {
    return useContext(UserContext);
  }