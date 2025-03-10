import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Form from './components/Form';
import { useMainContext } from './context/MainContext';

const AboutPage = () => {
  const {showForm} = useMainContext();
  const headerCss = 'bg-[#111569] z-50 w-[100%] relative opacity-0.5 \
    transition-width duration-500 ease-in-out bg-gradient-to-l from-custom-blue \
    to-custom-dark bg-[length:200%_100%] animate-gradient-x"';

    return (
    <div className={`${headerCss} in-h-screen bg-slate-900 text-white`}>
      {/* Navigation */}
      <NavBar />

      {showForm &&  <Form myState={"login"} />}
      {/* Main Content */}
      <main className="max-w-6xl mx-auto mt-20 px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">About Keyword Analyser</h1>
          <p className="text-xl">
            Where Your Business Meets Opportunity Through Advanced SEO Analytics
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white/5 p-8 rounded-lg mb-12 backdrop-blur">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            At Keyword Analyser, we're dedicated to empowering businesses with cutting-edge SEO tools and analytics. 
            Our platform is designed to help you make data-driven decisions that boost your online visibility 
            and drive organic growth.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Real-time Analysis',
              description: 'Get instant insights into keyword performance, search volumes, and trending patterns to optimize your content strategy.'
            },
            {
              title: 'Competition Metrics',
              description: 'Stay ahead of your competitors with detailed analysis of their keyword strategies and market positioning.'
            },
            {
              title: 'Trending Topics',
              description: 'Discover emerging trends and opportunities in your industry to keep your content relevant and engaging.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white/5 p-6 rounded-lg backdrop-blur">
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

      </main>
    

      {/* Footer */}
      <Footer />

      <div className="area w-screen z-[-1] h-screen opacity-0.5" >
                <ul className="circles z-0">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div >
    </div>
  );
};

export default AboutPage;