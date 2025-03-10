import { useState, useContext, useEffect} from "react";
import { useNavigate } from 'react-router-dom';
import { useMainContext } from './context/MainContext';
import Input from "./components/Input";
import LocationsInput from "./components/Locations";
import FlashMessage from "./components/FlashMessage";
import axios from "axios";
import { 
  Sparkles,
  Loader2,
  User,
  KeyRound,
  Eye,
  FolderDot
} from 'lucide-react';
import LanguageSelector from "./components/LanguageComponents";
import { getCites, removeCityFromKeyword } from "./utils";
import languageData from "../dataForSeo";


export default function Starter() {
  const [loading, setLoading] = useState(false);
  const {keywords, setKeywords,project, results, setProject, setResults, setShowProjectForm, stopeSave, locations , userData,
    setLocations, apiCredentials,
    setApiCredentials, setMessageType,
    setFlashMessage, flashMessage, messageType
  } = useMainContext();
  const [error, setError] = useState('');
  const [cities, setCities] = useState([]);  
  const router = useNavigate();
  const resultsMap = new Map();


  useEffect(() => {
    if (!project?.name?.length) {
        setShowProjectForm(true);
        router('/')
    }
    const getContryCities = async ()=> {
      if (project) {        
        const name = languageData[project?.selectedLanguage]?.countries?.find(
          (country) => country.code === parseInt(project.locationCode).toString()
        )?.name;
        const countryCites = await getCites(name) ;
        setCities(countryCites);    
      }
    }
    getContryCities();
  }, [project]);

  const updateResultsMap = (results, keyFields) => {
    results.forEach((data) => {
      const keyword = data.keyword;
      const updatedData = keyFields.reduce((acc, field) => {
        acc[field] = data[field] || (field === 'search_volume' ? 0 : []);
        return acc;
      }, { keyword });
      const existingData = resultsMap.get(keyword) || {};
      resultsMap.set(keyword, { ...existingData, ...updatedData });
    });
  };


  const handleChange = (index) => (e) => {
      const newKeywords = [...keywords];
      newKeywords[index] = e.target.value.toLowerCase();
      setKeywords(newKeywords);
  };

  const handleAddInput = (index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index + 1, 0, "");
    setKeywords(newKeywords);
  };

  const handleRemoveInput = (index) => {
    if (keywords.length > 1) {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
    }
  };


  const fetchKeywordsInput = async () => {    
    setLoading(true);
    
    if(!apiCredentials?.api_user || !apiCredentials?.api_password) {
      setError('API credentials are required to perform this action. Please Add them in the profile page');
      setFlashMessage('API credentials are required to perform this action. Please add them in profile page');
      setMessageType('error')
      setLoading(false);
      router('/profile');
      return;
    }
    if (apiCredentials?.api_user === null || apiCredentials?.api_password === null) {
      setError('API credentials are required to perform this action. Please Add them in the profile page');
      setFlashMessage('API credentials are required to perform this action. Please add them in profile page');
      setFlashMessage('API credentials are required to perform this action. Please add them in profile page');
      setMessageType('error')
      setLoading(false);
      router('/profile');
      return;
    }
    if (keywords.length === 0 || (keywords.length === 1 && keywords[0] === '')) {
      setError("Keywords list cannot be empty. Please provide at least one valid keyword.");
      setMessageType('error')
      setLoading(false);
      return;
    }
    if (!project.selectedLanguage && !project.locationCode) {
      setError("Please ensure both language and country are selected.");
      setLoading(false);
      return;
    }
    const username = apiCredentials.api_user;
    const password = apiCredentials.api_password ;
    const post_array = [];


    const newKeyword = keywords.filter((key) => key.length > 0);
    const combinedKeywords = [];

    if(locations.length > 0){
      newKeyword.forEach(keyword => {
        locations.forEach(location => {
          combinedKeywords.push(`${keyword.toLowerCase()} ${location.toLowerCase()}`);
        })
       })
    }
    if(keywords.length > 200 || combinedKeywords.length >200 ){
      setError("Maximum of keywords should be 200");
      setLoading(false);
      return;
    
    }
    post_array.push({
      keywords: locations.length > 0 ? combinedKeywords : newKeyword ,
      language_name: project.selectedLanguage,
      location_code: parseInt(project.locationCode),
    });
    

    const searchVolume = async () => {
      //https://api.dataforseo.com/v3/dataforseo_labs/google/historical_search_volume/live
      //https://api.dataforseo.com/v3/keywords_data/clickstream_data/bulk_search_volume/live
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_search_volume/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });
        
        if (response.status === 200) {
          const data = response?.data?.tasks[0]?.result[0]?.items;
          if (data?.length > 0 ) {
            for (const item of data) {
              const keyword = item?.keyword ;
              const keyword_difficulty = item?.keyword_properties?.keyword_difficulty || 0;
              const search_volume = item?.keyword_info?.search_volume || 0;
              const result_count = item?.serp_info?.se_results_count || 0;
              const monthly_searches = item?.keyword_info?.monthly_searches || [] ;
              const competition_level = item?.keyword_info?.competition_level || 0;
              const cpc  = item?.keyword_info?.cpc || 0;
              const highBid  = item?.keyword_info?.high_top_of_page_bid || 0;
              const competition  = item?.keyword_info?.competition || 0;
              const avg_backlinks  = item?.avg_backlinks_info?.backlinks || 0;
              const KDL = (item?.keyword_info?.cpc * 10 ) + (item?.keyword_info?.search_volume  * 0.1 ) + (item?.keyword_info?.competition * 100)
              const existing = resultsMap.get(keyword) || {};
              resultsMap.set(keyword, {...existing, keyword,KDL ,keyword_difficulty, search_volume  , competition ,result_count, competition_level , cpc , highBid , avg_backlinks,  monthly_searches});
             }
          }
        }
        else{
          setTimeout(() => {
            setFlashMessage('No Data Found in records');
            setMessageType('error');
          } , 2000)
        }
        
      } catch (error) {
        setFlashMessage('Oops something went wrong please check if the api credentials are valid in you profile page !!');
        setMessageType('error');
	setLoading(false);
        console.error('Error fetching search volume:', error?.message);
      }
    };
    
  // get search intent 
  const getSearchIntent = async ()=> {
    try{
       const response = await axios({
        method: 'post',
        url: 'https://api.dataforseo.com/v3/dataforseo_labs/google/search_intent/live',
        auth: {
            username,
            password
        },
        data: post_array,
        headers: {
            'content-type': 'application/json'
        }
    })
    if (response.status === 200) {
        const data = response.data.tasks[0].result[0].items
        data.forEach((resultItem)  => {
            const keyword = resultItem.keyword;
            const intent = resultItem.keyword_intent.label || 'No intent set for this keyword ';
            const probability = resultItem.keyword_intent.probability || 0 ;
            const existingData = resultsMap.get(keyword) || {};          
            resultsMap.set(keyword, { ...existingData, intent , probability});    
      })
    }else{
      setFlashMessage('Opops somthing went wrong : search intent record . Please check if the api credentilas are valid in your profile page ')
      setMessageType('error');
    }

    }catch(error){
     setFlashMessage('Oops somthing went wrong . Please check if the api credentials are valid in you profile page ' ); 
     setMessageType('error');
     setLoading(false);
    }

  } 
    /* get SUGGESTIONS FOR EACH KEYWORD  */
  const getKeywordSuggestions = async () => {
      const keys = post_array[0].keywords;
      for (const combinationKeyword  of keys ) {
        const suggestionArray = [
          {
            keyword: combinationKeyword,
            location_code: parseInt(project.locationCode),
            limit : 20,
          },
        ];

        try {
          const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/dataforseo_labs/keyword_suggestions/live',
            auth: { username, password },
            data: suggestionArray,
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.status === 200) {
            const suggestions = response?.data?.tasks[0]?.result[0]?.items?.map(item =>  ({
              keyword: item.keyword,
              search_volume: item.keyword_info.search_volume || 0,
              keyword_difficulty: item.keyword_properties.keyword_difficulty || 0,
              cpc : item?.keyword_info?.cpc || 0,
              competition : item?.keyword_info?.competition || 0,
              keyword_difficulty_for_local_seo : ((item?.keyword_info?.cpc || 0) * 10) +  ((item.keyword_info?.search_volume || 0) * 0.1) + ((item?.keyword_info?.competition || 0) * 100) || 0
            })

          );
            const existingData = resultsMap.get(combinationKeyword) || {};
            resultsMap.set(combinationKeyword, { ...existingData, combinationKeyword, suggestions });
          }
        } catch (error) {
          console.error('Error fetching keyword suggestions:', error.response?.data || error.message);
          setLoading(false);
        }
      }
    }
    const getAllKeywordData = async () => {
      await searchVolume();
      await getSearchIntent();
      await getKeywordSuggestions();
      // Log final results with suggestions
      const formattedResults = Array.from(resultsMap.entries()).map(([keyword, data]) => {
          return {
            keyword,
            keyword_difficulty: data.keyword_difficulty || 0,
            keyword_difficulty_for_local_seo: data.KDL || 0,
            search_volume: data.search_volume || 0 ,
            result_count : data.result_count || 0 ,
            avg_backlinks : data.avg_backlinks || 0,
            monthlySearch: data.monthly_searches || [],
            competition: data.competition || 0,
            compitition_level : data.compitition_level || 0,
            cpc : data.cpc || 0,
            highBid : data.highBid || 0,
            intent : data.intent || 0,
            probability : data.probability || 0,
            suggestions: data.suggestions || [], // Log suggestions if present
          }
        });
        setResults(formattedResults); 
      };
      await getAllKeywordData();
      setLoading(false);
      router('/results')
  };
  const inputUserCss = "w-full border  decoration-sky-500 border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10\
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none\
                  transition-all duration-200 backdrop-blur-sm"
  
  return (
    <>
      <div className="min-h-screen bg-gradient-to-l from-custom-blue to-custom-dark bg-[length:200%_100%] animate-gradient-x">
        <div className="relative max-screen mx-auto px-6 py-5 space-y-6">
          <div className="flex items-center justify-between space-y-2 mb-12 ">
        <div className='cursor-pointer lg:ml-40 sm:ml-5 text-white font-bold text-black flex gap-2 items-center' 
        onClick={() => {
          setProject({
            name: '',
            description: '',
            url: "",
            locationCode: 2250,
            selectedLanguage: "French",
            selectedCountry: "France"
          })
          setResults([]);
          setKeywords([""]);
          setLocations([]);
          router('/');
        }}>
          <i className='fa-solid fa-arrow-left'></i> 
          Back
        </div>

        {
          userData?.name && (
            <div className='cursor-pointer lg:mr-40 sm:ml-5 text-white font-bold text-black flex gap-2 items-center' 
            onClick={() => {
              router('/'.concat(`${userData?.name}/projects`), { replace: true });
            }}>
              <FolderDot />
              Projects
            </div> 
          )
        }
        
         
       </div>
        {flashMessage ? <FlashMessage message={flashMessage} type={messageType}/> : ''}
      <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-10  space-y-6">

          {/* input of country and location code error */}
         {error && (
            <div className="bg-[size:200%_100%] animate-gradient-x">
              <p className="text-red-500 text-xl mt-1 ml-1 transition-all duration-300">
                {error}
              </p>
            </div>
          )}

          {/* Api credentials collect

          <div className="flex gap-2 w-full group ">
          <div className="relative w-full group mb-5">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
                 <input
                   type={apiCredentials?.api_user?.length > 0 ? 'password': 'text'}
                   placeholder="DATAFORSEO Api user"
                   value={apiCredentials?.api_user}
                   onChange={(e) => {
                    setApiCredentials({
                      ...apiCredentials,
                      api_user : e.target.value
                    })
                  }}
                  
                  className={inputUserCss}

                 />
          </div>

          <div className="relative w-full group mb-5">
          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
                
                 <input
                   type="password"
                   placeholder="DATAFROSEO Api password"
                   value={apiCredentials?.api_password}
                   onChange={(e) => {
                        setApiCredentials({
                          ...apiCredentials,
                          api_password : e.target.value
                        })
                   }}
                   className="w-full border text-gray-900 	border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10
                             text-gray-100  focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent outline-none transition-all duration-200
                             backdrop-blur-sm"
                 />
          </div>
          </div>




			  */} 
          <div className="flex gap-6 justify-between items-center w-full">
          
          <LanguageSelector
              onWebsiteChange={setProject}
              project={project}
          />
          </div>
          {/* Input section */}
          <div className="space-y-4 w-full">
                {keywords.map((keyword, index) => (
                  <Input
                  key={index}
                  index={index + 1}
                  value={keyword}
                  handleChange={handleChange(index)}
                  onAdd={() => handleAddInput(index)}
                  onRemove={() => handleRemoveInput(index)}
                  isLast={index === keywords.length - 1}
                  disabled={loading}
                  />
                ))}
              </div>
           
          
          {/*  bacth unput method      */ }
          

           <LocationsInput suggestions={cities} />

          {/* Action button */}
          <button
            onClick={fetchKeywordsInput}
            desabled={loading}
            className="w-full bg-blue-600 hover:from-blue-500 
                    hover:to-purple-500 text-white font-medium py-4 px-8 rounded-lg
                    transition-all duration-200 transform hover:scale-[1.02] 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                    flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyse</span>
              </>
            )}
          </button>
         </div>
        </div>
      </div>
    </>
  );
}
