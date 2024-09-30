import React, { useEffect, useState, useRef, useMemo } from 'react';
import { ApexOptions } from 'apexcharts';
import { isError, useQuery } from 'react-query';
import ReactApexChart from 'react-apexcharts';
import SensorService, { TempHumidityState } from '../../services/SensorService';

const TEMPIDX = 0;
const HUMIDX = 1;
const chartId = 'temphumdity';
const offset = 1;

const formatFixed = (val: number, opts: any) => {
  return parseFloat(val.toString()).toFixed(2).toString();;
}
const formatStringFixed = (val: string) => {
  return parseFloat(parseFloat(val).toFixed(2).toString());
}

const formatDate = (val: string, ts: number) => {
  const dt = new Date(ts);
  return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`
}

const colorsConfig = [];
colorsConfig[TEMPIDX] = '#80CAEE';
colorsConfig[HUMIDX] = '#3C50E0';
const options: ApexOptions = {
  chart: {
    id: chartId,
    dropShadow: {
      enabled: true,
      color: '#623CEA14',
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },
    //fontFamily: 'Satoshi, sans-serif',
    height: 335,
    stacked: false,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: colorsConfig,
  dataLabels: {
    enabled: false,
  },
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
  legend: {
    show: false,
  },
  markers: {
    size: 3,
    colors: '#fff',
    strokeColors: colorsConfig,
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
  noData: {
    text: 'Loading...',
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
  series: [],
  stroke: {
    width: [2, 2],
    curve: 'straight',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      formatter: formatDate,
      hideOverlappingLabels: true,
      rotate: -45,
      rotateAlways: true,
      show: true,
      style: {
        fontFamily: "New Courier, Courier, monospace",
      }
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: [
    {
      axisTicks: {
        show: true,
      },
      labels: {
        formatter: formatFixed,
        style: {
          fontFamily: "New Courier, Courier, monospace",
        },
      },
      min: 0,
      max: 50,
      opposite: true,
      seriesName: "ambient temperature",
      title: {
        text: "Temperature (°C)",
      },
    },
    {
      labels: {
        formatter: formatFixed,
      },
      min: 0,
      max: 100,
      seriesName: "ambient humidity",
      title: {
        text: "Humidity (%)",
      },
    }
  ]
};

const convertDates = (date: Date) => {
  return date.toLocaleTimeString();
}

const logPeriod = (h: number) => {
  return h * 60 / 5 * -1;
}

const TempHumidity: React.FC = () => {

  const [hours, setHours] = useState(6);

  const requestTempLog = async () => {
    return await SensorService.getTempLog(hours);
  };
  const requestHumidityLog = async () => {
    return await SensorService.getHumidityLog(hours);
  };
  const chartRef = useRef<ReactApexChart>(null);
  const [dataState, setDataState] = useState<TempHumidityState>({
    series: [{ id: '', name: '', data: [] }, { id: '', name: '', data: [] }],
    options: options,
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

  const minTemp = useMemo(() => {
    const min = (tempData?.data && Math.min(...tempData.data.map((x) => formatStringFixed(x.value)))) || 10;
    return min - offset;
  }, [tempData]);

  const maxTemp = useMemo(() => {
    const max = (tempData?.data && Math.max(...tempData.data.map((x) => formatStringFixed(x.value)))) || 35;
    return max + offset;;
  }, [tempData]);

  const minHum = useMemo(() => {
    const min = (humidityData?.data && Math.min(...humidityData.data.map((x) => formatStringFixed(x.value)))) || 10;
    return min - offset;
  }, [humidityData]);

  const maxHum = useMemo(() => {
    const max = (humidityData?.data && Math.max(...humidityData.data.map((x) => formatStringFixed(x.value)))) || 85;
    return max + offset;
  }, [humidityData]);

  useEffect(() => {
    let tempSeries: any;
    let humiditySeries: any;

    if ((humidityData && humidityData?.data?.length > 0) && (tempData && tempData?.data?.length > 0)) {
      const tempStart = convertDates(new Date(tempData.data[0].updatedAt));
      const tempEnd = convertDates(new Date(tempData.data[tempData.data.length - 1].updatedAt));
      setTempDates([tempStart, tempEnd]);
      tempSeries = tempData.data.map((series) => [new Date(series.updatedAt).getTime(), parseFloat(series.value).toFixed(2)]);

      const humidityStart = convertDates(new Date(humidityData.data[0].updatedAt));
      const humidityEnd = convertDates(new Date(humidityData.data[humidityData?.data?.length - 1].updatedAt));
      setHumidityDates([humidityStart, humidityEnd]);
      humiditySeries = humidityData.data.map((series) => [new Date(series.updatedAt).getTime(), parseFloat(series.value).toFixed(2)]);

      setDataState((prev) => {
        if (prev?.options?.yaxis) {
          prev.options.yaxis[TEMPIDX]["min"] = minTemp;
          prev.options.yaxis[TEMPIDX]["max"] = maxTemp;
          prev.options.yaxis[HUMIDX]["min"] = minHum;
          prev.options.yaxis[HUMIDX]["max"] = maxHum;
        }
        if (tempData?.id && humidityData?.id) {
          prev.series[TEMPIDX] = { id: tempData.id, name: tempData.name, data: tempSeries.slice(logPeriod(hours)) }
          prev.series[HUMIDX] = { id: humidityData.id, name: humidityData.name, data: humiditySeries.slice(logPeriod(hours)) }
        }
        return { ...prev };
      });
    }
  }, [humidityData, tempData, maxHum, minHum, maxTemp, minTemp, hours]);

  useEffect(() => {
    if (chartRef.current && dataState.series[TEMPIDX]["data"].length > 0 && dataState.series[HUMIDX]["data"].length > 0) {
      ApexCharts.exec(chartId, 'updateOptions', { ...dataState.options, series: dataState.series }, false, true);
    }
  }, [dataState])

  const handleClick = (hrs: number) => {
    setHours(() => hrs);
  }
  const buttonDefaultClass = 'rounded py-1 px-3 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark';
  const activeCard = 'rounded bg-white py-1 px-3 text-xs font-medium text-black shadow-card hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark';

  return (
    <div className="col-span-full rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Temperature</p>
              <p className="text-xs font-medium">{tempDates.join(" - ")}</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mt-1 mr-2 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Humidity</p>
              <p className="text-xs font-medium">{humidityDates.join(" - ")}</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">

            <button onClick={() => handleClick(2)} className={(hours === 2) ? activeCard : buttonDefaultClass}>
              2 hrs
            </button>
            <button onClick={() => handleClick(6)} className={(hours === 6) ? activeCard : buttonDefaultClass}>
              12 hrs
            </button>
            <button onClick={() => handleClick(24)} className={(hours === 24) ? activeCard : buttonDefaultClass}>
              24 hrs
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
              options={dataState.options}
              series={dataState.series}
              type="area"
              height={350}
              ref={chartRef}
            />
          )}
        </div>
      </div>
    </div >
  );
};

export default TempHumidity;
