import { createContext, useContext, useState, useRef } from 'react';
import { getStorageItem } from '../utils';
import { useEffect } from 'react';

const MainContext = createContext();

export const useMainContext = () => {
  return useContext(MainContext);
};

export const MainContextProvider = ({ children }) => {
  const [keywords, setKeywords] = useState([""]);
  const [showForm, setShowForm] = useState(false);
  const [token, setToken] = useState(getStorageItem('token') || null);
  const [inProcess, setInProcess] = useState(false);
  const [apiCredentials, setApiCredentials] = useState(() => {
    const userInfo = getStorageItem('userData');
    if (!userInfo && !userInfo?.Profile) {
      return {
        api_user: "",
        api_password: ""
      };
    }
    return userInfo.Profile;
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [flashMessage, setFlashMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [results, setResults] = useState([]);
  const [stopSave, setStopSave] = useState(false);
  const [locations, setLocations] = useState([]);
  const [save, setSave] = useState([]);
  const [state, setStates] = useState("login");
  const [project, setProject] = useState({
    name: '',
    description: '',
    url: "",
    locationCode: 2250,
    selectedLanguage: "French",
    selectedCountry: "France"
  });
  const [csvResults , setCsvResults] = useState([]);

  const [userData, setUserData] = useState({
    id : getStorageItem("userData")?.id || "NN",
    name: '' || getStorageItem('userData')?.name,
    email: '' || getStorageItem('userData')?.email,
    password: '',
    phoneNumber: '',
    Profile: getStorageItem('userData')?.Profile,
  });
  
   useEffect(()=> {
    setToken(getStorageItem('token'))
    setUserData({
    id : getStorageItem("userData")?.id || "NN",
    name: '' || getStorageItem('userData')?.name,
    email: '' || getStorageItem('userData')?.email,
    password: '',
    phoneNumber: '',
    Profile: getStorageItem('userData')?.Profile,
    })
   },[])




  const value = {
    csvResults,
    setCsvResults,
    keywords,
    setKeywords,
    state,
    setStates,
    setShowForm,
    showForm,
    locations,
    setLocations,
    token,
    setToken,
    inProcess,
    setInProcess,
    showProjectForm,
    setShowProjectForm,
    flashMessage,
    setFlashMessage,
    messageType,
    setMessageType,
    project,
    setProject,
    results,
    setResults,
    save,
    setSave,
    setUserData,
    userData,
    setStopSave,
    stopSave,
    setApiCredentials,
    apiCredentials
  };
  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
}
