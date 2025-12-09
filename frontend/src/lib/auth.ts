import apiClient from "./axios"
  
export const logout = async (navigate?: (path: string) => void) => {
  try {
    const token = localStorage.getItem("token")
     
    if (token) {
      try {
        await apiClient.post("/auth/logout", {})
      } catch (error) { 
        console.error("Logout API call failed:", error)
      }
    }
 
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("districtId")
    localStorage.removeItem("schoolId")
    localStorage.removeItem("userId")
 
    if (navigate) {
      navigate("/login")
    } else { 
      window.location.href = "/login"
    }
  } catch (error) {
    console.error("Error during logout:", error) 
    localStorage.clear()
    if (navigate) {
      navigate("/login")
    } else {
      window.location.href = "/login"
    }
  }
}

