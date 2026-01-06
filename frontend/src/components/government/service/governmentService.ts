import apiClient from "@/lib/axios"

export interface NationalSummaryReport {
    totalDistricts: number;
    activeSchools: number;
    studentsBenefiting: number;
    coverageRate: string;
    activeUsers: number;
}

export interface NationalFinancialReport {
    description: string;
    amount: number;
}

export interface NationalNutritionReport {
    nutrientCategory: string;
    nationalRequirement: number;
    supplied: number;
    status: string;
}

export interface DistrictPerformanceReport {
    district: string;
    schools: number;
    coverage: string;
    stockAvailability: string;
    rating: string;
}

export interface SupplierEvaluationReport {
    supplier: string;
    districtsServed: number;
    onTimeDelivery: string;
    qualityRating: number;
    status: string;
}

export const governmentService = {
    //================
    // Dashboard
    //================

    getDashboardStats: async (period: string) => {
        const response = await apiClient.get(`/govDashboard/`)
        return response.data
    },
    getDistrictPerformance: async (period: string) => {
        const response = await apiClient.get(`/govDashboard/dashboard/districts?period=${period}`)
        return response.data
    },
    getNationalOverview: async (period: string) => {
        const response = await apiClient.get(`/govDashboard/dashboard/national-overview?period=${period}`)
        return response.data
    },
    getMonthlyDistribution: async (period: string) => {
        const response = await apiClient.get(`/govDashboard/dashboard/monthly-distribution?period=${period}`)
        return response.data
    },
    getKPIs: async (period: string) => {
        const response = await apiClient.get(`/govDashboard/dashboard/kpis?period=${period}`)
        return response.data
    },
    getAlerts: async () => {
        const response = await apiClient.get(`/govDashboard/dashboard/alerts`)
        return response.data
    },
    getTopDistricts: async () => {
        const response = await apiClient.get(`/government/dashboard/top-districts`)
        return response.data
    },
    getMilestones: async () => {
        const response = await apiClient.get(`/government/dashboard/milestones`)
        return response.data
    },
    getRecentActivities: async () => {
        const response = await apiClient.get(`/government/dashboard/recent-activities`)
        return response.data
    },

    //================
    // New Dashboard Endpoints
    //================
    getTotalSchool: async () => {
        const response = await apiClient.get(`/govDashboard/totalSchool`)
        return response.data
    },
    getTotalStudent: async () => {
        const response = await apiClient.get(`/govDashboard/totalStudent`)
        return response.data
    },
    getTotalDistricts: async () => {
        const response = await apiClient.get(`/govDashboard/totalDistrict`)
        return response.data
    },
    getCurrentBudget: async () => {
        const response = await apiClient.get(`/govDashboard/currentBudget`)
        return response.data
    },
    getProvincePerformance: async () => {
        const response = await apiClient.get(`/govDashboard/findProvincePerformance`)
        return response.data
    },
    getMonthlyFoodDistributionNew: async () => {
        const response = await apiClient.get(`/govDashboard/findMonthlyFoodDistribution`)
        return response.data
    },
    getNutritionComplianceRate: async () => {
        const response = await apiClient.get(`/govDashboard/nutritionComplianceRate`)
        return response.data
    },
    getOnTimeDeliveryRate: async () => {
        const response = await apiClient.get(`/govDashboard/onTimeDeliveryRate`)
        return response.data
    },
    getSupplierPerformanceRate: async () => {
        const response = await apiClient.get(`/govDashboard/supplierPerformanceRate`)
        return response.data
    },
    getBudgetParticipationRate: async () => {
        const response = await apiClient.get(`/govDashboard/budgetParticipationRate`)
        return response.data
    },
    getDistrictPerformanceDetails: async () => {
        const response = await apiClient.get(`/govDashboard/findDistrictPerformance`)
        return response.data
    },
    getNationalDistrictBudgetPerformance: async () => {
        const response = await apiClient.get(`/govDashboard/findNationalDistrictBudgetPerformance`)
        return response.data
    },

    //================
    // Analytics
    //================

    getAnalyticsStats: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/stats?period=${period}${districtQuery}`)
        return response.data
    },
    getRegionParticipation: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/region-participation?period=${period}${districtQuery}`)
        return response.data
    },
    getDeliveryPerformanceAnalytics: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/delivery-performance?period=${period}${districtQuery}`)
        return response.data
    },
    getNutritionCompliance: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/nutrition-compliance?period=${period}${districtQuery}`)
        return response.data
    },
    getSchoolEnrollment: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/school-enrollment?period=${period}${districtQuery}`)
        return response.data
    },
    getSchoolPerformance: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/school-performance?period=${period}${districtQuery}`)
        return response.data
    },
    getBudgetAllocation: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/budget-allocation?period=${period}${districtQuery}`)
        return response.data
    },
    getBudgetUtilization: async (period: string, district: string) => {
        const districtQuery = district !== "all" ? `&district=${district}` : ""
        const response = await apiClient.get(`/government/analytics/budget-utilization?period=${period}${districtQuery}`)
        return response.data
    },

    //================
    // Districts Management
    //================
    getAllDistricts: async () => {
        const response = await apiClient.get(`/district/all`)
        return response.data
    },
    getAllUsers: async () => {
        const response = await apiClient.get(`/users/all`)
        return response.data
    },
    getDistrict: async (id: string) => {
        const response = await apiClient.get(`/district/${id}`)
        return response.data
    },
    getProvinces: async () => {
        const response = await apiClient.get(`/district/province`)
        return response.data
    },
    getDistrictsByProvince: async (province: string) => {
        const response = await apiClient.get(`/district/districts-by-province`, {
            params: { province }
        })
        return response.data
    },
    registerDistrict: async (districtData: any) => {
        const response = await apiClient.post(`/district/register`, districtData)
        return response.data
    },
    updateDistrict: async (id: string, districtData: any) => {
        const response = await apiClient.put(`/district/update/${id}`, districtData)
        return response.data
    },
    deleteDistrict: async (id: string) => {
        const response = await apiClient.delete(`/district/delete/${id}`)
        return response.data
    },

    //================
    // Schools Management
    //================
    getAllSchools: async () => {
        const response = await apiClient.get(`/school/all`)
        return response.data
    },
    getSchool: async (id: string) => {
        const response = await apiClient.get(`/school/${id}`)
        return response.data
    },
    registerSchool: async (schoolData: any) => {
        const response = await apiClient.post(`/school/register`, schoolData)
        return response.data
    },
    updateSchool: async (id: string, schoolData: any) => {
        const response = await apiClient.put(`/school/update/${id}`, schoolData)
        return response.data
    },
    deleteSchool: async (id: string) => {
        const response = await apiClient.delete(`/school/delete/${id}`)
        return response.data
    },
    getSchoolProvinces: async () => {
        const response = await apiClient.get(`/school/province`)
        return response.data
    },
    getSchoolDistrictsByProvince: async (province: string) => {
        const response = await apiClient.get(`/school/districts-by-province`, {
            params: { province }
        })
        return response.data
    },
    getBanks: async () => {
        const response = await apiClient.get(`/school/bankName`)
        return response.data
    },

    //================
    // Items Management
    //================
    getAllItems: async () => {
        const response = await apiClient.get(`/item/all`)
        return response.data
    },
    getItem: async (id: string) => {
        const response = await apiClient.get(`/item/${id}`)
        return response.data
    },
    registerItem: async (itemData: any) => {
        const response = await apiClient.post(`/item/register`, itemData)
        return response.data
    },
    updateItem: async (id: string, itemData: any) => {
        const response = await apiClient.put(`/item/update/${id}`, itemData)
        return response.data
    },
    deleteItem: async (id: string) => {
        const response = await apiClient.delete(`/item/delete/${id}`)
        return response.data
    },
    getFoodCategories: async () => {
        const response = await apiClient.get(`/item/foodCategoryList`)
        return response.data
    },
    getFoodUnits: async () => {
        const response = await apiClient.get(`/item/foodUnitList`)
        return response.data
    },


    // =======================
    // Government Reports
    // =======================

    getNationalSummaryReport: async (fromDate: string, toDate: string): Promise<NationalSummaryReport[]> => {
        const response = await apiClient.get(`/govReport/nationalSummaryReport`, { params: { fromDate, toDate } })
        return response.data
    },

    getNationalFinancialReport: async (fiscalYear: string): Promise<NationalFinancialReport[]> => {
        const response = await apiClient.get(`/govReport/nationalFinancialReport`, { params: { fiscalYear } })
        return response.data
    },

    getNationalNutritionAnalysisReport: async (fromDate: string, toDate: string): Promise<NationalNutritionReport[]> => {
        const response = await apiClient.get(`/govReport/nationalNutritionAnalysisReport`, { params: { fromDate, toDate } })
        return response.data
    },

    getNationalDistrictPerformanceReport: async (fromDate: string, toDate: string): Promise<DistrictPerformanceReport[]> => {
        const response = await apiClient.get(`/govReport/nationalDistrictPerformanceReport`, { params: { fromDate, toDate } })
        return response.data
    },

    getNationalSupplierEvaluationReport: async (fromDate: string, toDate: string): Promise<SupplierEvaluationReport[]> => {
        const response = await apiClient.get(`/govReport/nationalSupplierEvaluationReport`, { params: { fromDate, toDate } })
        return response.data
    }

}
