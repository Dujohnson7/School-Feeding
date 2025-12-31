import apiClient from "@/lib/axios"

export interface DeliveryPerformanceReport {
    orderId: string;
    school: string;
    itemsDelivered: string;
    quantity: string;
    deliveryDate: string;
    status: string;
    delay: string;
}

export interface SupplierFinancialReport {
    item: string;
    quantitySupplied: number;
    unit: string;
    unitPrice: number;
    totalRevenue: number;
}

export interface QualityAssuranceReport {
    deliveryDate: string;
    order: string;
    qualityStatus: string;
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

export const supplierService = {

    // =======================
    // Dashboard
    // =======================

    getDashboardStats: async (supplierId: string) => {
        const response = await apiClient.get(`/supplier/dashboard/stats?supplierId=${supplierId}`)
        return response.data
    },
    getRecentOrders: async (supplierId: string, limit: number = 4) => {
        const response = await apiClient.get(`/supplier/dashboard/recent-orders?supplierId=${supplierId}&limit=${limit}`)
        return response.data
    },
    getUpcomingDeliveries: async (supplierId: string, limit: number = 3) => {
        const response = await apiClient.get(`/supplier/dashboard/upcoming-deliveries?supplierId=${supplierId}&limit=${limit}`)
        return response.data
    },
    getPerformanceMetrics: async (supplierId: string) => {
        const response = await apiClient.get(`/supplier/dashboard/performance?supplierId=${supplierId}`)
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

    getDeliveryPerformanceReport: async (supplierId: string, fromDate: string, toDate: string): Promise<DeliveryPerformanceReport[]> => {
        const response = await apiClient.get(`/supplierReport/deliveryPerformance`, { params: { supplierId, fromDate, toDate } })
        return response.data
    },

    getFinancialAnalysisReport: async (supplierId: string, fromDate: string, toDate: string): Promise<SupplierFinancialReport[]> => {
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
