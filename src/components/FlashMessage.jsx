const FlashMessage = ({ message, type }) => {
    if (!message) return null;
  
    let messageClasses = "px-4 py-2 rounded-md text-sm font-semibold transition-all duration-500 ease-in-out";
  
    if (type === "success") {
      messageClasses += " bg-green-100 text-green-800";
    } else if (type === "error") {
      messageClasses += " bg-red-100 text-red-800";
    } else if (type === "info") {
      messageClasses += " bg-blue-100 text-blue-800";
    }
  
    return (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 opacity-100 ${message ? "opacity-100" : "opacity-0"} ${messageClasses}`}
        style={{ maxWidth: "90%", zIndex: 1000 }}
      >
        <div className={`text-center m-auto`}>
          {message}
        </div>
      </div>
    );
  };
  
  export default FlashMessage;
  