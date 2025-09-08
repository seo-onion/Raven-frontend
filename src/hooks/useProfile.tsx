import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import useAuthStore from "@/stores/AuthStore";

export interface UserProfile {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

const fetchProfile = async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get("/api/auth/profile/");
    return data;
};

export const useProfile = () => {
    const { isLogged } = useAuthStore((state) => ({
        isLogged: state.isLogged,
    }));

    return useQuery({
        queryKey: ["profile"],
        enabled: isLogged,
        queryFn: fetchProfile,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
};
