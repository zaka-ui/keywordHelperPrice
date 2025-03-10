import { Building2, Link  } from "lucide-react";


const BusinessInfo = ({ name , project }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg backdrop-blur-sm border border-gray-700 
                shadow-lg space-y-4">
    <h2 className="text-xl font-semibold text-transparent bg-clip-text 
                 bg-gradient-to-r from-blue-400 to-purple-500">
      Enterprise information
    </h2>
    <div className="space-y-3">
      <div className="flex items-center space-x-3 text-gray-300">
        <Building2 className="h-5 w-5 text-blue-400" />
        <p>
          <span className="text-gray-400">Project name:</span>{' '}
          {name || 'N/A'}
        </p>
      </div>
     
      <div className="flex items-center space-x-3 text-gray-300">
        <Link className="h-5 w-5 text-purple-400" />
        <p>
          <span className="text-gray-400">Domaine name:</span>{' '}
          {project?.url || 'N/A'}
        </p>
      </div>
    
    </div>
  </div>
);

export default BusinessInfo;