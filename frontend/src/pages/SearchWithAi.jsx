import React, { useState } from 'react'
import ai from "../assets/ai.png"
import ai1 from "../assets/SearchAi.png"
import { RiMicAiFill } from "react-icons/ri";
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import start from "../assets/start.mp3"
import { FaArrowLeftLong } from "react-icons/fa6";
import { toast } from 'react-toastify';

function SearchWithAi() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const startSound = new Audio(start);

  // Text to speech function
  const speak = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Voice search handler
  const handleVoiceSearch = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error("Voice search not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    try {
      setListening(true);
      startSound.play();
      recognition.start();

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setInput(transcript);
        await searchCourses(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
        toast.error("Could not recognize speech. Please try again.");
      };

      recognition.onend = () => {
        setListening(false);
      };
    } catch (error) {
      setListening(false);
      toast.error("Voice search failed");
    }
  };

  // Search courses function
  const searchCourses = async (query) => {
    if (!query || query.trim() === '') {
      toast.warning("Please enter something to search");
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/ai/search`, 
        { input: query }, 
        { withCredentials: true }
      );
      
      setRecommendations(result.data);
      
      if (result.data.length > 0) {
        speak(`Found ${result.data.length} courses for you`);
        toast.success(`Found ${result.data.length} courses`);
      } else {
        speak("No courses found for your query");
        toast.info("No courses found. Try different keywords.");
      }
      
      setLoading(false);
      setListening(false);
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
      setListening(false);
      toast.error(error?.response?.data?.message || "Search failed");
    }
  };

  // Handle manual search
  const handleManualSearch = () => {
    searchCourses(input);
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#023047] via-[#126782] to-[#219ebc] text-white flex flex-col items-center px-4 py-12">
      
      {/* Header with back button */}
      <div className="w-full max-w-2xl mb-6">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors group"
        >
          <FaArrowLeftLong className='w-5 h-5 group-hover:-translate-x-1 transition-transform' />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Search Container */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <img src={ai} className='w-10 h-10' alt="AI" />
            Search with <span className='text-[#219ebc]'>AI</span>
          </h1>
          <p className="text-gray-500 text-sm">Discover courses tailored to your interests</p>
        </div>

        <div className="relative">
          <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-200 focus-within:border-[#219ebc] transition-all">
            <input
              type="text"
              className="flex-grow px-6 py-4 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none text-base"
              placeholder="What do you want to learn? (e.g., AI, Web Dev, Cloud...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={listening || loading}
            />
            
            {input && !listening && !loading && (
              <button
                onClick={handleManualSearch}
                className="absolute right-16 bg-[#219ebc] hover:bg-[#1a7a94] rounded-xl p-2 transition-all transform hover:scale-105 shadow-md"
                title="Search"
              >
                <img src={ai} className='w-8 h-8 p-1' alt="Search" />
              </button>
            )}

            <button
              className={`absolute right-3 rounded-xl w-11 h-11 flex items-center justify-center transition-all shadow-md ${
                listening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-[#219ebc] hover:bg-[#1a7a94] hover:scale-105'
              }`}
              onClick={handleVoiceSearch}
              disabled={loading}
              title={listening ? "Listening..." : "Voice Search"}
            >
              <RiMicAiFill className={`w-6 h-6 text-white ${listening ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {listening && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-[#219ebc] font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... Speak now
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="w-5 h-5 border-3 border-[#219ebc] border-t-transparent rounded-full animate-spin"></div>
                Searching courses...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 ? (
        <div className="w-full max-w-6xl mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center justify-center gap-3 mb-2">
              <img src={ai1} className="w-12 h-12 rounded-full bg-white p-2" alt="AI Results" />
              AI Search Results
            </h2>
            <p className="text-gray-200">Found {recommendations.length} courses matching your query</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#219ebc] group"
                onClick={() => navigate(`/viewcourse/${course._id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold group-hover:text-[#098355] transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-3 py-1 bg-[#219ebc] bg-opacity-10 text-[#219ebc] text-sm font-medium rounded-full">
                    {course.category}
                  </span>
                </div>

                <div className="mt-4 text-sm text-gray-500 group-hover:text-[#219ebc] transition-colors font-medium">
                  View Course →
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loading && !listening && (
        <div className="mt-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-gray-300">Try searching with different keywords or use voice search</p>
        </div>
      )}
    </div>
  );
}

export default SearchWithAi;




// import React, { useState } from 'react'
// import ai from "../assets/ai.png"
// import ai1 from "../assets/SearchAi.png"
// import { RiMicAiFill } from "react-icons/ri";
// import axios from 'axios';
// import { serverUrl } from '../App';
// import { useNavigate } from 'react-router-dom';
// import start from "../assets/start.mp3"
// import { FaArrowLeftLong } from "react-icons/fa6";
// function SearchWithAi() {
//   const [input, setInput] = useState('');
//   const [recommendations, setRecommendations] = useState([]);
//   const [listening,setListening] = useState(false)
//   const navigate = useNavigate();
//   const startSound = new Audio(start)
//   function speak(message) {
//     let utterance = new SpeechSynthesisUtterance(message);
//     window.speechSynthesis.speak(utterance);
//   }

//   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//   const recognition = new SpeechRecognition();

//   if (!recognition) {
//     console.log("Speech recognition not supported");
//   }

//   const handleSearch = async () => {

//     if (!recognition) return;
//     setListening(true)
//     startSound.play()
//     recognition.start();
//     recognition.onresult = async (e) => {
//       const transcript = e.results[0][0].transcript.trim();
//       setInput(transcript);
//       await handleRecommendation(transcript);
//     };
  
      
    
//   };

//   const handleRecommendation = async (query) => {
//     try {
//       const result = await axios.post(`${serverUrl}/api/ai/search`, { input: query }, { withCredentials: true });
//       setRecommendations(result.data);
//       if(result.data.length>0){
//  speak("These are the top courses I found for you")
//       }else{
//          speak("No courses found")
//       }
     
//       setListening(false)
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-16">
      
//       {/* Search Container */}
//       <div className="bg-white shadow-xl rounded-3xl p-6 sm:p-8 w-full max-w-2xl text-center relative">
//         <FaArrowLeftLong  className='text-[black] w-[22px] h-[22px] cursor-pointer absolute' onClick={()=>navigate("/")}/>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-600 mb-6 flex items-center justify-center gap-2">
//           <img src={ai} className='w-8 h-8 sm:w-[30px] sm:h-[30px]' alt="AI" />
//           Search with <span className='text-[#CB99C7]'>AI</span>
//         </h1>

//         <div className="flex items-center bg-gray-700 rounded-full overflow-hidden shadow-lg relative w-full ">
          
//           <input
//             type="text"
//             className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
//             placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
          
          
//           {input && (
//             <button
//               onClick={() => handleRecommendation(input)}
//               className="absolute right-14 sm:right-16 bg-white rounded-full"
//             >
//               <img src={ai} className='w-10 h-10 p-2 rounded-full' alt="Search" />
//             </button>
//           )}

//           <button
//             className="absolute right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center"
//             onClick={handleSearch}
//           >
//             <RiMicAiFill className="w-5 h-5 text-[#cb87c5]" />
//           </button>
//         </div>
//       </div>

//       {/* Recommendations */}
//       {recommendations.length > 0 ? (
//         <div className="w-full max-w-6xl mt-12 px-2 sm:px-4">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-white text-center flex items-center justify-center gap-3">
//             <img src={ai1} className="w-10 h-10 sm:w-[60px] sm:h-[60px] p-2 rounded-full" alt="AI Results" />
//             AI Search Results 
//           </h2>
       

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
//             {recommendations.map((course, index) => (
//               <div
//                 key={index}
//                 className="bg-white text-black p-5 rounded-2xl shadow-md hover:shadow-indigo-500/30 transition-all duration-200 border border-gray-200 cursor-pointer hover:bg-gray-200"
//                 onClick={() => navigate(`/viewcourse/${course._id}`)}
//               >
//                 <h3 className="text-lg font-bold sm:text-xl">{course.title}</h3>
//                 <p className="text-sm text-gray-600 mt-1">{course.category}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       ) : (
//         listening? <h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>Listening...</h1>:<h1 className='text-center text-xl sm:text-2xl mt-10 text-gray-400'>No Courses Found</h1>
       
//       )}
//     </div>
//   );
// }

// export default SearchWithAi;
