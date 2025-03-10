import { 
  ChevronLeft,
} from 'lucide-react';


const Header = ({ onBack , goHistory}) => (
  <div className="flex items-center justify-between bg-gray-800/50 p-6 rounded-lg 
                backdrop-blur-sm border border-gray-700 shadow-lg">
    <div className="flex items-center justify-center">
    <button
      onClick={onBack}
      className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
               text-blue-400 hover:bg-blue-600/30 transition-all duration-200 mr-2"
    >
      <ChevronLeft className="mr-2 h-5 w-5" />
      Retourner
    </button>
    <button
      onClick={goHistory}
      className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
               text-blue-400 hover:bg-blue-600/30 transition-all duration-200"
    >
      Aller à l historique
    </button>
    </div>
  </div>
);


export default Header;