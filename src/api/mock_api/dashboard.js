import mockRequests from "@/utils/mockRequest";
export const reqDashboardData = () => {
    return mockRequests.get("/dashboard");
};
