import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import SensorService, { handleSensorResponse, SensorType } from '../services/SensorService';
import SystemService, { handleSystemResponse, SystemType } from '../services/SystemService';
import CardDataStatsShort from './CardDataStatsShort';
import { TempIcon, HumidityIcon, CpuIcon, DiskStorageIcon, DefaultIcon } from '../pages/UiElements/Icons';

const SensorStatus: React.FC = () => {

  const cardIcons = {
    TEMPSENSOR: <TempIcon />,
    HUMIDITYSENSOR: <HumidityIcon />,
    CPUTEMPERATURE: <CpuIcon />,
    FILEUSAGE: <DiskStorageIcon />,
    DEFAULT: <DefaultIcon />
  }

  // Temp
  const [temp, setTemp] = useState<SensorType | null>(null);
  const requestTemp = async () => {
    return await SensorService.getTemp();
  };
  const {
    isLoading: isLoadingTemp,
    isError: isErrorTemp,
    error: errorTemp,
    refetch: getTempData
  } = useQuery("sensors", requestTemp, handleSensorResponse(setTemp));

  // Humididty
  const [humidity, setHumidity] = useState<SensorType | null>(null);
  const requestHumidity = async () => {
    return await SensorService.getHumidity();
  };
  const {
    isLoading: isLoadingHumidity,
    isError: isErrorHumidity,
    error: errorHumidity,
    refetch: getHumidityData
  } = useQuery("humidity", requestHumidity, handleSensorResponse(setHumidity));


  // CPU Temp
  const [cpuTemp, setCpuTemp] = useState<SystemType | null>(null);
  const requestCpuTemp = async () => {
    return await SystemService.getCpuTemp();
  };
  const {
    isLoading: isLoadingCpuTemp,
    isError: isErrorCpuTemp,
    error: errorCpuTemp,
    refetch: getCpuTempData
  } = useQuery("cpuTemp", requestCpuTemp, handleSystemResponse(setCpuTemp));

  // Disk Usage
  const [diskUsage, setDiskUsage] = useState<SensorType | null>(null);
  const requestDiskUsage = async () => {
    return await SystemService.getDiskUsage();
  };
  const {
    isLoading: isLoadingDiskUsage,
    isError: isErrorDiskUsage,
    error: errorDiskUsage,
    refetch: getDiskUsageData
  } = useQuery("diskUsage", requestDiskUsage, handleSystemResponse(setDiskUsage));

  useEffect(() => {
    getCpuTempData();
    getDiskUsageData();
    getHumidityData();
    getTempData();
  }, [])

  const strToFloatToStr = (value: string): string => {
    return parseFloat(value).toFixed(2).toString();
  }

  const TempStats = useCallback(() => {
    return (
      <CardDataStatsShort
        title={temp?.name || ''}
        total={strToFloatToStr(temp?.value || '0')}
        rate={'0'}
        key={temp?.id}
        levelDown={false}
        levelUp={true}
      >
        <>{cardIcons[temp?.icon?.toUpperCase() as keyof typeof cardIcons]}</>
      </CardDataStatsShort>
    )
  }, [temp]);

  const HumidityStats = useCallback(() => {
    return (
      <CardDataStatsShort
        title={humidity?.name || ''}
        total={strToFloatToStr(humidity?.value || '0')}
        rate={'0'}
        key={humidity?.id || ''}
        levelDown={false}
        levelUp={true}
      >
        <>{cardIcons[humidity?.icon?.toUpperCase() as keyof typeof cardIcons]}</>
      </CardDataStatsShort>
    );
  }, [humidity]);

  const CpuTempStats = useCallback(() => {
    return (
      <CardDataStatsShort
        title={cpuTemp?.name || ''}
        total={strToFloatToStr(cpuTemp?.value || '0')}
        rate={'0'}
        key={cpuTemp?.id}
        levelDown={false}
        levelUp={true}
      >
        <>{cardIcons[cpuTemp?.icon?.toUpperCase() as keyof typeof cardIcons]}</>
      </CardDataStatsShort>
    )
  }, [cpuTemp]);

  const DiskUsageStats = useCallback(() => {
    return (
      <CardDataStatsShort
        title={diskUsage?.name || ''}
        total={strToFloatToStr(diskUsage?.value || '0')}
        rate={'0'}
        key={diskUsage?.id}
        levelDown={false}
        levelUp={true}
      >

        <>{cardIcons[diskUsage?.icon?.toUpperCase() as keyof typeof cardIcons]}</>
      </CardDataStatsShort>
    )
  }, [diskUsage]);


  const Loading = (<div>Loading...</div>);
  const ErrorFound = (err: any) => (<div>Error: {err?.message} {err?.message}</div>);
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {isLoadingTemp && Loading}
        {isErrorTemp && ErrorFound(errorTemp)}
        {temp && (<TempStats />)}
        {isLoadingHumidity && Loading}
        {isErrorHumidity && ErrorFound(errorHumidity)}
        {humidity && (<HumidityStats />)}
        {isLoadingCpuTemp && Loading}
        {isErrorCpuTemp && ErrorFound(errorCpuTemp)}
        {cpuTemp && (<CpuTempStats />)}
        {isLoadingDiskUsage && Loading}
        {isErrorDiskUsage && ErrorFound(errorDiskUsage)}
        {diskUsage && (<DiskUsageStats />)}
      </div >
    </>
  )
}

export default SensorStatus