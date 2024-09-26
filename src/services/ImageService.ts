import axios from "axios";
import { apiUrl } from '../common/constants';
import { ApexOptions } from 'apexcharts';

const apiClient = axios.create({
  baseURL: `${apiUrl}/images`,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface ImageType {
  id: string;
  camera_id: string;
  uri: string;
  width: number;
  height: number;
  dt: Date;
  updatedAt: Date;
}

export const handleImageResponse = (setFunction: (val: ImageType | null) => void) => {
  return {
    enabled: true,
    retry: 3,
    onSuccess: (res: ImageType) => {
      const data: ImageType = {
        id: res.id.toString(),
        camera_id: res.camera_id.toString(),
        uri: res.uri.toString(),
        width: res.width,
        height: res.height,
        dt: res.dt,
        updatedAt: res.updatedAt,
      }
      if (data?.id) setFunction(data);
    },
    onError: (err: any) => {
      console.error(err);
    }
  }
}

export const getNewest = async (camer_id: string) => {
  const response = await apiClient.get<ImageType>(`/newest/${camer_id}`);
  return response.data;
}

const ImageService = { getNewest, handleImageResponse };

export default ImageService;