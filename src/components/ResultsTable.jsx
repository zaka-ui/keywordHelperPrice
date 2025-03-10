import { useState } from "react";
import SuggestionsList from "./suggestions";
import { AlertCircle, Eye } from 'lucide-react';
import VisChart from "./VisCharts";
import { useMainContext } from "../context/MainContext";

const ResultsTable = ({ results, totalKeywords, level }) => {
  const {csvResults , setCsvResults } = useMainContext();
  const [showStats, setShowStats] = useState(0);
  const [item, setItem] = useState({});
  const competiton = ['Facile' , 'Facile' , 'concurentiel' , 'Trés concurentiel'];
  if (!results?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <AlertCircle className="w-12 h-12 mb-4 text-gray-500" />
        <span className="text-lg">No results found</span>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan="6" className="bg-gray-800/60 border-b border-gray-700 px-6 py-4 w-full">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Total Keywords:</span>
                  <span className="text-white font-bold bg-gray-700/50 px-3 py-1 rounded-full">
                    {totalKeywords}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Classification :</span>
                  <span className={`font-bold px-3 py-1 rounded-full
                      ${level.name === "Level 1" ? "bg-emerald-500/20 text-emerald-400" :
                        level.name === "Level 2" ? "bg-blue-500/20 text-blue-400" :
                        level.name === "Level 3" ? "bg-purple-500/20 text-purple-400" :
                        "bg-amber-500/20 text-amber-400"}`}>
                    {level.level}
                  </span>
                  <span className="font-bold px-3 py-1 rounded-full">
                    Price : {level.priceTotal}£
                  </span>
                </div>
              </div>
            </th>
          </tr>
          <tr className="bg-gray-800/40">
            <th className="relative flex justify-start gap-2 px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Keyword
            </th>
            <th className="relative px-6 py-4 text-center text-gray-300 font-medium border-b border-gray-700">
              Monthly Searches
            </th>
            <th className="relative px-6 py-4 text-center text-gray-300 font-medium border-b border-gray-700">
              Competition
            </th>
            <th className="relative px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Suggestions
            </th>
            <th className="relative px-6 py-4 text-left text-gray-300 font-medium border-b border-gray-700">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {results?.map((result, index) => {
            const keyword = result?.keyword || "Unknown Keyword";
            const keywordDifficulty = result?.keyword_difficulty_for_local_seo;
            const searchVolume = result?.search_volume;
            const suggestions = result?.suggestions;
            return (
              <>
                <tr
                  key={keyword + index}
                  className={`border-b border-gray-700/50 transition-colors duration-150
                            ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/40'}
                            hover:bg-blue-600/10`}
                >
                  <td className="px-6 py-4 font-medium text-gray-200">
                    <input type="checkbox" id="keywordCheckbox" className="mr-2" 
                    onChange={(e) => {
                      let updatedResults;
                      let res = {
                        keyword : result.keyword , 
                        difficulty : result?.keyword_difficulty_for_local_seo
                      }  
                      if (e.target.checked) {                      
                        updatedResults = [...csvResults, res];
                      } else {
                        updatedResults = csvResults.filter((item) => item.keyword !== res.keyword); // Remove the result immutably
                      }
                      setCsvResults(updatedResults); // Update the state
                    }}
                    />
                    {keyword}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-300">
                      {searchVolume?.toLocaleString() || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full
                    
                      ${
                          keywordDifficulty < 50 ? 'bg-green-500/20 text-green-400' 
                        : keywordDifficulty > 50 && keywordDifficulty < 100 ? 'bg-green-500/20 text-green-400' 
                        : keywordDifficulty > 100 && keywordDifficulty < 150 ? 'bg-amber-500/20 text-amber-400' 
                        : 'bg-red-500/20 text-red-400'
                      
                      }`
                      }
                    >

                      {
                          keywordDifficulty < 50 ? competiton[0]
                        : keywordDifficulty > 50 && keywordDifficulty < 100 ? competiton[1] 
                        : keywordDifficulty> 100 && keywordDifficulty < 150 ?   competiton[2]
                        : keywordDifficulty > 150 ? competiton[3] : competiton[3]
                      }

                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <SuggestionsList
                      suggestions={suggestions}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <Eye className={showStats === index ? "cursor-pointer text-green-500" : "cursor-pointer"} onClick={() => {
                      setShowStats(showStats === index ? null : index); // Toggle view for specific keyword
                      setItem(result);
                    }} />
                  </td>
                </tr>

                {/* Render the chart only for the clicked keyword */}
                {showStats === index && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      <VisChart percent={100 - keywordDifficulty } search={result.monthlySearch} result={result}/>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
