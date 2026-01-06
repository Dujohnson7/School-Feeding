import apiClient from "@/lib/axios"

export interface DeliveryPerformanceReport {
    orderId: string;
    school: string;
    deliveryDate: string;
    status: string;
    delay: string;
}

export interface DeliveryPerformanceResponse {
    deliveryTable: DeliveryPerformanceReport[];
    totalOrders: number;
    onTimeDeliveries: number;
    lateDeliveries: number;
    cancelledOrders: number;
}

export interface SupplierFinancialReport {
    item: string;
    quantitySupplied: number;
    unitPrice: number;
    totalRevenue: number;
}

export interface FinancialAnalysisResponse {
    financialTable: SupplierFinancialReport[];
    totalRevenue: number;
    clearedPayments: number;
    pendingPayments: number;
    paymentCompletionRate: string;
}

export interface QualityAssuranceReport {
    deliveryDate: string;
    order: string;
    remarks: string;
}

export interface CustomerRelationsReport {
    school: string;
    ordersCompleted: number;
    averageRating: number;
    feedback: string;
}

export interface OperationsOverviewReport {
    indicator: string;
    value: string;
}

export interface Order {
    id: string
    created?: string
    updated?: string
    requestItem?: {
        id?: string
        description?: string
        requestStatus?: string
        school?: {
            id?: string
            name?: string
            address?: string
            email?: string
            phone?: string
            student?: number
            directorNames?: string
            district?: {
                id?: string
                province?: string
                district?: string
            }
        }
        district?: {
            id?: string
            province?: string
            district?: string
        }
        requestItemDetails?: Array<{
            id?: string
            quantity?: number
            item?: {
                id?: string
                name?: string
                perStudent?: number
                description?: string
            }
        }>
    }
    supplier?: {
        id?: string
        names?: string
        email?: string
        phone?: string
        companyName?: string
        items?: Array<{
            id?: string
            name?: string
            perStudent?: number
            description?: string
        }>
    }
    deliveryDate?: string | null
    expectedDate?: string | null
    deliveryStatus?: "APPROVED" | "SCHEDULED" | "PROCESSING" | "DELIVERED" | "CANCELLED" | "REJECTED"
    orderPrice?: number
    orderPayState?: "PENDING" | "PAID" | "PAYED" | "CANCELLED"
    rating?: number
}

export const supplierService = {

    // =======================
    // Dashboard
    // =======================

    getMonthlyRevenue: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/monthlyRevenue/${supplierId}`)
        return response.data
    },
    getActiveOrderBySupplier: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/activeOrderBySupplier/${supplierId}`)
        return response.data
    },
    findPendingDeliveriesBySupplierId: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/pendingDeliveriesBySupplierId/${supplierId}`)
        return response.data
    },
    findAvgPerformanceScore: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/avgPerformanceScore/${supplierId}`)
        return response.data
    },
    findAverageRatingMonthly: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/averageRatingMonthly/${supplierId}`)
        return response.data
    },
    findOrderByCompleted: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/orderByCompleted/${supplierId}`)
        return response.data
    },
    findFoodDelivered: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/foodDelivered/${supplierId}`)
        return response.data
    },
    findSchoolServedBySupplierId: async (supplierId: string): Promise<number> => {
        const response = await apiClient.get(`/supplierDashboard/schoolServedBySupplierId/${supplierId}`)
        return response.data
    },
    getRecentDeliveriesBySupplier: async (supplierId: string): Promise<Order[]> => {
        const response = await apiClient.get(`/supplierDashboard/recentDeliveriesBySupplier/${supplierId}`)
        return response.data
    },
    getUpcomingDeliveries: async (supplierId: string): Promise<Order[]> => {
        const response = await apiClient.get(`/supplierDashboard/upcomingDeliveries/${supplierId}`)
        return response.data
    },
  
    getPerformanceMetrics: async (supplierId: string) => {
        const response = await apiClient.get(`/supplierDashboard/performance?supplierId=${supplierId}`)
        return response.data
    },

    // =======================
    // Orders
    // =======================

    getOrder: async (id: string) => {
        const response = await apiClient.get(`/supplierOrder/${id}`)
        return response.data
    },
    getAllOrders: async (supplierId: string) => {
        const response = await apiClient.get(`/supplierOrder/all/${supplierId}`)
        return response.data
    },

    // =======================
    // Deliveries
    // =======================

    getDelivery: async (id: string) => {
        const response = await apiClient.get(`/supplierDelivery/${id}`)
        return response.data
    },
    getAllDeliveries: async (supplierId: string) => {
        const response = await apiClient.get(`/supplierDelivery/all/${supplierId}`)
        return response.data
    },
    processOrder: async (id: string) => {
        const response = await apiClient.put(`/supplierDelivery/processOrder/${id}`)
        return response.data
    },
    deliverOrder: async (id: string) => {
        const response = await apiClient.put(`/supplierDelivery/deliveryOrder/${id}`)
        return response.data
    },

    // =======================
    // Reports
    // =======================

    getDeliveryPerformanceReport: async (supplierId: string, fromDate: string, toDate: string): Promise<DeliveryPerformanceResponse> => {
        const response = await apiClient.get(`/supplierReport/deliveryPerformance`, { params: { supplierId, fromDate, toDate } })
        return response.data
    },

    getFinancialAnalysisReport: async (supplierId: string, fromDate: string, toDate: string): Promise<FinancialAnalysisResponse> => {
        const response = await apiClient.get(`/supplierReport/financialAnalysis`, { params: { supplierId, fromDate, toDate } })
        return response.data
    },

    getQualityAssuranceReport: async (supplierId: string, fromDate: string, toDate: string): Promise<QualityAssuranceReport[]> => {
        const response = await apiClient.get(`/supplierReport/qualityAssurance`, { params: { supplierId, fromDate, toDate } })
        return response.data
    },

    getCustomerRelationsReport: async (supplierId: string, fromDate: string, toDate: string): Promise<CustomerRelationsReport[]> => {
        const response = await apiClient.get(`/supplierReport/customerRelations`, { params: { supplierId, fromDate, toDate } })
        return response.data
    },

    getOperationsOverviewReport: async (supplierId: string, fromDate: string, toDate: string): Promise<OperationsOverviewReport[]> => {
        const response = await apiClient.get(`/supplierReport/operationsOverview`, { params: { supplierId, fromDate, toDate } })
        return response.data
    }
}
