import axiosInstance from './axiosInstance';
import type { RoundCreateDTO } from '@/types/campaigns';

export const createRound = async (data: RoundCreateDTO) => {
    const response = await axiosInstance.post('/api/users/startup/rounds/', data);
    return response.data;
};

import type { RoundNestedUpdateDTO } from '@/types/campaigns';

export const updateRound = async (id: number, data: RoundNestedUpdateDTO) => {
    const response = await axiosInstance.patch(`/api/users/startup/rounds/${id}/`, data);
    return response.data;
};
