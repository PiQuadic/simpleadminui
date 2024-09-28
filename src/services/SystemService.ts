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

const getCpuTemp = async () => {
  const hours = 0; // 0 hours returns latest
  const response = await apiClient.get<SystemType>(`/cpuTemperature/${hours}`);
  return response.data;
}

const getCpuTempLog = async () => {
  const hours = 24; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/cpuTemperature/${hours}`);
  return response.data;
}

const getDiskUsage = async () => {
  const hours = 0; // 0 hours returns latest
  const response = await apiClient.get<SystemType>(`/fileUsage/${hours}`);
  return response.data;
}

const getDiskUsageLog = async () => {
  const hours = 24; // 0 hours returns latest
  const response = await apiClient.get<SystemType[]>(`/fileUsage/${hours}`);
  return response.data;
}
const SystemService = { getCpuTemp, getCpuTempLog, getDiskUsage, getDiskUsageLog };

export default SystemService;