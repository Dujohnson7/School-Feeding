import axios from "axios"

const API_BASE_URL = "http://localhost:8070/api/auth"

/**
 * Logout function that calls the backend API and clears local storage
 * @param navigate - Optional navigate function from react-router-dom
 */
export const logout = async (navigate?: (path: string) => void) => {
  try {
    const token = localStorage.getItem("token")
    
    // Call backend logout endpoint if token exists
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
      } catch (error) {
        // Even if the API call fails, we should still clear local storage
        console.error("Logout API call failed:", error)
      }
    }

    // Clear all authentication data from localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("districtId")
    localStorage.removeItem("schoolId")
    localStorage.removeItem("userId")

    // Navigate to login page if navigate function is provided
    if (navigate) {
      navigate("/login")
    } else {
      // Fallback: redirect using window.location if navigate is not available
      window.location.href = "/login"
    }
  } catch (error) {
    console.error("Error during logout:", error)
    // Still clear local storage and redirect even if there's an error
    localStorage.clear()
    if (navigate) {
      navigate("/login")
    } else {
      window.location.href = "/login"
    }
  }
}

