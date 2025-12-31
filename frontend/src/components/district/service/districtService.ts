import apiClient from "@/lib/axios"

export interface DistrictOverviewReport {
    districtName: string;
    province: string;
    activeSchools: number;
    feedingCoverage: string;
    totalStudents: number;
    activeUsers: number;
}

export interface SchoolPerformanceReport {
    schoolName: string;
    students: number;
    feedingDays: number;
    mealsServed: number;
    performance: string;
}

export interface SupplierDistributionReport {
    supplier: string;
    schoolsServed: number;
    ordersDelivered: number;
    onTimeRate: string;
}

export interface DistrictFinancialReport {
    description: string;
    amount: number;
}

export interface NutritionComplianceReport {
    foodCategory: string;
    requiredWeekly: number;
    provided: number;
    status: string;
}

export interface SupplyChainMetricsReport {
    indicator: string;
    value: string;
}

export interface SupplierPaymentReport {
    supplier: string;
    schoolsServed: number;
    remain: number;
    paied: number;
    total: number;
}

export const districtService = {
    //====================
    // Dashboard
    //====================
    getDashboardStats: async (districtId: string) => {
        const response = await apiClient.get(`/district/dashboard/stats?districtId=${districtId}`)
        return response.data
    },
    getStockLevels: async (districtId: string) => {
        const response = await apiClient.get(`/district/dashboard/stock-levels?districtId=${districtId}`)
        return response.data
    },
    getRecentRequests: async (districtId: string, limit: number = 4) => {
        const response = await apiClient.get(`/district/dashboard/recent-requests?districtId=${districtId}&limit=${limit}`)
        return response.data
    },
    getUpcomingDeliveries: async (districtId: string, limit: number = 3) => {
        const response = await apiClient.get(`/district/dashboard/upcoming-deliveries?districtId=${districtId}&limit=${limit}`)
        return response.data
    },
    getPerformanceMetrics: async (districtId: string) => {
        const response = await apiClient.get(`/district/dashboard/performance?districtId=${districtId}`)
        return response.data
    },
    getMonthlyDistribution: async (districtId: string) => {
        const response = await apiClient.get(`/district/dashboard/monthly-distribution?districtId=${districtId}`)
        return response.data
    },

    //====================
    // Analytics
    //====================
    getAnalyticsStats: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/stats?districtId=${districtId}&period=${period}`)
        return response.data
    },
    getSchoolParticipation: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/school-participation?districtId=${districtId}&period=${period}`)
        return response.data
    },
    getDeliveryPerformance: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/delivery-performance?districtId=${districtId}&period=${period}`)
        return response.data
    },
    getNutritionCompliance: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/nutrition-compliance?districtId=${districtId}&period=${period}`)
        return response.data
    },
    getSchoolPerformance: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/school-performance?districtId=${districtId}&period=${period}`)
        return response.data
    },
    getBudgetAllocation: async (districtId: string, period: string) => {
        const response = await apiClient.get(`/district/analytics/budget-allocation?districtId=${districtId}&period=${period}`)
        return response.data
    },

    //====================
    // Supplier
    //====================
    registerSupplier: async (payload: any) => {
        const response = await apiClient.post(`/supplier/register`, payload)
        return response.data
    },

    //====================
    // Approvals & Requests
    //====================
    getAllItems: async () => {
        const response = await apiClient.get("/item/all")
        return response.data
    },
    getAllSuppliers: async () => {
        const response = await apiClient.get("/supplier/all")
        return response.data
    },
    getRequestsByStatus: async (districtId: string, status: string) => {
        const response = await apiClient.get(`/respondDistrict/districtRequestByRequestStatus?dId=${districtId}&requestStatus=${status}`)
        return response.data
    },
    getAllRequests: async (districtId: string) => {
        const response = await apiClient.get(`/respondDistrict/districtRequest/${districtId}`)
        return response.data
    },
    approveRequest: async (requestId: string) => {
        const response = await apiClient.put(`/respondDistrict/approval/${requestId}`)
        return response.data
    },
    assignOrder: async (payload: { requestItem: { id: string }; supplier: { id: string }; orderPrice: number }) => {
        const response = await apiClient.post("/respondDistrict/assignOrder", payload)
        return response.data
    },
    rejectRequest: async (requestId: string) => {
        const response = await apiClient.put(`/respondDistrict/reject/${requestId}`)
        return response.data
    },

    //====================
    // Supplier Management
    //====================
    getSuppliersByDistrict: async (districtId: string) => {
        const response = await apiClient.get(`/supplier/all/${districtId}`)
        return response.data
    },
    getSupplier: async (id: string) => {
        const response = await apiClient.get(`/supplier/${id}`)
        return response.data
    },
    getSupplierItems: async (supplierId: string) => {
        const response = await apiClient.get(`/supplier/items/${supplierId}`)
        return response.data
    },
    deleteSupplier: async (id: string) => {
        const response = await apiClient.delete(`/supplier/delete/${id}`)
        return response.data
    },

    // =======================
    // District Reports
    // =======================

    getDistrictOverviewReport: async (districtId: string, fromDate: string, toDate: string): Promise<DistrictOverviewReport[]> => {
        const response = await apiClient.get(`/districtReport/districtOverviewReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictSchoolPerformanceReport: async (districtId: string, fromDate: string, toDate: string): Promise<SchoolPerformanceReport[]> => {
        const response = await apiClient.get(`/districtReport/districtSchoolPerformanceReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictSupplierDistributionReport: async (districtId: string, fromDate: string, toDate: string): Promise<SupplierDistributionReport[]> => {
        const response = await apiClient.get(`/districtReport/districtSupplierDistributionReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictFinancialAnalysisReport: async (districtId: string, fromDate: string, toDate: string): Promise<DistrictFinancialReport[]> => {
        const response = await apiClient.get(`/districtReport/districtFinancialAnalysisReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictNutritionComplianceReport: async (districtId: string, fromDate: string, toDate: string): Promise<NutritionComplianceReport[]> => {
        const response = await apiClient.get(`/districtReport/districtNutritionComplianceReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictSupplyChainMetricsReport: async (districtId: string, fromDate: string, toDate: string): Promise<SupplyChainMetricsReport[]> => {
        const response = await apiClient.get(`/districtReport/districtSupplyChainMetricsReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    },

    getDistrictSupplierPaymentReport: async (districtId: string, fromDate: string, toDate: string): Promise<SupplierPaymentReport[]> => {
        const response = await apiClient.get(`/districtReport/districtSupplierPaymentReport`, { params: { districtId, fromDate, toDate } })
        return response.data
    }
}
