import apiClient from "@/lib/axios"

export interface StudentFeedingReport {
    feedingDate: string;
    mealType: string;
    itemUsed: string;
    quantityUsed: string;
    studentsServed: number;
}

export interface SchoolStockManagementReport {
    item: string;
    openingStock: number;
    received: number;
    used: number;
    remaining: number;
    stockStatus: string;
}

export interface FinancialSummaryReport {
    description: string;
    amount: number;
}

export interface PerformanceIndicatorReport {
    indicator: string;
    result: string;
    status: string;
}

export interface SchoolStats {
    foodStockLevel: number
    stockLevelStatus: string
    pendingRequests: number
    highPriorityRequests: number
    normalPriorityRequests: number
    nextDeliveryDate: string
    nextDeliveryTime: string
    studentsFedToday: number
    totalRegisteredStudents: number
}

export interface RecentDelivery {
    id: string
    date: string
    items: string
    supplier: string
    status: string
}

export interface UpcomingSchedule {
    id: string
    title: string
    date: string
    time: string
    status: "Scheduled" | "Upcoming"
}

export interface Item {
    id: string
    name: string
    category?: string
    unit?: string
}

export interface StockManager {
    id: string
    names?: string
    name?: string
    email: string
    phone?: string
    role?: string
    userStatus?: boolean | string
    school?: { id: string; name?: string }
    created?: string
    lastActive?: string
}

export const schoolService = {
    // =======================
    // Dashboard
    // =======================

    getDashboardStats: async (schoolId: string) => {
        const response = await apiClient.get(`/schoolDashboard/stats?schoolId=${schoolId}`)
        return response.data
    },
    getTotalStudent: async (schoolId: string) => {
        const response = await apiClient.get(`/schoolDashboard/totalStudent/${schoolId}`)
        return response.data
    },
    getRecentDeliveries: async (schoolId: string, limit: number = 5) => {
        const response = await apiClient.get(`/schoolDashboard/recent-deliveries?schoolId=${schoolId}&limit=${limit}`)
        return response.data
    },
    getUpcomingSchedule: async (schoolId: string, limit: number = 4) => {
        const response = await apiClient.get(`/schoolDashboard/upcoming-schedule?schoolId=${schoolId}&limit=${limit}`)
        return response.data
    },

    // =======================
    // Food Requests
    // =======================

    getAllItems: async () => {
        const response = await apiClient.get("/item/all")
        return response.data
    },
    createFoodRequest: async (payload: any) => {
        const response = await apiClient.post("/requestRequestItem/register", payload)
        return response.data
    },

    // =======================
    // Stock Managers
    // =======================

    getAllStockManagers: async (schoolId: string) => {
        const response = await apiClient.get(`/stockManager/all/${schoolId}`)
        return response.data
    },
    getStockManager: async (id: string) => {
        const response = await apiClient.get(`/stockManager/${id}`)
        return response.data
    },
    registerStockManager: async (stockManagerData: any) => {
        const response = await apiClient.post(`/stockManager/register`, stockManagerData)
        return response.data
    },
    updateStockManager: async (id: string, stockManagerData: any) => {
        const response = await apiClient.put(`/stockManager/update/${id}`, stockManagerData)
        return response.data
    },
    deleteStockManager: async (id: string) => {
        const response = await apiClient.delete(`/stockManager/delete/${id}`)
        return response.data
    },


    // =======================
    // School Reports
    // =======================

    getStudentFeedingSummaryReport: async (schoolId: string, fromDate: string, toDate: string): Promise<StudentFeedingReport[]> => {
        const response = await apiClient.get(`/schoolReport/studentFeedingSummaryReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getSchoolStockManagementReport: async (schoolId: string, fromDate: string, toDate: string): Promise<SchoolStockManagementReport[]> => {
        const response = await apiClient.get(`/schoolReport/schoolStockManagementReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getSchoolFinancialSummaryReport: async (schoolId: string, fromDate: string, toDate: string): Promise<FinancialSummaryReport[]> => {
        const response = await apiClient.get(`/schoolReport/financialSummaryReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getSchoolPerformanceIndicatorsReport: async (schoolId: string, fromDate: string, toDate: string): Promise<PerformanceIndicatorReport[]> => {
        const response = await apiClient.get(`/schoolReport/performanceIndicatorsReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    }

}
