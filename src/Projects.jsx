import { useEffect, useState } from "react";
import { useMainContext } from "./context/MainContext";
import { Divide, SquareKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FlashMessage from "./components/FlashMessage";
import { BASEURL } from "./utils";


const Projects = () => {
  const { project, token, setResults , setKeywords, setProject, setStopSave, setFlashMessage, flashMessage, setMessageType, messageType,
    results,
    setLocations,
    locations,
    setShowProjectForm
  } = useMainContext();
  const navigate = useNavigate();
  const [projects, setProjects
  ] = useState([]);

  /****    stat of paginations */
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      fetchProjects(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchProjects(currentPage + 1);
    }
  };

  /*
  const fetchProjects = async () => {
      try {
        const res = await fetch( `${BASEURL}/projects`, {
          headers: {
            'content-type': "application/json",
            Accept: 'application/json',
            'X-Token': token,
          },
        })
        const data = await res.json();
        if (res.ok) {
          setProjects(data);
        }
      } catch (err) {
        console.log(err);
      }
    A
    }
  */

  const fetchProjects = async (page = 0, pageSize = 10) => {
    try {
      const res = await fetch(`${BASEURL}/projects?page=${page}&pageSize=${pageSize}`, {
        headers: {
          'content-type': "application/json",
          Accept: 'application/json',
          'X-Token': token,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data?.projects); // Set the paginated project data
        setTotalPages(data?.totalPages - 1); // Store the total number of pages for pagination
        setCurrentPage(data?.currentPage); // Keep track of the current page
      }
      else {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken('');
        setUserData({});
        setApiCredentials({});
        navigate('/');
        return
      }
    } catch (err) {
      if(res.statu === 401){
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken('');
        setUserData({});
        setApiCredentials({});
        navigate('/');
        return

      } 	    
      console.log(err);
    }
  };
  useEffect(() => {
    if (flashMessage) {
      setTimeout(() => {
        setFlashMessage(null);
      }, 2000);
    }
    if (!token) return;
    fetchProjects();
  }, [token, flashMessage])

  const handleView = async (project) => {
    try {
      const res = await fetch(`${BASEURL}/projects/${project.id}/results`, {
        method: "GET",
        headers: {
          'content-type': "application/json",
          Accept: 'application/json',
          'X-Token': token,
        }
      });
      const data = await res.json();
      if (res.ok) {
        setProject(project);
        setResults(data);
        setLocations(data[0]?.Locations && data[0]?.Locations.length > 0 ? data[0]?.Locations?.map(l => l.name) : []);
        setStopSave(true);
        navigate('/results');
      }
    } catch (error) {
      console.log("error coming from hande View in project page", error);

    }
  }

  const handleDelete = async (id) => {
    // Display a confirmation popup
    const userConfirmed = window.confirm("Are you sure you want to delete this project?");
    
    // Proceed only if the user confirms
    if (userConfirmed) {
      try {
        const res = await fetch(`${BASEURL}/projects/${id}`, {
          method: "DELETE",
          headers: {
            'content-type': "application/json",
            Accept: 'application/json',
            'X-Token': token,
          }
        });
        if (res.ok) {
          setFlashMessage("Record was deleted successfully");
          setMessageType('success');
          fetchProjects(); // Refresh the project list
        }
      } catch (error) {
        console.error("Error while deleting project:", error);
      }
    }
  };
  return (
    <div className="min-h-screen w-full bg-[#111569] relative overflow-x-hidden py-4 px-4 sm:px-6 md:px-10 lg:px-16 
    bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] 
    animate-gradient-x transition-all duration-500 ease-in-out">
      {flashMessage && <FlashMessage message={flashMessage} type={messageType} />}

      <div className='flex flex-col mt-10 sm:flex-row items-center justify-between mb-4 sm:mb-5 text-white font-bold space-y-2 sm:space-y-0'>
        <div
          className="hover:text-blue-400 transition-colors duration-200 cursor-pointer w-full sm:w-auto text-center sm:text-left"
          onClick={() => navigate('/')}
        >
          <i className='fa-solid fa-arrow-left mr-2'></i> Back
        </div>
        <span
          className="cursor-pointer text-white hover:text-blue-800 flex justify-center items-center gap-2 w-full sm:w-auto"
          onClick={() => {
            setProject(
             {
		     name : "",
		     description : "",
		     url : "",
		     locationCode : 2250,
		     selectedLanguage : "French" ,
		     selectedCountry : "France"
	     }
	    )
            setResults([]);
            setKeywords([""]);
            setLocations([]);
            setShowProjectForm(true);
            navigate('/');
          }}
        >
          <SquareKanban /> Create new
        </span>
      </div>

      {projects?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2 sm:px-6 md:px-10 mt-10 sm:mt-20">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-sm 
         border border-gray-100 hover:shadow-md transition-all duration-200 
         flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-blue-600 mb-1 text-lg truncate">{project.name}</h3>
                <div className="flex flex-wrap gap-2 items-center text-sm text-white opacity-80">
                  <p className="truncate">{project.createdAt}</p>
                  {project.url && (
                    <>
                      <span>|</span>
                      <p className="truncate">{project.url}</p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => handleView(project)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[500px] text-center text-white py-20">
          <p className="text-xl mb-4">Nothing for now</p>
          <span
            className="cursor-pointer text-blue-600 hover:text-blue-800 text-lg"
            onClick={() => {
              setShowProjectForm(true);
              navigate('/');
            }}
          >
            Start now !
          </span>
        </div>
      )}

      {projects?.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 mb-10">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded 
       disabled:opacity-50 transition-all hover:bg-blue-600"
          >
            Previous
          </button>
          <span className="text-white text-center">Page {currentPage + 1} of {totalPages + 1}</span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded 
       disabled:opacity-50 transition-all hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;
