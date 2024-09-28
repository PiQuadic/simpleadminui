import axios from "axios";
import { apiUrl } from '../common/constants';
import { ApexOptions } from 'apexcharts';

const apiClient = axios.create({
  baseURL: `${apiUrl}/sensors`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface SensorType {
  id: string;
  system_id: string;
  name: string;
  value: string;
  icon?: string;
  dt: Date;
}

interface LogType {
  value: string;
  updatedAt: string;
}
export interface SensorLogType {
  id: string;
  name: string;
  data: LogType[];
}


export interface TempHumidityState {
  options: ApexOptions;
  series: {
    id: string;
    name: string;
    data: number[];
  }[];
}

export interface SensorResponse {
  enabled: boolean;
  retry: number;
  onSuccess: (res: SensorType) => SensorType | null;
  onError: (err: any) => void;
}

const getTemp = async () => {
  // TODO: fix last value on api maybe add a status label
  const hours = 0; // zero returns latest 
  const response = await apiClient.get<SensorType>(`/tempsensor/${hours}`);
  return response.data;
}

const getTempLog = async (hours = 1) => {
  // TODO: fix last value on api maybe add a status label
  const response = await apiClient.get<SensorLogType>(`/tempsensor/${hours}`);
  return response.data;
}

const getHumidity = async () => {
  // TODO: fix last value on api maybe add a status label
  const hours = 0; // zero returns latest 
  const response = await apiClient.get<SensorType>(`/humiditysensor/${hours}`);
  return response.data;
}

const getHumidityLog = async (hours = 1) => {
  // TODO: fix last value on api maybe add a status label
  const response = await apiClient.get<SensorLogType>(`/humiditysensor/${hours}`);
  return response.data;
}

const SensorService = { getTempLog, getTemp, getHumidity, getHumidityLog };

export default SensorService;