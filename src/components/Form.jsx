import { useEffect, useState } from 'react';
import FlashMessage from './FlashMessage';
import { useMainContext } from '../context/MainContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { BASEURL } from '../utils';
import { getStorageItem } from '../utils';
const STATES = ['login', 'forgotPassword', 'signUp', 'resetPassword'];



const formInputs = {
    'signUp' : [
        {
            label: 'Your name',
            name: 'name',
            type : 'text',
        },
         {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
        {
            label: 'Phone NUmber',
            name: 'phoneNumber',
            type : 'text',
        },
        {
            label: 'password',
            name : 'password',
            type : 'password',
        },

    ],
    'login' : [
        {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
        {
            label: 'password',
            name : 'password',
            type : 'password',
        }
    ],
    'forgotPassword' : [
        {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
    ],
    'resetPassword' : [
        {
            label: 'password',
            name : 'password',
            type : 'password',
        },
        {
            label: 'Confirmation',
            name : 'confirmation',
            type : 'password',
        }
    ]
};

const formText = {
    signUp : {
         title: 'Create your account',
        subTitle: '',
        button: 'Sign Up',
    },
    login: {
        title: 'Welcome back',
        subTitle: 'Sign in to your account',
        button: 'Sign in',
    },
    forgotPassword: {
        title: 'Forgot your password?',
        subTitle: 'Enter your email address to reset your password.',
        button: 'Send reset link',
    },
    resetPassword: {
        title: 'Reset your password',
        subTitle: 'Enter your new password below.',
        button: 'Reset Password',
    }
};

const Form = ({myState = 'login'}) => {
    const navigate = useNavigate();
    const {
      flashMessage,
      setFlashMessage,
      messageType,
      setMessageType,
      setShowForm,
      showForm,
      setApiCredentials,
      setInProcess,
      setToken,
      token,
      inProcess,
      userData,
      setUserData,
      state,
      setStates
    } = useMainContext();
    const [errors, setErrors] = useState({});
    const [error, setError] = useState([]);
    const url = useLocation(); 
    const queryParameters = new URLSearchParams(url.search);

    useEffect(() => {
        if (queryParameters.get('id')&& queryParameters.get('token')) {
            setStates(STATES[3]);
        }
    },[url.search]);

    const handleLogin = async () => {
        setInProcess(true);
        const encodedData = btoa(`${userData.email}:${userData.password}`);
        try {
            const res = await fetch(`${BASEURL}/login`, {
                method : 'POST',
                headers : {
                    Accept : 'application/json',
                    Authorization : `Basic ${encodedData}`
                },
            })
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', JSON.stringify(data.token));
                localStorage.setItem('userData', JSON.stringify(data.userData));
                setToken(getStorageItem('token'));
                setUserData(getStorageItem('userData'));
                setApiCredentials(getStorageItem('userData').Profile || {
                    api_user: "",
                    password: ""
                });
                setFlashMessage(`Welcome ${data?.userData?.name}`);
                setMessageType('success');
                setShowForm(false);
                setError('');
                setErrors({});
            }else{
                if(data.errors && Object.entries(data.errors).length > 0) {
                    setErrors(data.errors);
                    setError('')
                }else {
                    setError(data.error);
                }
            }
            setInProcess(false);
        }catch (err){
            console.log(err);
            setFlashMessage('Something went wrong !!!');
            setMessageType('error');
            setInProcess(false);
        }
    }
  

    const handleForm = async (e) => {
        e.preventDefault();
        setInProcess(true);
        switch (state) {
            case STATES[0]:
                    await handleLogin(e);
                break;
            case STATES[1]:
                    await handleForgotPassword(e);
                break;
            case STATES[2]:
                    await handleCreateAccount(e);
                break;
            case STATES[3]:
                    await handleResetPassword(e);
                break;
        }
    }

    const handleForgotPassword = async (e) => {
        const email = userData.email
        const errors = {
            email : ''
        }
        try {
            const res = await fetch(`${BASEURL}/forgotPassword`, {
                method : 'POST',
                headers : { 
                    Accept : "application/json",
                    "Content-Type": "application/json", 
                },
                body : JSON.stringify({email}),
            });
            const data = await res.json();
            if (res.ok) {
                setFlashMessage(data?.message);
                setStates(STATES[0]);
                setMessageType('success');
                setErrors({});
            }else{
                errors.email = [data.error];
                setErrors(errors);
            }
            setInProcess(false);
        }catch (err) {
            console.log(err);
        }
    }

    const handleCreateAccount =  async (e) => {
        setInProcess(true);
        try {
            const res = await fetch(`${BASEURL}/signUp`, {
                method : 'POST',
                headers : { 
                    Accept : "application/json",
                    "Content-Type": "application/json", 
                },
                body : JSON.stringify({...userData}),
            });
            const data = await res.json(); 
            if (res.ok) {
                setFlashMessage('Your account has been created');
                setMessageType('success')
                setStates('login');
                setErrors({});
                setError('');
            }else{
                if(Object.entries(data.errors).length === 1) {
                    const key  = Object.keys(data.errors);
                    setError(data.errors[key][0]);
                    setErrors(data.errors);
                }else {
                    setErrors(data.errors);
                }
            }
            setInProcess(false);
        }catch (err) {
            console.log(err);
            setFlashMessage('Something went wrong !!!');
            setMessageType('error');
            setInProcess(false);
        }
    } 


    const handleResetPassword = async (e) => {
        const resetToken = queryParameters.get('token');
        const id = queryParameters.get('id');
        const password = userData.password;
        const confirmation = userData.confirmation;

        if(password !== confirmation) {
            setError('password must match the confirmation');
            setInProcess(false);
        }else{
            try {
                setInProcess(true);
                const res = await fetch(`${BASEURL}/resetPassword`, {
                    method : 'PUT',
                    headers : { 
                        Accept : "application/json",
                        "Content-Type": "application/json", 
                    },
                    body : JSON.stringify({password, id, resetToken}),
                });
                const data = await res.json();
                if (res.ok) {
                    navigate('/');
                    setUserData({});
                    setFlashMessage(data.message);
                    setMessageType('success');
                    setShowForm(false);
                    setStates(STATES[0]);
                }else{
                    setErrors(data.errors || {});
                    setError(data.error);
                }
                setInProcess(false);
            }catch (err) {
                console.log(err);
            }
        }

    }

    const inputClass = `appearance-none rounded-xl relative block w-full 
        pl-12 pr-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        focus:z-10 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`

    // Calculate additional height based on errors
    const hasErrors = Object.keys(errors)?.length > 0 || error;
    const formContainerClass = `lg:w-2/6 sm:w-1/2 md:w-1/2 m-auto bg-white/90 backdrop-blur-md 
        py-12 px-8 rounded-2xl relative shadow-xl transition-all duration-300 ease-in-out 
        ${hasErrors ? 'max-h-[120vh]' : 'max-h-[90vh]'}`

return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 mb-3 min-h-screen py-10 overflow-y-scroll	">
        <div className='cursor-pointer lg:ml-20 sm:mb-5 text-white font-bold hover:text-blue-400 transition-colors duration-200' 
             onClick={() => {
                navigate('/');
                setShowForm(false);
             }}>
            <i className='fa-solid fa-arrow-left mr-2'></i> Back
        </div>
        <div className={formContainerClass}>
            {error && (
                <div className="bg-[size:200%_100%] animate-gradient-x">
                <p className="text-red-500 text-center text-sm mt-1 ml-1 transition-all duration-300">
                    {error}
                </p>
                </div>
            )}
            {flashMessage && state == STATES[1]  || flashMessage && state == STATES[2] ?
                <FlashMessage message={flashMessage} type={messageType}/>
                : ''}
            <div className={`max-w-md w-full mx-auto space-y-6 ${hasErrors ? 'mt-4' : ''}`}>
                <h2 className="mt-2 text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {formText[state]?.title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {formText[state]?.subTitle}
                </p>
            </div>

            <form className={`mt-8 space-y-6 mb-5 transition-all duration-300 
                            ${hasErrors ? 'space-y-7' : 'space-y-6'}`} 
                  onSubmit={handleForm}>
                <div className="rounded-md space-y-5">
                    {formInputs[state].map((f, index) => (
                        <div key={index} className="relative group">
                            <label htmlFor="email" className="sr-only">{f.label}</label>
                            <i className="fas fa-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                                      group-focus-within:text-blue-500 transition-colors duration-200"></i>
                            <input
                                type={f.type}
                                name={f.name}
                                id={f.name}
                                className={
                                    Object.entries(errors || {}).length > 0 && errors[f.name]?.length > 0 
                                    ? `${inputClass} border-red-300 bg-red-50 text-red-900 placeholder-red-400`
                                    : inputClass
                                }
                                placeholder={f.label}
                                disabled={inProcess}
                                onChange={ (e) => {
                                    setUserData((prev) => (
                                        {
                                          ...prev,
                                          [f.name] : e.target.value
                                        }))
                                    }
                                }
                                onClick={() => setErrors({})}
                            />
                            {errors[f.name] && (
                                <p className="text-red-500 text-xs mt-1 ml-1 transition-all duration-300">
                                    {errors[f.name][0]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    {state === 'login' && (
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>
                    )}
                    <div className="text-sm" onClick={() => {
                        setErrors({});
                        setStates(STATES[1]);
                    }}>
                        <a className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                            {state !== STATES[1] || state !== STATES[3] ? 'Forgot your password?' : ''}
                        </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
                                 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-800 
                                 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 
                                 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 
                                 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={inProcess}
                    >
                        {formText[state]?.button}
                        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
                    </button>

                    {state !== STATES[3] && (
                        <div className="text-sm mt-4 text-center" onClick={() => {
                            setErrors({});
                            setStates(state === STATES[0] ? 'signUp' : STATES[0]);
                        }}>
                            <a className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                                {state !== 'signUp' ? 'Sign Up' : 'Sign In'}
                            </a>
                        </div>
                    )}
                </div>
            </form>
        </div>
    </div>
    );
};


export default Form;
