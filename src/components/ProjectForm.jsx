import { useMainContext } from "../context/MainContext";
//import FlashMessage from "./FlashMessage";
import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { BASEURL } from "../utils";

const formInputs = [
        {
            label: 'Project name',
            name: 'name',
            type : 'text',
        },
        {
            label : 'Description',
            name : 'description',
            type : 'text'
        },
  
]

export default function ProjectForm (){
    const navigate = useNavigate();
    const {
      inProcess,
      setShowProjectForm,
      project,
      setProject,
      userData,
      setUserData,
      setStopSave,
    } = useMainContext();
    const [errors, setErrors] = useState({});
    const handleProject = (e) => {
        const errors = {};
        e.preventDefault();
        const fields  = ['name'];
        for(const[key, value] of Object.entries(project)) {
          if (fields.includes(key) && !value) {
            errors[key] = 'This field is required';
          }
        }
        if(Object.entries(errors).length > 0){
          setErrors(errors);
        }else {
          setShowProjectForm(false);
          setProject({
            ...project,
          });
          setStopSave(false);
          navigate('/starter');
        } 
    }
    const inputClass = `appearance-none rounded-xl relative block w-full 
    pl-12 pr-4 py-4 border border-gray-200 placeholder-gray-400 text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    focus:z-10 sm:text-sm transition-all duration-200 bg-white/50 backdrop-blur-sm`

  const textAreaCss = `w-full p-4 border border-gray-200 rounded-xl resize-none 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      placeholder-gray-400 text-gray-900 transition-all duration-200 
      bg-white/50 backdrop-blur-sm min-h-[160px]`

  const hasErrors = Object.keys(errors).length > 0;

return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 py-20 px-4 min-h-[100vh]">
        <div className={`lg:w-2/6 sm:w-1/2 md:w-1/2 m-auto bg-white/90 backdrop-blur-md 
            px-8 rounded-2xl relative shadow-xl transition-all duration-300 ease-in-out 
            ${hasErrors ? 'max-h-[95vh]' : 'max-h-[85vh]'} overflow-auto py-12`}>
            
            {/* Close Button */}
            <button 
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 
                    transition-colors duration-200 rounded-full hover:bg-gray-100/80"
                onClick={() => setShowProjectForm(false)}
            >
                <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="max-w-md w-full mx-auto space-y-6">
                <div>
                    <h2 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                        Create Project
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Start by creating a new project to begin organizing and optimizing your SEO efforts.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleProject}>
                    <div className="rounded-md space-y-5">
                        {formInputs.map((f, index) => (
                            <div key={index} className="relative group">
                                {f.name === 'description' ? (
                                    <>
                                        <textarea
                                            className={
                                                hasErrors && errors[f.name]
                                                    ? `${textAreaCss} border-red-300 bg-red-50 text-red-900 placeholder-red-400`
                                                    : textAreaCss
                                            }
                                            placeholder={
                                                hasErrors && errors[f.name]
                                                    ? errors[f.name]
                                                    : "Enter your description here..."
                                            }
                                            name={f.name}
                                            value={project[f.name]}
                                            onChange={(e) => {
                                                setProject((prev) => ({
                                                    ...prev,
                                                    description: e.target.value
                                                }))
                                            }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-project-diagram absolute left-4 top-1/2 transform -translate-y-1/2 
                                            text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                                        </i>
                                        <input
                                            type={f.type}
                                            name={f.name}
                                            onClick={() => setErrors({})}
                                            id={index}
                                            className={
                                                hasErrors && errors[f.name]
                                                    ? `${inputClass} border-red-300 bg-red-50 text-red-900 placeholder-red-400`
                                                    : inputClass
                                            }
                                            placeholder={
                                                hasErrors && errors[f.name]
                                                    ? errors[f.name]
                                                    : f.label
                                            }
                                            value={project[f.name]}
                                            onChange={(e) => {
                                                setProject((prev) => ({
                                                    ...prev,
                                                    name: e.target.value
                                                }))
                                            }}
                                            disabled={inProcess}
                                        />
                                    </>
                                )}
                                {errors[f.name] && (
                                    <p className="text-red-500 text-xs mt-1 ml-1 transition-all duration-300">
                                        {errors[f.name]}
                                    </p>
                                )}
                            </div>
                        ))}
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
                            Create
                            <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform duration-200"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
}