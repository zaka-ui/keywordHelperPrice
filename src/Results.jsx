import { useState, useEffect } from "react";
import { useNavigate, useNavigation } from 'react-router-dom';
import { useMainContext } from './context/MainContext';
import { 
  Download,
  Save,
  Loader2,
  Edit,
  House,
  Eye,
  FolderDot
} from 'lucide-react';
import ResultsTable from "./components/ResultsTable";
import BusinessInfo from "./components/BusinessInfo";
import Form from './components/Form';
import { handleCreateProject, handleCreateResults , handleUpdateProject, BASEURL, locationResult, removeCityFromKeyword} from "./utils";
import FlashMessage from "./components/FlashMessage";

// Helper functions
const calculateTotalKeywords = (csvResults) => csvResults?.length || 0;

  const calculatePrice = (csvResults) => {
  let priceTotal = 0;
  let level ;
  let veryCompetitive = 0;
  csvResults.forEach((result) =>{
    if(result.difficulty > 150 ) veryCompetitive ++;
  })
  if( veryCompetitive > 0){
    priceTotal = 500;
    let count = 0;
    csvResults.forEach(r => {
      if(r.difficulty < 150 || count > 0) {
          const addedPrice = r.difficulty < 100 ? 10 : r.difficulty > 100 && r.difficulty < 150 ? 25 : 50;
          priceTotal += addedPrice ;
      }
      if(r.difficulty > 150 ) count ++;
    })
    level = "VIP";
    } else {
    const count = csvResults.length;
    if(count <= 20) priceTotal = 120;
    else if (count <= 40 ) priceTotal = 200;
    else if (count <= 60 ) priceTotal = 350;
    else {
        total = 500;
        csvResults.forEach(r => {
          priceTotal += r.difficulty < 100 ? 10 : r.difficulty > 100 && r.difficulty < 150 ? 25 : 50
    });
  }
 }
  return { priceTotal , level};
};


