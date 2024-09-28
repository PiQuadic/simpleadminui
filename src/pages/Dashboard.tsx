import React, { useState, useContext } from 'react';
import { useQuery } from 'react-query';
import { CameraIcon } from './UiElements/Icons';
import Switches from '../components/Switches';
import TempHumidity from '../components/Charts/TempHumidity';
import ImageService, { ImageType } from '../services/ImageService';

const cameraId = 'camera1';
const getNewestImage = async () => {
  return await ImageService.getNewest(cameraId);
};

const Dashboard: React.FC = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery('newestImage', getNewestImage);

  //const imgUrl = new URL('../../public/images/camera1/12310.jpg', import.meta.url).href
  let imgUrl = new URL('../../public/images/camera1/12310.jpg', import.meta.url).href;

  if (!isLoading && !isError) {
    const dynamicUrl = `../../public/${data?.uri}`;
    imgUrl = new URL(dynamicUrl, import.meta.url).href;
  }

  return (
    <div>
      <div className="mt-4 grid grid-cols-12 gap-8 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-10">
        <div className="col-span-full rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <Switches />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-8 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-10">
        <TempHumidity />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-8 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-10">
        <div className="col-span-full rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="col-span-12 xl:col-span-8">
            <div className="flex flex-row px-4 gap-20 text-center lg:pb-8 xl:pb-11.5">
              <div className="relative display-block mx-auto min-w-fit rounded-full bg-white/20 backdrop-blur">
                <div className="relative drop-shadow-2">
                  <img src={imgUrl} alt="camera1" />
                  <label
                    htmlFor="camera1"
                    className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
                  >
                    <CameraIcon />
                    <input
                      name="camera1"
                      id="camera1"
                      className="sr-only"
                      onClick={() => { console.log("camera1 button clicked") }}
                    />
                  </label>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                  Pepper Plants
                </h3>
                <p className="font-medium">Red, Yellow, Green</p>
                <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                    <span className="font-semibold text-black dark:text-white">
                      259
                    </span>
                    <span className="text-sm">Days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                    <span className="font-semibold text-black dark:text-white">
                      64
                    </span>
                    <span className="text-sm">Seeds</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                    <span className="font-semibold text-black dark:text-white">
                      2
                    </span>
                    <span className="text-sm">Failed</span>
                  </div>
                </div>

                <div className="mx-auto max-w-180">
                  <h4 className="font-semibold text-black dark:text-white">
                    Hydroponic Grow
                  </h4>
                  <div className="mt-4.5">
                    <h3 className="font-semibold">Started on 2024-06-24</h3>
                    <p>Lost 2 to mold and continue periodic h2o2 treatments to contain further outbreaks. Estimate 10 days until transplant.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
