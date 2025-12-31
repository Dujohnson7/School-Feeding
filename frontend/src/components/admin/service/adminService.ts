import apiClient from "@/lib/axios"

export interface User {
    id: string
    name: string
    email: string
    role: string
    userStatus: boolean | string
    created?: string
    companyName?: string
    names?: string
    profile?: string
    phone?: string
    password?: string
    district?: string | any
    school?: string | any
    province?: string
    tinNumber?: string
    address?: string
    bankName?: string
    bankAccount?: string
    items?: string[]
}

export interface AuditLog {
    id?: string
    timestamp: string
    user: User | null
    action: string
    resource: string
    details: string
    actionStatus: string
}

export const adminService = {
    // Dashboard
    getTotalUsers: async () => {
        const response = await apiClient.get("/adminDashboard/totalUser")
        return response.data
    },
    getTotalSchools: async () => {
        const response = await apiClient.get("/adminDashboard/totalSchool")
        return response.data
    },
    getTotalDistricts: async () => {
        const response = await apiClient.get("/adminDashboard/totalDistrict")
        return response.data
    },
    getTotalPendingRequests: async () => {
        const response = await apiClient.get("/adminDashboard/totalRequestPending")
        return response.data
    },
    getTop4Audits: async () => {
        const response = await apiClient.get("/adminDashboard/listTop4Audit")
        return response.data
    },
    getTotalUserLoginThisWeek: async () => {
        const response = await apiClient.get("/adminDashboard/totalUserLoginThisWeek")
        return response.data
    },
    getCountLoginsPerDayOfWeek: async () => {
        const response = await apiClient.get("/adminDashboard/countLoginsPerDayOfWeek")
        return response.data
    },

    // Audit Logs
    getAuditLogs: async () => {
        const response = await apiClient.get("/audit")
        return response.data
    },

    // User Management
    getAllUsers: async () => {
        const response = await apiClient.get(`/users/all`)
        return response.data
    },

    getProvinces: async () => {
        const response = await apiClient.get(`/users/province`)
        return response.data
    },

    getDistrictsByProvince: async (province: string) => {
        const response = await apiClient.get(`/users/districts-by-province`, {
            params: { province }
        })
        return response.data
    },

    getSchoolsByDistrict: async (districtEnum: string) => {
        const response = await apiClient.get(`/users/schoolByDistrict`, {
            params: { district: districtEnum }
        })
        return response.data
    },

    getBanks: async () => {
        const response = await apiClient.get(`/users/bankName`)
        return response.data
    },

    getAllItems: async () => {
        const response = await apiClient.get(`/item/all`)
        return response.data
    },

    registerSupplier: async (supplierData: any) => {
        const response = await apiClient.post("/supplier/register", supplierData)
        return response.data
    },

    updateSupplier: async (id: string, supplierData: any) => {
        const response = await apiClient.put(`/supplier/update/${id}`, supplierData)
        return response.data
    },

    createUser: async (userData: Omit<User, 'id'>) => {
        const userPayload: any = {
            names: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            phone: userData.phone,
            userStatus: userData.userStatus === 'active' || userData.userStatus === true
        }

        if (userData.district) userPayload.district = { id: userData.district }
        if (userData.school) userPayload.school = { id: userData.school }
        if (userData.province) userPayload.province = userData.province
        if (userData.companyName) userPayload.companyName = userData.companyName
        if (userData.tinNumber) userPayload.tinNumber = userData.tinNumber
        if (userData.address) userPayload.address = userData.address
        if (userData.bankName) userPayload.bankName = userData.bankName
        if (userData.bankAccount) userPayload.bankAccount = userData.bankAccount

        const response = await apiClient.post(`/users/register`, userPayload)
        return response.data
    },

    updateUser: async (id: string, userData: Partial<User>) => {
        const userPayload: any = {
            names: userData.name,
            email: userData.email,
            role: userData.role,
            phone: userData.phone,
            userStatus: userData.userStatus === 'active' || userData.userStatus === true
        }

        if (userData.district) userPayload.district = { id: userData.district }
        if (userData.school) userPayload.school = { id: userData.school }
        if (userData.province) userPayload.province = userData.province
        if (userData.companyName) userPayload.companyName = userData.companyName
        if (userData.tinNumber) userPayload.tinNumber = userData.tinNumber
        if (userData.address) userPayload.address = userData.address
        if (userData.bankName) userPayload.bankName = userData.bankName
        if (userData.bankAccount) userPayload.bankAccount = userData.bankAccount

        const response = await apiClient.put(`/users/update/${id}`, userPayload)
        return response.data
    },

    changePassword: async (id: string, newPassword: string) => {
        const response = await apiClient.put(`/users/changePassword/${id}`, {
            id,
            password: newPassword
        })
        return response.data
    },

    suspendUser: async (id: string) => {
        const response = await apiClient.put(`/users/suspend/${id}`)
        return response.data
    },

    deleteUser: async (id: string) => {
        const response = await apiClient.delete(`/users/delete/${id}`)
        return response.data
    }
}