const convertToCSV = (project, results , level) => {
  const businessInfo = [
    `Project Name,${project?.name || project?.data?.name  || 'N/A'}`,
    `Domaine name,${project?.url  || 'N/A'}`,
    `Project Description ,${project?.description || 'N/A'}`,
    `Price Total , ${level.priceTotal || 'N/A'}£`
  ];
  const headers = ['Keyword','Keyword Difficulty'];
  const rows = results?.map(result => {
  const keyword = result?.keyword || 'Unknown Keyword';
  const keywordDifficulty =  
      result?.difficulty< 100 ? 'Facile'
		  : result?.difficulty > 100 && result?.difficulty < 150 ? 'concurentiel' 
      : "Trés concurentiel" ;
          
  const competitionValue = keywordDifficulty || '-';
  /*
  const avgMonthlySearches = result?.search_volume || '-' ;
  const suggestions = Array.isArray(result?.suggestions) && result?.suggestions.length > 1 
      ? result?.suggestions.filter((item) => item.keyword_difficulty_for_local_seo  < 150  )
          .slice(1)
          .map(sugg => `${sugg?.keyword}` || 'N/A')
          .join('\n')
      : '';
  */
      return [
        keyword,
        competitionValue,
      ].map(cell => {
        const cellStr = String(cell).replace(/"/g, '""');
        return cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')
          ? `"${cellStr}"`
          : cellStr;
      }).join(',');
    });
    return [...businessInfo, headers.join(','), ...rows].join('\n');
};

const downloadCSV = (csvContent, filename) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

//addLocations
const addLocationToResults = async (id , locations , token) =>{
  const newLlocations = [];
  try {
    locations.forEach( async (location) => {
      const response = await fetch( `${BASEURL}/results/${id}` , {
        method : "PUT",
        headers : {
          Accept : "application/json",
         "Content-Type" : "application/json",
         'X-Token': token,

        },
        body : JSON.stringify({
          locationsName : location
        })
       })
       const data =await  response.json();
      if (response.ok) {
        newLlocations.push(data.name);

      }
    })
    return newLlocations;
  } catch (error) {
    console.log(error)
  }

}
//delete locations
const deleteLocations = async (id , token , locations) => {
   try {
    const response  = await fetch(`${BASEURL}/results/${id}/locations` , {
      method : "DELETE",
      headers : {
        Accept : "application/json",
       "Content-Type" : "application/json",
       'X-Token': token,
      },
      body : JSON.stringify({
        locations
      })
   })
   if(response.ok){
    return true;
   }else{
    console.log("somthin went wrong in deteleting the locations");
    
   }
   } catch (error) {
    console.log("delete locations error" , error);
    
   }
}

// Components
const ActionButtons = ({ handleUpadates , isLoading , onDownload, onSave, disabled, stopSave }) => (
  <div className="flex flex-wrap gap-3">
    {
      stopSave && (
        <button
        onClick={()=> {
          handleUpadates()
        }}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg
                  bg-gradient-to-r from-emerald-600 to-emerald-700
                  hover:from-emerald-500 hover:to-emerald-600
                  disabled:from-gray-600 disabled:to-gray-700
                  text-white transition-all duration-200 transform hover:scale-[1.02]
                  disabled:hover:scale-100 shadow-lg"
      >
        <Edit className="w-5 h-5" /> update
      </button>
      )
    }
    <button
      onClick={onDownload}
      disabled={disabled}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-emerald-600 to-emerald-700
                hover:from-emerald-500 hover:to-emerald-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      <Download className="w-5 h-5" /> Download CSV
    </button>
    <button
      onClick={onSave}
      disabled={isLoading || stopSave}
      className="flex items-center gap-2 px-4 py-2 rounded-lg
                bg-gradient-to-r from-purple-600 to-purple-700
                hover:from-purple-500 hover:to-purple-600
                disabled:from-gray-600 disabled:to-gray-700
                text-white transition-all duration-200 transform hover:scale-[1.02]
                disabled:hover:scale-100 shadow-lg"
    >
      {isLoading ? (<>
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>loading...</span>
      </>) : <div className="flex gap-2 items-center"><Save className="w-5 h-5" /> Save Results</div>}
    </button>
  </div>
);

export default function Results() {
  const {
    userData,
    csvResults,
    setCsvResults,
    project,
    setProject,
    setKeywords,
    keywords,
    locations,
    setLocations,
    results,
    setResults,
    token,
    setToken,
    showForm,
    setShowForm,
    flashMessage,
    setFlashMessage,
    setMessageType,
    stopSave,
    setStopSave,
    messageType
  } = useMainContext();

  
  const [isLoading, setIsLoading] = useState(false);
  const router = useNavigate();
  const totalKeywords = calculateTotalKeywords(csvResults);
  const level = calculatePrice(csvResults);
  useEffect(() => {
        if(flashMessage){
            setTimeout(() => {
                setFlashMessage(null);  
            }, 2000);
        }
    }, [flashMessage , results])
    
  const handleDownloadCSV = () => {
      try {
        if (!results?.length) {
          alert('No results to download');
          return;
        }

        const date = new Date().toISOString().split('T')[0];
        const filename = `keyword-research-${date}.csv`;
        const csvContent = convertToCSV(project, csvResults,level);
        
        downloadCSV(csvContent, filename);
      } catch (error) {
        console.error('Error downloading CSV:', error);
        alert('Error creating CSV file. Please try again.');
      }
  };

  const handelEditAction =  () => {    
    const keywe = [];
      if(locations.length > 0) {
        const keys = new Set();     
        results.forEach((r) => {
          keywe.push(r.keyword);
          keys.add(removeCityFromKeyword(r.keyword, locations)[0]);
        })
        setKeywords([...keys]);
      }
      else{
        setKeywords(results.map((k) => k.keyword));
        setLocations([]);
      }  
      router('/starter');
  }

  const handleSave = async () => {
    setIsLoading(true);
    if(!token) {
        setShowForm(true);
        if (!project) {
          setIsLoading(false);
          router('/');  
        }
    }else{
      const newProject = await handleCreateProject(project, token, setToken, setFlashMessage, setMessageType);
      setProject(newProject)
      if (newProject) {
        const newResults = await handleCreateResults(results, newProject.id, token, setFlashMessage, setMessageType); 
        if(newResults && newResults.length > 0) {
          if (locations && locations.length > 0) {
              const locationsResult = await addLocationToResults(newResults[0].id , locations , token );
              setLocations(locationsResult);  
          }
          setResults(newResults);
          setStopSave(true);
        }else{
          setFlashMessage('Oups something went wrong!!')
          setMessageType('error')
        }
      }
    }
    setIsLoading(false);
  };
  const handleUpadates = async () => {
    setIsLoading(true)
    const newProject = await handleUpdateProject(project, token, setFlashMessage, setMessageType);
    const url = `${BASEURL}/projects/${project.id}/results`;
    try {
        const res = await fetch(url, {
          method: 'PUT',
          headers : {
            'content-type': "application/json",
            Accept : 'application/json',
            'X-Token': token,
          },
          body : JSON.stringify(results)
        });
        if(res.ok) {
          const data = await res.json();
          if(locations && locations.length > 0 ){
            const deletedLocationsAction = await deleteLocations(data[0].id , token , locations);
            if(deletedLocationsAction) {
              const locationsResult = await addLocationToResults(data[0].id, locations , token );
              setLocations(locationsResult);
            } 
          }
          setFlashMessage("Record was updated succesfully");
          setMessageType('success');
          setResults(data);
          
        }
        setIsLoading(false);
        
    }catch (err) {
      console.log(err);
    }
  }
  return(
  <>
  <div className="min-h-screen bg-gray-900 bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] animate-gradient-x text-white relative overflow-hidden">
    <div className="relative max-w-8xl mx-auto p-6 space-y-6">

        <div className='flex items-center justify-between cursor-pointer lg:ml-6 sm:mb-5 text-white font-bold'>
          <div className=" hover:text-blue-400 transition-colors duration-200"
              onClick={() =>{
                setProject({
                  name: '',
                  description: '',
                  url: "",
                  locationCode: 2250,
              	  selectedLanguage: "French",
                  selectedCountry: "Franch"
                })
                setResults([]);
                setKeywords([""]);
                setLocations([]);
                setCsvResults([]);
                router('/starter');
              }}>
              <i className='fa-solid fa-arrow-left'></i> Back
          </div>
          <div className="flex items-center gap-3">
            {
            userData?.name && (
              <div className='cursor-pointer lg:mr-5 sm:ml-5 text-white font-bold text-black flex gap-2 items-center hover:text-white/80' 
              onClick={() => {
                setCsvResults([]);
                router('/'.concat(`${userData?.name}/projects`), { replace: true });
              }}>
               <FolderDot />
                Projects
              </div> 
            )
          }
          <div className="flex gap-2 items-center border-solid	border-2 border-white py-2 px-5 rounded hover:bg-white hover:text-gray-900 transition-colors duration-200"
                onClick={() =>
                {
                  setProject({
                    name: '',
                    description: '',
                    url: "",
                    locationCode: 0,
                    selectedLanguage: "",
                    selectedCountry: ""
                  })
                  setResults([]);
                  setKeywords([""]);
                  setLocations([]); 
                  setCsvResults([]);
                  router('/');
                }          
                }>
                <House className="h-5 w-5" />
                Home
          </div>
            {
             results?.length  > 0 && (
            <div className="flex gap-2 items-center bg-red-500 rounded py-2 px-5 hover:text-red-900 transition-colors duration-200"
              onClick={() =>{
                setCsvResults([]);
                handelEditAction()
              }}>
              <Edit className="h-5 w-5"  /> Edit
            </div>
              )
            }
          </div>
        </div>


        {flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : ''}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BusinessInfo name={project?.data?.name || project?.name } project={project}  />

        {results?.length > 0 && (
          <div className="flex justify-end items-center bg-gray-800/50 p-6 rounded-lg 
                      backdrop-blur-sm border border-gray-700 shadow-lg">
            <ActionButtons
              handleUpadates={handleUpadates}
              isLoading={isLoading}
              onDownload={handleDownloadCSV}
              onSave={handleSave}
              disabled={isLoading}
              stopSave={stopSave}
            />
          </div>
        )}
      </div>
      <div className="bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 
                  shadow-lg overflow-hidden">
        <ResultsTable
          results={results}
          totalKeywords={totalKeywords}
          level={level}
        />
      </div>
      </div>
  </div>

    {showForm ?  <Form myState={'login'} /> : ''}
  </>
)
}
