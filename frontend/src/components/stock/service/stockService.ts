import apiClient from "@/lib/axios"

export interface StockMovementReport {
    itemName: string;
    openingStock: number;
    stockIn: number;
    stockOut: number;
    closingStock: number;
    stockState: string;
}

export interface InventoryReport {
    itemName: string;
    quantityAvailable: number;
    unit: string;
    expirationDate: string;
    stockState: string;
}

export interface GoodsReceivingReport {
    dateReceived: string;
    supplier: string;
    order: string;
    quantity: string;
    orderPrice: number;
    deliveryStatus: string;
}

export interface FoodDistributionReport {
    distributionDate: string;
    item: string;
    quantityUsed: string;
    school: string;
    reason: string;
}

export interface StockOut {
    id?: string
    created?: string
    updated?: string
    date?: string
    stockOutItemDetails?: any[]
    school?: { id?: string; name?: string }
    mealType?: "BREAKFAST" | "LAUNCH" | "SNACK"
    studentServed?: number
}

export interface CurrentStockLevelDTO {
    itemName: string;
    currentQuantity: number;
    unit: string;
    percentage: number;
}

export interface StockActivityView {
    activityId: string;
    activityType: string;
    itemName: string;
    quantity: number;
    schoolName: string;
    activityDate: string;
}

export interface StockIn {
    id?: string;
    school?: any;
    orders?: any;
    item?: any;
    quantity: number;
    expirationDate: string;
}

export const stockService = {

    // =======================
    // Dashboard (New)
    // =======================

    getTotalInventory: async (schoolId: string): Promise<number> => {
        const response = await apiClient.get(`/stockDashboard/totalInventory/${schoolId}`)
        return response.data
    },
    getTotalItemInLow: async (schoolId: string): Promise<number> => {
        const response = await apiClient.get(`/stockDashboard/totalItemInLow/${schoolId}`)
        return response.data
    },
    getExpiredSoonCount: async (schoolId: string): Promise<number> => {
        const response = await apiClient.get(`/stockDashboard/expired/${schoolId}`)
        return response.data
    },
    getExpiringSoonList: async (schoolId: string): Promise<StockIn[]> => {
        const response = await apiClient.get(`/stockDashboard/expiring-soon/${schoolId}`)
        return response.data
    },
    findRecentActivities: async (schoolId: string): Promise<StockActivityView[]> => {
        const response = await apiClient.get(`/stockDashboard/findRecentActivities/${schoolId}`)
        return response.data
    },
    getCurrentStockLevels: async (schoolId: string): Promise<CurrentStockLevelDTO[]> => {
        const response = await apiClient.get(`/stockDashboard/findCurrentStockLevelsBySchool/${schoolId}`)
        return response.data
    },
    getWeeklyTrendBySchool: async (schoolId: string): Promise<[string, number][]> => {
        const response = await apiClient.get(`/stockDashboard/findWeeklyNetStockTrendBySchool/${schoolId}`)
        return response.data
    },

    // =======================
    // Inventory
    // =======================

    getAllInventory: async (schoolId: string) => {
        const response = await apiClient.get(`/inventory/all/${schoolId}`)
        return response.data
    },

    // =======================
    // Distribution
    // =======================

    getAllDistributions: async (schoolId: string) => {
        const response = await apiClient.get(`/distribute/all/${schoolId}`)
        return response.data
    },
    getDistribution: async (id: string) => {
        const response = await apiClient.get(`/distribute/${id}`)
        return response.data
    },
    createDistribution: async (stockOut: StockOut) => {
        const response = await apiClient.post(`/distribute/register`, stockOut)
        return response.data
    },
    updateDistribution: async (id: string, stockOut: StockOut) => {
        const response = await apiClient.put(`/distribute/update/${id}`, stockOut)
        return response.data
    },
    deleteDistribution: async (id: string) => {
        const response = await apiClient.delete(`/distribute/delete/${id}`)
        return response.data
    },

    // =======================
    // Receiving
    // =======================
    getAllReceiving: async (schoolId: string) => {
        const response = await apiClient.get(`/receiving/all/${schoolId}`)
        return response.data
    },
    receiveOrder: async (id: string, rating: number) => {
        const response = await apiClient.put(`/receiving/receivingOrder/${id}?rating=${rating}`)
        return response.data
    },

    // =======================
    // Items 
    // =======================

    getAllItems: async () => {
        const response = await apiClient.get("/item/all")
        return response.data
    },

    // =======================
    // Stock Reports
    // =======================

    getStockMovementReport: async (schoolId: string, fromDate: string, toDate: string): Promise<StockMovementReport[]> => {
        const response = await apiClient.get(`/stockReport/stockMovementReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getInventoryManagementReport: async (schoolId: string, fromDate: string, toDate: string): Promise<InventoryReport[]> => {
        const response = await apiClient.get(`/stockReport/inventoryManagementReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getGoodsReceivingReport: async (schoolId: string, fromDate: string, toDate: string): Promise<GoodsReceivingReport[]> => {
        const response = await apiClient.get(`/stockReport/goodsReceivingReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    },

    getFoodDistributionReport: async (schoolId: string, fromDate: string, toDate: string): Promise<FoodDistributionReport[]> => {
        const response = await apiClient.get(`/stockReport/foodDistributionReport`, { params: { schoolId, fromDate, toDate } })
        return response.data
    }
}
