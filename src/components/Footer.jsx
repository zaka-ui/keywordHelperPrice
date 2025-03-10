export default function Footer() {
    return (
      <footer className="pb-10 bg-[#111569] text-white border-t border-gray-200 pt-8 px-4 sm:px-8 lg:px-20 bg-gradient-to-l from-custom-blue to-custom-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Contact Us Section 
           <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Contact Us</h3>
            <p className="text-gray-300">Email: <a href="mailto:info@seoanalyzer.com" className="text-blue-400 hover:text-blue-600">info@seoanalyzer.com</a></p>
            <p className="text-gray-300">Phone: <a href="tel:+15551234567" className="text-blue-400 hover:text-blue-600">(555) 123-4567</a></p>
          </div>
          */}
         
  
          {/* Quick Links Section
          <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 text-gray-300 transition-colors duration-200">Features</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 text-gray-300 transition-colors duration-200">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 text-gray-300 transition-colors duration-200">Documentation</a>
              </li>
            </ul>
          </div>
          */}
          
  
          {/* Follow Us Section 
           <div className="space-y-4">
            <h3 className="font-semibold text-xl mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors duration-200">Twitter</a>
              <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors duration-200">LinkedIn</a>
              <a href="#" className="text-gray-300 hover:text-blue-600 transition-colors duration-200">Facebook</a>
            </div>
          </div>
          
          */}
         
        </div>
  
        {/* Bottom Copyright Section */}
        <div className="text-center mt-8 pt-8  text-gray-300">
          <p className="text-sm">
            &copy; 2024 SEO Keyword Helper. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }
  