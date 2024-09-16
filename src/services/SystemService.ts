import axios from "axios";
import { apiUrl } from '../common/constants';

const apiClient = axios.create({
  baseURL: `${apiUrl}/system`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SystemType {
  id: string;
  name: string;
  value: string;
  system_id?: string;
  icon?: string;
  dt: Date;
};

export const handleSystemResponse = (setFunction: (val: SystemType | null) => void) => {
  return {
    enabled: true,
    retry: 3,
    onSuccess: (res: SystemType) => {
      const data: SystemType = {
        id: res?.id.toString(),
        name: res.name.toString(),
        icon: res.system_id ? res.system_id.toString().toUpperCase() : 'DEFAULT',
        value: res.value,
        dt: res.dt,
      }
      if (data?.value) setFunction(data);
    },
    onError: (err: any) => {
      console.error(err);
    }
  }
}

const getCpuTemp = async () => {
  const hours = 0; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/cpuTemperature/${hours}`);
  return response.data;
}

const getCpuTempLog = async () => {
  const hours = 24; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/cpuTemperature/${hours}`);
  return response.data;
}

const getDiskUsage = async () => {
  const hours = 0; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/fileUsage/${hours}`);
  return response.data;
}

const getDiskUsageLog = async () => {
  const hours = 24; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/fileUsage/${hours}`);
  return response.data;
}
const SystemService = { getCpuTemp, getCpuTempLog, getDiskUsage, getDiskUsageLog };

export default SystemService;