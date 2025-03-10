import { 
  PlusCircle, 
  MinusCircle, 
} from 'lucide-react';



const Input = ({ index, value, handleChange, onAdd, onRemove, isLast, disabled }) => (
  <div className="relative flex items-center space-x-2 mb-4 group" >
    <div className="absolute -left-8 text-xs text-blue-400 opacity-50">
      {String(index).padStart(2, '0')}
    </div>
    <input
      type="text"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder="Please enter keyword"
      className="w-full text-gray-900 border border-gray-800 rounded-lg px-4 py-3 h-10
                 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent outline-none transition-all duration-200
                 backdrop-blur-smi"
    />
     <span className="info absolute right-12 top-5 -translate-y-1/2 text-gray-500 cursor-pointer z-50">
                ?
                <span className="tooltip absolute  mt-2 h-15 w-64 bg-gray-900 text-white text-sm rounded-md shadow-lg p-2 hidden z-50">
                  Please insert the keyword with no location.
                </span>
      </span>
    <div className="flex space-x-2">
      {isLast ? (
        <button
          onClick={onAdd}
          disabled={disabled}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      ) : (
        <button
          onClick={onRemove}
          disabled={disabled}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <MinusCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  </div>
);

export default Input;