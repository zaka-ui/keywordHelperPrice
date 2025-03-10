import SearchVolumeChart from "./SearchVolumeChart"
import CircleChart from "./CircleChart"
import { useMainContext } from "../context/MainContext"
import languageData from '../../dataForSeo'


export default function VisChart({percent = 0, search , result}) {
  const {project} = useMainContext();
  const countries = project.selectedLanguage
    ? languageData[project.selectedLanguage].countries
    : [];
  const country = countries.find((c) =>  project?.locationCode?.toString() ===  c.code);

  return ( 
    search.length > 0 ? 
    <> 
    <div className="flex item-start mb-5 font-bold text-gray-500">
        <h3>Country : {country.name} </h3>
      </div>
     <div className="flex items-center justify-between">
     <div className="flex flex-col items-start justify-start text-gray-500 relative">
      <SearchVolumeChart monthlySearches={search} />
      <div className="flex gap-5 items-start mt-5 mb-10 " >
        <h3 className="font-bold">Search intent : <span className="font-bold ml-1 text-green-900">{result.intent}</span></h3>
        <h3 className="font-bold">CPC : <span className="font-light ml-1">{result?.cpc}</span> </h3>
        <h3 className="font-bold">Competition : <span className="font-light ml-1">{result?.competition * 100 } %</span></h3>
        <h3 className="font-bold">Average backlinks : <span className="font-light ml-1">{result?.avg_backlinks}</span></h3>
        {/* <h3 className="font-bold">Result count : <span className="font-light ml-1">{result?.result_count}</span></h3>  */}
      </div>
      </div>
      <div className="lg:mr-60">
      <CircleChart percent={percent} keywordDifficulty={result.keyword_difficulty_for_local_seo} />
      </div>
     </div>

    </> :  "No records found for the specified keyword"
  )
  
}
