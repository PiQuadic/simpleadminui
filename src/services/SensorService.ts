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


export const handleSensorResponse = (setFunction: (val: SensorType | null) => void) => {
  return {
    enabled: true,
    retry: 3,
    onSuccess: (res: SensorType) => {
      const data: SensorType = {
        id: res.id.toString(),
        name: res.name.toString(),
        value: parseFloat(res.value).toFixed(2),
        icon: res.id ? res.id.toString().toUpperCase() : 'DEFAULT',
        dt: res.dt,
      }
      if (data?.value) setFunction(data);
    },
    onError: (err: any) => {
      console.error(err);
    }
  }
}

export const handleSensorLogResponse = (setFunction: (val: TempHumidityState[] | null) => void) => {
  return {
    enabled: true,
    retry: 3,
    onSuccess: (res: SensorLogType) => {
      const name: string = res.name;
      const data: string[] = res?.data?.map((item: LogType) => {
        return parseFloat(item.value).toFixed(2);
      });
      const series = [{
        id: res.id,
        name: name,
        data: data,
      }];
      const seriesData: TempHumidityState = { series };
      const seriesMap = new Map<string, TempHumidityState>();
      seriesMap.set(name, seriesData);
      if (seriesMap?.size > 0) {
        setFunction((prev: TempHumidityState) => (
          { ...prev, ...seriesData }
        ));
      }
    },
    onError: (err: any) => {
      console.error(err);
    }
  }
};


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

const SensorService = { getTempLog, getTemp, getHumidity, getHumidityLog, handleSensorResponse };

export default SensorService;