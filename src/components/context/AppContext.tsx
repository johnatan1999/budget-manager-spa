import React, { useContext, useState } from 'react';

export interface AppContextInterface {
    categories?: any[];
    currency?: string;
    transactions?: [];
    displayErrorMessage?: Function;
    showLoader?: Function;
}

const AppContext = React.createContext<AppContextInterface>(undefined);

export default AppContext;