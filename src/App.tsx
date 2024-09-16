import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { ReactQueryDevtools } from 'react-query/devtools'
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Promotion from './pages/Promotion';
import DefaultLayout from './layout/DefaultLayout';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (

    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard | Plant Machine" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Pi Quadic | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Promotion />
            </>
          }
        />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </DefaultLayout>
  );
}

export default App;
