import React, { useEffect, useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import { isError, useQuery } from 'react-query';
import ReactApexChart from 'react-apexcharts';
import SensorService, { TempHumidityState } from '../../services/SensorService';

const TEMPIDX = 0;
const HUMIDX = 1;

const formatFixed = (value: string) => parseFloat(value).toFixed(0);
const formatDate = (value: string, ts: number) => {
  //return new Date(parseInt(ts))
  const dt = new Date(ts);
  return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`
}
const options: ApexOptions = {
  legend: {
    show: false,
  },
  colors: ['#80CAEE', '#3C50E0'],
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    height: 335,
    type: 'area',
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  /*
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  */
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 3,
    colors: '#fff',
    strokeColors: ['#80CAEE', '#3056D3'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 4,
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      show: true,
      //datetimeUTC: false,
      //format: 'HH:mm',
      formatter: formatDate,
      rotate: -45,
      rotateAlways: true,
      hideOverlappingLabels: true,
    },
    // categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: [
    {
      seriesName: "ambient temperature",
      axisTicks: {
        show: true,
      },
      min: 10,
      //max: 35,
      title: {
        text: "Temperature (°C)",
      },
      labels: {
        formatter: (val) => formatFixed(val),
      },
    },
    {
      seriesName: "ambient humidity",
      opposite: true,
      min: 10,
      //max: 80,
      title: {
        text: "Humidity (%)",
      },
      labels: {
        formatter: (val) => formatFixed(val),
      }
    }
  ]
};

const requestTempLog = async () => {
  return await SensorService.getHumidityLog(6);
};
const requestHumidityLog = async () => {
  return await SensorService.getTempLog(6);
};


const TempHumidity: React.FC = () => {
  const [state, setState] = useState<TempHumidityState>({
    series: [],
  });

  const [tempDates, setTempDates] = useState(["2000-01-01", "2000-01-02"]);
  const [humidityDates, setHumidityDates] = useState(["2000-01-01", "2000-01-02"]);

  const {
    data: humidityData,
    isLoading: isLoadingHumidity,
    isError: isErrorHumidity,
    error: errorHumidity,
    refetch: getHumidityLogData
  } = useQuery('humidityLog', requestHumidityLog);

  const {
    data: tempData,
    isLoading: isLoadingTemp,
    isError: isErrorTemp,
    error: errorTemp,
    refetch: getTempLogData
  } = useQuery('tempLog', requestTempLog);

  const isLoading = isLoadingTemp && isLoadingHumidity;
  const isError = isErrorTemp && isErrorHumidity;
  const error = errorTemp || errorHumidity;

  useEffect(() => {
    // getHumidityLogData();
    // getTempLogData();
  }, [])

  useEffect(() => {
    if (tempData && tempData?.data?.length > 0) {
      console.log(tempData);
      const tempStart = new Date(tempData.data[0].updatedAt)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      const tempEnd = new Date(tempData.data[tempData.data.length - 1].updatedAt)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      setTempDates([tempStart, tempEnd]);
      const tempSeries = tempData.data.map((series) => [new Date(series.updatedAt).getTime(), parseFloat(series.value).toFixed(2)]);
      console.log(tempSeries);
      setState((prev) => {
        prev.series[TEMPIDX] = { id: tempData.id, name: tempData.name, data: tempSeries }
        return prev;
      });
    }
  }, [tempData])

  useEffect(() => {
    if (humidityData && humidityData?.data?.length > 0) {
      const humidityStart = new Date(humidityData.data[0].updatedAt)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      const humidityEnd = new Date(humidityData.data[humidityData?.data?.length - 1].updatedAt)
        .toISOString()
        .split('T')[1]
        .split('.')[0];
      setHumidityDates([humidityStart, humidityEnd]);
      const humiditySeries = humidityData.data.map((series) => [new Date(series.updatedAt).getTime(), parseFloat(series.value).toFixed(2)]);
      setState((prev) => {
        if (humidityData?.id) {
          prev.series[HUMIDX] = { id: humidityData.id, name: humidityData.name, data: humiditySeries }
          return prev;
        }
      });
    }
  }, [humidityData])

  // use temperature to calculate labels
  const categories = useMemo(() => {
    return tempData?.data?.map((series) => {
      const dateLabelDate = new Date(series.updatedAt);
      const hours = ('0' + dateLabelDate.getHours()).slice(-2);
      const minutes = ('0' + dateLabelDate.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    });
  }, [tempData]);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Temperature</p>
              <p className="text-xs font-medium">{tempDates.join(" - ")}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Humidity</p>
              <p className="text-xs font-medium">{humidityDates.join(" - ")}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button className="rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark">
              Day
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Week
            </button>
            <button className="rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error...</div>}
          {!isLoading && !isError && (
            <ReactApexChart
              options={{ ...options }}
              series={state.series}
              type="area"
              height={350}
            />)}
        </div>
      </div>
    </div>
  );
};

export default TempHumidity;
