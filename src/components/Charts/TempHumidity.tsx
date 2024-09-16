import React, { useEffect, useState, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import { useQuery } from 'react-query';
import ReactApexChart from 'react-apexcharts';
import SensorService, { TempHumidityState, handleSensorLogResponse } from '../../services/SensorService';

const options: ApexOptions = {
  legend: {
    show: false,
    position: 'top',
    horizontalAlign: 'left',
  },
  colors: ['#3C50E0', '#80CAEE'],
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
  // labels: {
  //   show: false,
  //   position: "top",
  // },
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
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: '#fff',
    strokeColors: ['#3056D3', '#80CAEE'],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
      rotate: -90,
      rotateAlways: true
    },
    style: {
      fontSize: '8px',
    },
    categories: [],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: '0px',
      },
    },
    min: 20,
    max: 30,
  },
};

const requestTempLog = async () => {
  return await SensorService.getTempLog(6);
};


const TempHumidity: React.FC = () => {
  const [state, setState] = useState<TempHumidityState>({
    series: [],
  });

  const [tempDates, setTempDates] = useState(["2000-01-01", "2000-01-02"]);
  const [humidityDates, setHumidityDates] = useState(["2000-01-01", "2000-01-02"]);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: getTempLogData
  } = useQuery('tempLog', requestTempLog, handleSensorLogResponse(setState));

  useEffect(() => {
    getTempLogData();
  }, [])
  useEffect(() => {
    if (data?.data?.length > 0) {
      console.log(data.data[data?.data?.length - 1]?.updatedAt);
    }
    const tempStart = new Date(data.data[0].updatedAt).toISOString().split('T')[1].split('.')[0];
    const tempEnd = new Date(data.data[data?.data?.length - 1].updatedAt).toISOString().split('T')[1].split('.')[0];
    setTempDates([tempStart, tempEnd]);
    setHumidityDates([tempStart, tempEnd]); // since the will be the same
    //setHumidityDates([humidityStart, humidityEnd]);
  }, [data])

  const categories = useMemo(() => {
    return data?.data?.map((series) => {
      const dateLabelDate = new Date(series.updatedAt);
      const hours = ('0' + dateLabelDate.getHours()).slice(-2);
      const minutes = ('0' + dateLabelDate.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    });
  }, [data]);

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
              options={{ ...options, xaxis: { categories } }}
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
