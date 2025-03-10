import React, { useState } from 'react';
import NavBar from './components/NavBar';
import "./assets/css/main.css";
import { useMainContext } from './context/MainContext';
import {BASEURL} from './utils';
import FlashMessage from './components/FlashMessage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { use } from 'react';

const ProfileManager = () => {
  const {
    userData,
    setShowForm,
    flashMessage,
    messageType,
    token,
    setUserData,
    setApiCredentials
  } = useMainContext();
  const [credentials, setCredentials] = useState({
    userKey: JSON.parse(localStorage.getItem("userData"))?.Profile?.api_user || '', 
    password: JSON.parse(localStorage.getItem("userData"))?.Profile?.api_password ||''
  });
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
     
  useEffect(() => {
    if (!token){	    
      navigate('/');
      setShowForm(true);
    }
    setUserData(JSON.parse(localStorage.getItem("userData")));
  }, []);
   
                
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  
  const handleProfileForm  = async () => {
    try {
          let res = null;          
          if(userData.Profile!== null) {
            res = await fetch(`${BASEURL}/profiles/${userData.Profile.id}`, {
              method: 'PUT',
              headers : {
                Accept: 'application/json',
                'content-type' : 'application/json',
                'X-Token' : token,
              },
              body : JSON.stringify({
                api_user: credentials.userKey,
                api_password : credentials.password,
              }),
            });

          } else {
              res = await fetch(`${BASEURL}/profiles`, {
              method: 'POST',
              headers : {
                Accept: 'application/json',
                'content-type' : 'application/json',
                'X-Token' : token,
              },
              body : JSON.stringify({
                api_user: credentials.userKey,
                api_password : credentials.password,
              }),
            });
          }
          const data = await res.json();
          
          if(res.ok) { 
            const updatedUserData = {
              ...userData,
              Profile: {
                ...data,
              },
            };
            setUserData(updatedUserData);
            localStorage.setItem("userData" , JSON.stringify(updatedUserData));
            setApiCredentials(data);
            setMessage(userData.Profile ? 'Credentials updated successfully!' : 'Credentials saved successfully!');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
          }else{

              setMessage(data.error);
              setShowMessage(true);
              setTimeout(() => setShowMessage(false), 3000); 
          }
      }catch (err) {
        console.log(err);
        setMessage('Something went wrong please try again!');
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000); 
      }
  };
   

  const handleDelete = async () => {
    try {
      const response = await fetch(`${BASEURL}/profiles/${userData.Profile.id}` ,{
        method : "DELETE",
        headers : {
          Accept: 'application/json',
          'content-type' : 'application/json',
          'X-Token' : token
        }
      });
      const data = response.json();
      if(!response.ok){
       setMessage("somthing went wrong");
       setShowMessage(true);
       setTimeout(() => setShowMessage(false) , 3000);
       return;
      }
      const updatedData = {
        ...userData , 
        Profile : null
      }
      setUserData(updatedData);
      localStorage.removeItem('userDta');
      localStorage.setItem("userData" , JSON.stringify(updatedData));
      setCredentials({
        userKey: '',
        password: ''
      });
      setApiCredentials({
        userKey :'',
        password : ''
      })
      setMessage('Credentials deleted successfully!');
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000); 
     
    } catch (error) {
      setMessage("error" , error);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }

  };

  return (
    <div className="h-screen bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 \
    transition-width duration-500 ease-in-out bg-gradient-to-l from-custom-blue \
    to-custom-dark bg-[length:200%_100%] animate-gradient-x">

      <NavBar />
      {flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : ''}
      <div className="max-w-6xl mx-auto mt-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - User Data Display */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-blue-600">User Information</h2>
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{userData?.name}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                {/* <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Last Login</p>
                  <p className="font-medium">{userData.lastLogin}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium">{userData.accountType}</p>
                  </div> */}
                  {/* <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-block px-2 py-1 text-sm font-medium text-green-700 bg-green-100 rounded">
                      {userData.status}
                    </span>
                  </div> */}
              </div>
            </div>
          </div>

          {/* Right Side - Credential Manager */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-6 text-blue-600">Credential Manager</h2>
              
              {showMessage && (
                <div className={`p-3 mb-4 rounded ${
                  message.includes('successfully') 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label 
                    htmlFor="userKey" 
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    User Key
                  </label>
                  <input
                    id="userKey"
                    name="userKey"
                    type="text"
                    value={credentials.userKey}
                    onChange={handleInputChange}
                    placeholder="Enter user key"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="passwordKey" 
                    className="block text-sm font-medium mb-2 text-gray-700"
                  >
                    Password Key
                  </label>
                  <input
                    id="passwordKey"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter password key"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => handleDelete() }
                    className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    Delete
                  </button>
                  
                  <button
                    onClick={handleProfileForm}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="area w-screen z-[-1] h-screen opacity-0.5" >
                <ul className="circles z-0">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>
            </div >
    </div>
  );
};

export default ProfileManager;
