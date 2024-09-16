import React, { useState, useEffect, useContext } from 'react';
import { useQuery } from "react-query";
import Switch from './Switchers/Switch';
import SwitchService, { SwitchType } from '../services/SwitchService';
import Loader from '../common/Loader';


const Switches: React.FC = () => {

  const [switches, setSwitches] = useState<SwitchType[]>();

  // get all Switches
  const {
    isLoading: switchIsLoading,
    isError: switchIsError,
    error: switchError,
    refetch: getAllSwitches,
  } = useQuery(
    "switches",
    async () => {
      return await SwitchService.findAll();
    },
    {
      enabled: true,
      retry: 3,
      onSuccess: (res) => {
        setSwitches(res);
      },
      onError: (err: any) => {
        console.error(err);
      }
    }
  );

  useEffect(() => {
    getAllSwitches();
  }, [])

  return (
    <>
      <div className="container m-auto grid grid-cols-4 grid-rows-1 gap-2">
        {switchIsLoading && <Loader />}
        {switchIsError && <div>{switchError?.message}</div>}
        {!switchIsLoading && !switchIsError && switches?.map((sw, x) => {
          return (
            <div key={x} className="tile flex gap-2 items-center">
              <h2 className="font-medium text-black dark:text-white flex-initial">{sw.name}</h2>
              <div className="flex-initial">
                <Switch relay_id={sw.relay_id} checked={sw.position == 0 ? true : false} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Switches;