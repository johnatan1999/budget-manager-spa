import './styles/globals.css';
import Header from "./components/header/Header";
import { ColorStyles } from './styles/colors';
import { createGlobalStyle } from 'styled-components';
import { useContext, useState } from 'react';
import AppContext from './components/context/AppContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import TransactionPage from './pages/transactions';
import Layout from './pages/layout';
import DashboardPage from './pages/dashboard';
import CategoryPage from './pages/categories';
import StatisticsPage from './pages/statistics';
import Page404 from './pages/404';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const DralaKo = () => {

    const GlobalStyle = createGlobalStyle<Record<string, any>>`
        ${ColorStyles}
    `;

    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    const displayErrorMessage = (message) => {
        setErrorMessage(message);
        setShowErrorMessage(true);
    }

    const displayLoader = (value: boolean) => {
        setShowLoader(value);
    }

    return (
      <React.StrictMode>
        <Provider store={store} >
          <AppContext.Provider value={{ displayErrorMessage: displayErrorMessage, showLoader: displayLoader }} >
              <GlobalStyle/>
              {showErrorMessage && 
              <Alert onClose={()=>setShowErrorMessage(false)} severity="error" >
                <AlertTitle>Error</AlertTitle>
                  {JSON.stringify(errorMessage)}
              </Alert>}
              <Backdrop
                  sx={{ color: '#fff', zIndex: 9000}}
                  open={showLoader}
                  >
                  <CircularProgress color="inherit" />
              </Backdrop>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Layout />}>
                    <Route index path="transactions" element={<TransactionPage/>} />
                    <Route path="statistics" element={<StatisticsPage/>} />
                    <Route path="categories" element={<CategoryPage/>} />
                    <Route path="dashboard" element={<DashboardPage/>} />
                    <Route path="*" element={<Page404 />} />
                  </Route>
                </Routes>
            </BrowserRouter>
              {/* <ErrorDialog open={showErrorMessage} errorMessage={errorMessage} /> */}
          </AppContext.Provider>
        </Provider>
      </React.StrictMode>
    )
}

root.render(<DralaKo/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
