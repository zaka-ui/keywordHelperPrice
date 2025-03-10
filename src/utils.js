export const BASEURL  = process.env.BASE_URL;
export const URL  = process.env.URL;

export const networkErrors =  {
  message: "Something went wrong. Please try again later.",
  code: "REQUEST_FAILED",
  details: "We encountered an issue while processing your request. Please check your internet connection or try again later."
}


export const handleCreateProject = async ( project, token, setToken, setFlashMessage, setTypeMessage) => {   
    try {
      const res = await fetch(`${BASEURL}/projects`,{
        method : 'POST',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json',
          'X-Token': token,
        },
        body : JSON.stringify(project)
      })
      const data = await res.json();
      if (res.ok) {
        return data; 
      }else {
        setToken('');
        return null;
      }
    }catch(err){
      console.log(err);
      setFlashMessage(networkErrors.message)
      setTypeMessage('error');
    }
}



export const handleCreateResults = async (results, projectId, token, setFlashMessage, setTypeMessage) => {
   try {
    const res = await fetch(`${BASEURL}/projects/${projectId}`,{
        method : 'POST',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json',
          'X-Token': token,
        },
        body : JSON.stringify(results)
    })
    const newResults = await res.json();
    if (res.ok){
      return newResults.results;
    }else{
      return [];
    }
  }catch (err) {
    console.log(err);
    setFlashMessage(networkErrors.message)
    setTypeMessage('error');
  }
}


export const handleUpdateProject = async (project, token, setFlashMessage, setTypeMessage) => {
   try {
    const res = await fetch(`${BASEURL}/projects/${project.id}`,{
        method : 'PUT',
        headers : {
          'content-type': "application/json",
          Accept : 'application/json',
          'X-Token': token,
        },
        body : JSON.stringify(project)
    });
    const newProject = await res.json();
    if (res.ok){
      return newProject;
    }else{
      return [];
    }
  }catch (err) {
    console.log(err);
    setFlashMessage(networkErrors.message);
    setTypeMessage('error');
  }
}


export const getCites = async ( country ) => {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method : "POST",
      headers : {
        'content-type': "application/json",
        Accept : 'application/json',
      },
      body : JSON.stringify({
        country : country
      })
    })
    if(res.ok){
      const cities = await res.json();
      return cities.data
    }
    return [];
  } catch (error) {
    console.log('error conrening citirs '  ,  error);
    
  }
}


export const removeCityFromKeyword = (keyword, locations) => {  
    const result = [];
    let updatedKeyword = keyword; // Start with the original keyword
    let matchedLocation = '';
    if(Array.isArray(locations)) {
      locations.forEach(location => {
        const escapedLocation = location.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'); // Escape special characters
        const regex = new RegExp(`\\b${escapedLocation}\\b`, 'gi'); // Match whole word, case-insensitive
        if (regex.test(updatedKeyword)) {
          updatedKeyword = updatedKeyword.replace(regex, '').trim(); // Remove location
          matchedLocation = location; // Store matched location
          result[0] = keyword.replace(matchedLocation.toLowerCase(), '').trim();
          result[1] = location;
        }
      });  
    }else{
      return keyword;
    }    
    return result;
}



export const getStorageItem = (key) => {
    const item = localStorage.getItem(key);
    if(item) {
      return JSON.parse(item);
    }
    return null;
}




//get specific result locations 
export const locationResult =  async (id , token)  => {
  try {
    const response = await fetch( `${BASEURL}/results/${id}/locations` , {
      method : "GET",
      headers : {
       "Content-Type" : "application/json",
       Accept : "application/json",
       'X-Token': token,
      }
     })

    if (response.ok) {
      const data =await  response.json()
      console.log("data",data);
      
      return data;
    }
  } catch (error) {
    console.log("error about locations fetching");
    
  }




}
