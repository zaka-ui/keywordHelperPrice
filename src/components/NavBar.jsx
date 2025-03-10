import { useMainContext } from '../context/MainContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/images/logo.png'

export default function NavBar ()  {
    const navigate = useNavigate();
    const location = useLocation();
    const {showForm, setShowForm, token, setToken, userData ,setUserData, setApiCredentials , setStates} = useMainContext();
    const [isOpen, setIsOpen] = useState(false);
     const links = [
        {
            name: 'Home',
            incone: '',
            action : () => navigate('/'),
            cssClasses : location.pathname  === '/' && !showForm ? 'font-bold bg-white px-5 py-2 rounded z-50 text-black ' : 'text-white',
            path : '/'
        },
        {
            name : 'Connexion',
            icon : '',
            action : () =>  {
              setStates('login');
              setShowForm(true);
            },
            cssClasses : showForm ?  'font-bold bg-white text-black px-5 py-2 rounded z-50 ' : 'text-white',
        },
        {
            name : token  ? 'Projects' : '',
            icon : '',
            action: () => navigate('/'.concat(`${userData.name}/projects`), { replace: true }),
            cssClasses : !token ?  'hidden' : 'opacity-1 cursor-pointer text-white'  
        },{
          name : 'Profile',
          icon : '',
          action : () =>  {
            navigate('/profile')
          },
          cssClasses : token
          ? location.pathname === '/profile'
            ? 'font-bold bg-white text-black px-5 py-2 rounded z-50 '
            : 'text-white'
          : 'hidden'
       },
        {
            name : 'Logout',
            icon : '',
            action : () =>  {
              localStorage.removeItem('token');
              localStorage.removeItem('userData');
              setToken('');
              setUserData({});
              setApiCredentials({});
              navigate('/');
            },
            cssClasses : token ?  'opacity-1 cursor-pointer text-white' : 'hidden '
        },
      
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
    <nav className=" backdrop-blur-sm z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-[15vh] pt-10">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            {!showForm && logo && (
              <img 
              src={logo} 
              alt="Logo"
              className="w-20  sm:w-40 lg:w-60"
            />
            )}
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            {links.map((link, index) => (
              (link.name !== 'Connexion' || !token) && (
                <li 
                  key={index} 
                  className={`${link.cssClasses} hover:text-gray-600 transition-colors duration-200`
                }
                  onClick={() => link.action()}
                >
                  <a className="text-sm font-medium cursor-pointer">{link.name}</a>
                </li>
              )
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-full bg-white transform transition-all duration-300 ${isMenuOpen ? 'text-black rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white transition-all duration-300 ${isMenuOpen ? 'text-black opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-full bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
        >
          <ul className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link, index) => (
              (link.name !== 'Connexion' || !token) && (
                <li 
                  key={index}
                  className={`${link.cssClasses} transition-colors duration-200 block`}
                  onClick={() => {
                    link.action();
                    setIsMenuOpen(false);
                  }}
                >
                  <a className={link.path === location.pathname ?
                    "block px-3 py-2 text-base font-medium  transition-colors duration-200 rounded-md cursor-pointer".concat('font-bold')
                    : 'block px-3 py-2 text-base font-medium transition-colors duration-200 rounded-md cursor-pointer'
                  }>
                    {link.name}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
  
}