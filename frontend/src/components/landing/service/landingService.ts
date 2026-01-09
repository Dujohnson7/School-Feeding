import apiClient from "@/lib/axios"

export interface LandingStats {
    totalDistrict: number;
    totalStudent: number;
    totalSupplier: number;
    totalSchool: number;
}

export const landingService = {
    getStats: async (): Promise<LandingStats> => {
        try {
            const [districts, students, suppliers, schools] = await Promise.all([
                apiClient.get<number>("http://localhost:8070/api/client/totalDistrict"),
                apiClient.get<number>("http://localhost:8070/api/client/totalStudent"),
                apiClient.get<number>("http://localhost:8070/api/client/totalSupplier"),
                apiClient.get<number>("http://localhost:8070/api/client/totalSchool"),
            ]);

            return {
                totalDistrict: districts.data,
                totalStudent: students.data,
                totalSupplier: suppliers.data,
                totalSchool: schools.data,
            };
        } catch (error) {
            console.error("Error fetching landing stats:", error); 
            return {
                totalDistrict: 30,
                totalStudent: 1200000,
                totalSupplier: 156,
                totalSchool: 2847,
            };
        }
    },
};
