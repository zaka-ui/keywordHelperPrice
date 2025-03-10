import './assets/css/main.css';
import Form from './components/Form';
import ProjectForm from './components/ProjectForm';
import NavBar from './components/NavBar';
import { useMainContext } from './context/MainContext';
import FeatureSection from './components/FeatureSection';
import Footer from './components/Footer';
import FlashMessage from './components/FlashMessage';
import { useEffect, useState } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';


export default function LandingPage() {
    const {
        showForm,
        setShowForm,
        setToken,
	setKeywords,
	setLocations,
        inProcess,
        setProject,
        results,
        setInProcess,
        showProjectForm,
        setShowProjectForm,
        flashMessage,
        setResults,
        messageType,
        setFlashMessage,
        setStopSave,
        setStates
    } = useMainContext();

    const queryParameters = new URLSearchParams(window.location.search);

    useEffect(() => {
        if (flashMessage) {
            setTimeout(() => {
                setFlashMessage(null);
            }, 2000);
        }
        if (queryParameters.get('id') && queryParameters.get('token')) {
            setStates('resetPassword');
            setShowForm(true);

        }
    }, [flashMessage]);

    const checkCreateProjectButton = () => {
        setResults([]);
	setKeywords([""]);
	setLocations([]);
        setProject({
            name : '',
            description : '',
	    locationCode : 2250 ,
            selectedLanguage : "French",
	    selectedCountry : "France"
        });
        setShowProjectForm(true);
    }

    const renderContent = () => {
        if (showForm) {
            return <Form myState={"login"} />;
        }
        else if (!showForm && !showProjectForm) {
            return (
                <div className="mx-auto px-6 md:px-8 lg:mt-60 flex flex-col justify-center items-center min-h-[20vh] mt-20 md:mt-32">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h1 className="text-center text-2xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight w-full">
                            Start optimizing your SEO efforts today {' '}
                        </h1>
                        <p className='flex gap-2 items-center justify-center text-blue-400 text-center text-xl'>
                            And take your rankings to the next level <Rocket className='text-yellow-500 animate-pulse' />
                        </p>


                        <button
                            onClick={() => checkCreateProjectButton(results)}
                            className="inline-flex items-center px-8 py-4 text-sm md:text-lg font-semibold text-white bg-[#2e326d] rounded-lg hover:bg-[#16172d] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <ArrowRight className='animate-pulse text-blue-500 w-6 h-6 mr-2' />
                            Start Now
                        </button>
                    </div>
                </div>


            );
        }
        else {
            return <ProjectForm sharedStates={[setToken, inProcess, setInProcess]} />
        }
    }

    const headerCss = 'h-screen bg-[#111569] z-50 w-[100%] relative pb-10 opacity-0.5 \
    transition-width duration-500 ease-in-out bg-gradient-to-l from-custom-blue \
    to-custom-dark bg-[length:200%_100%] animate-gradient-x"';
    return (<>
        {flashMessage ? <FlashMessage message={flashMessage} type={messageType} /> : ''}
        <header className={headerCss}>
            <NavBar />
            {renderContent()}
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
        </header>
        <FeatureSection checkProject={checkCreateProjectButton} />
        <Footer />
    </>)
} 
