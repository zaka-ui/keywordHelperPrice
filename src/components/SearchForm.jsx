const formInputs = {
    'login' : [
        {
            label: 'Email address',
            name: 'email',
            type : 'email',
        },
        {
            label: 'password',
            name : 'password',
            type : 'password',
        }
    ],

};



export default function SearchForm () {

    const handleSearch = (e) => {
        e.preventDefault();
    }
    return (
    <div className="w-2/6 m-auto flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rounded-md">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Search</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut dolores hic alias blanditiis sapiente iste mollitia! Voluptatibus dicta id necessitatibus esse dolorum temporibus eius rem velit, aspernatur nam alias vitae?
            </p>
          </div>  
          <form className="mt-8 space-y-6" onSubmit={handleSearch}>
            <div className="rounded-md shadow-sm space-y-4">
                {formInputs[state].map((f) => {
                    return (
                        <div className="relative">
                            <label htmlFor="email" className="sr-only">{f.label}</label>
                            <i className="fas fa-envelope absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                            <input
                                type={f.type}
                                name={f.type}
                                className={Object.entries(errors).length > 0 ? inputClass.concat('border-2 border-rose-600') : inputClass}
                                placeholder={f.name}
                                disabled={inProcess}
                            />
                            {errors && (
                                <div className="mt-2 text-sm text-red-500">
                                    {errors[f.type]}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
  
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#111569] focus:ring-[#111569] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900"> Remember me</label>
                </div> 
                <div className="text-sm" onClick={() => { 
                        setOldState(state)
                        setStates('forgotPassword')
                    }}>
                        <a href="#" className="font-medium text-[#111569] hover:text-opacity-80">
                            Forgot your password?
                        </a>
                </div> 
            </div>
  
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#111569] hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#111569]"
              >
                submit
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </form>
        </div>
    </div>)
}