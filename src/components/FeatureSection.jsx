import { ChartBarDecreasing, ChartNoAxesCombined, icons, MapPinHouse } from 'lucide-react';
import image1 from '../assets/images/image1.jpg';
import { useMainContext } from '../context/MainContext';
import { useNavigate } from 'react-router-dom';


const FeatureSection = ({checkProject}) => {
  const {setShowProjectForm, showProjectForm, showForm, results} = useMainContext();
  const route = useNavigate();
  
  const css = "relative overflow-hidden py-12 lg:py-16 z-50"
  return (
    <section className={showProjectForm  || showForm ? css.concat('z-0') : css }>

      <div className="absolute inset-0 bg-gradient-to-b from-[#2e326d] to-[#16172d] pointer-events-none opacity-5" />
      
      <div className="pmx-auto px-15 sm:px-6 lg:px-8 relative">
        <div className="flex  flex-wrap	 items-center justify-between	">
         
            <div className="w-full lg:w-2/5	">
            <div className="relative rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#2e326d]/10 to-transparent pointer-events-none" />
              <img
                src={image1}
                alt="SEO Keyword Analysis Dashboard"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
         
          {/*  */}
          <div className="w-full lg:w-1/2 ml-5 sm:mt-5 space-y-2">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-4xl font-bold text-[#2e326d] mb-4">
                Powerful SEO 
                <span className="bg-gradient-to-r from-[#2e326d] to-[#16172d] bg-clip-text text-transparent"> Keyword Analyzer</span>
              </h2>
              
              <p className="text-sm font-normal text-gray-600 h-[20vh]">
                Our advanced SEO keyword analyzer helps you uncover high-performing keywords
                that boost your website's organic traffic. Leverage real-time data and insights 
                on search volume, competition levels, and trending topics to enhance your content
                strategy.
                Make informed, data-driven decisions for maximum online visibility.
              </p>
              
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="inline-flex items-center cursor-pointer px-6 py-3 text-sm font-semibold text-white bg-[#2e326d] rounded-lg hover:bg-[#16172d] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => checkProject(results)}
              >
                Try Analyzer Now
              </button>
              <button onClick={()=> {route('/about')}} className="inline-flex items-center px-6 py-3 text-sm font-semibold text-[#2e326d] bg-gray-50 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>

        


        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            { title: 'Real-time Analysis', value: 'Instant keyword insights' , icons : <MapPinHouse /> },
            { title: 'Competition Metrics', value: 'Detailed competitor data' , icons :<ChartNoAxesCombined />},
            { title: 'Trending Topics', value: 'Stay ahead of the curve' , icons :<ChartBarDecreasing />},
          ].map((stat, index) => (
            <div key={index} className="bg-white/50  backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <h3 className="text-sm font-semibold text-[#2e326d] flex items-center gap-2"> {stat?.icons} {stat.title}</h3>
              
              <p className="mt-1 text-sm text-gray-600">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

