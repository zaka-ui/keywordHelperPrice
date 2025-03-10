import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleSuggestions = 3;
  if (!suggestions || !Array.isArray(suggestions) || suggestions.length <= 1) {
    return (
      <span className="text-gray-500 italic">
        No suggestions available
      </span>
    );
  }

  // Format the data to include only necessary information
  const formattedSuggestions = suggestions?.filter((item) => item?.keyword_difficulty_for_local_seo < 150 ).map(item => ({
    keyword: item.keyword,
    searches: item.search_volume,
    competition: item.keyword_difficulty_for_local_seo,
  }));

  const visibleSuggestions = isExpanded
    ? formattedSuggestions
    : formattedSuggestions.slice(0, maxVisibleSuggestions);

  return (
    <div className="space-y-2">
      <ul className="space-y-1">
        { formattedSuggestions.length > 0 ?
	  visibleSuggestions.map((suggestion, index) => (
          <li
            key={`${suggestion.keyword}-${index}`}
            className="text-sm hover:bg-gray-50   rounded p-1 flex  gap-2 "
          >

           <input type="checkbox" name="choseKeyword"  />		  
            <div className="flex items-center justify-start space-x-2">
              <span className='hover:text-gray-500'>{suggestion?.keyword}</span>
              <span className="text-xs text-gray-500">
                ({suggestion?.searches}/month)
              </span>
              {
                <span className="text-xs text-gray-500">
                ({
                   suggestion?.competition < 50 ? "Facile " 
                 : suggestion.competition  > 50 && suggestion.competition < 100 ? "Facile "
                 : suggestion.competition > 100 && suggestion.competition < 150 ? "concurenciel " 
                 : "Trés concurenciel "} )
                </span>

              }
            </div>
          </li>
        ))  : <span  className="text-gray-500 italic"> No suggestions available </span> }
      </ul>
      
      {formattedSuggestions.length > maxVisibleSuggestions && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 w-4 h-4" />
            </>
          ) : (
            <>
              Show More ({formattedSuggestions.length - maxVisibleSuggestions} more) <ChevronDown className="ml-1 w-4 h-4" />
            </>
          )}
        </button>
      )
	      
    
      }
    </div>
  );
};

export default SuggestionsList;
