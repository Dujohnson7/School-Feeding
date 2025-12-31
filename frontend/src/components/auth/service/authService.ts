import apiClient from "@/lib/axios"

export const authService = {
    login: async (payload: any) => {
        const response = await apiClient.post("/auth/login", payload)
        return response.data
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post("/auth/forgot-password", { email })
        return response.data
    },

    verifyOtp: async (payload: { email: string; otp: string; purpose: string }) => {
        const response = await apiClient.post("/auth/verify-otp", payload)
        return response.data
    },

    resendOtp: async (payload: { email: string; purpose: string }) => {
        const response = await apiClient.post("/auth/resend-otp", payload)
        return response.data
    },

    resetPassword: async (payload: any) => {
        const response = await apiClient.post("/auth/reset-password", payload)
        return response.data
    },
}
