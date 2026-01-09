import apiClient from "@/lib/axios"

export enum EFiscalState {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    COMPLETED = "COMPLETED"
}

export enum EBudget {
    ON_TRACK = "ON_TRACK",
    AT_RISK = "AT_RISK",
    OFF_TRACK = "OFF_TRACK"
}

export interface BudgetGov {
    id: string;
    fiscalYear: string;
    budget: number;
    spentBudget: number;
    description: string;
    fiscalState: EFiscalState;
}

export interface BudgetDistrict {
    id: string;
    budgetGov: BudgetGov;
    district: any;
    budget: number;
    spentBudget: number;
    budgetStatus: EBudget;
    active: boolean;
}

export interface BudgetSchool {
    id: string;
    budgetDistrict: BudgetDistrict;
    school: any;
    budget: number;
    spentBudget: number;
    budgetStatus: EBudget;
}

export const budgetService = {
    //====================
    // Government Budget
    //====================
    getAllBudgetGov: async (): Promise<BudgetGov[]> => {
        const response = await apiClient.get('/budgetGov/budgetFiscal')
        return response.data
    },

    getGovDistrictAllocations: async (): Promise<BudgetDistrict[]> => {
        const response = await apiClient.get('/budgetGov/districtAllocation')
        return response.data
    },

    registerBudgetGov: async (data: Partial<BudgetGov>): Promise<BudgetGov> => {
        const response = await apiClient.post('/budgetGov/register', data)
        return response.data
    },

    updateBudgetGov: async (id: string, data: Partial<BudgetGov>): Promise<BudgetGov> => {
        const response = await apiClient.put(`/budgetGov/update/${id}`, data)
        return response.data
    },

    deleteBudgetGov: async (id: string): Promise<void> => {
        await apiClient.delete(`/budgetGov/delete/${id}`)
    },

    getBudgetGovById: async (id: string): Promise<BudgetGov> => {
        const response = await apiClient.get(`/budgetGov/${id}`)
        return response.data
    },

    allocateBudget: async (id: string): Promise<BudgetGov> => {
        const response = await apiClient.post(`/budgetGov/allocateBudget/${id}`)
        return response.data
    },

    getCurrentBudgetStat: async (): Promise<BudgetGov> => {
        const response = await apiClient.get('/budgetGov/currentBudgetStat')
        return response.data
    },

    getAllocatedDistrictCount: async (): Promise<number> => {
        const response = await apiClient.get('/budgetGov/allocatedDistrict')
        return response.data
    },

    //====================
    // District Budget
    //====================
    getAllBudgetGovDistrict: async (): Promise<BudgetGov[]> => {
        const response = await apiClient.get('/budgetDistrict/budgetFiscal')
        return response.data
    },

    getBudgetDistrictsByDistrictId: async (districtId: string): Promise<BudgetDistrict[]> => {
        const response = await apiClient.get(`/budgetDistrict/budgetAllocateToDistrict/${districtId}`)
        return response.data
    },

    getBudgetSchoolsByDistrictId: async (districtId: string): Promise<BudgetSchool[]> => {
        const response = await apiClient.get(`/budgetDistrict/budgetAllocateToSchool/${districtId}`)
        return response.data
    }
}
