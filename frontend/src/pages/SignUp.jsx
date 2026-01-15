import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { FcGoogle } from "react-icons/fc";
import logo from '../assets/logo.jpg'
import google from '../assets/google.jpg'
import axios from 'axios'
import { serverUrl } from '../App'
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../../utils/Firebase'
import { ClipLoader } from 'react-spinners'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Three.js Background Effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 5;

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 3000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: "#ffffff",
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    scene.add(particlesMesh);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Mouse interaction
      particlesMesh.rotation.y += mouseX * 0.0001;
      particlesMesh.rotation.x += mouseY * 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(serverUrl + "/api/auth/signup", { name, email, password, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      
      setFormSubmitted(true);
      setTimeout(() => {
        navigate("/");
        toast.success("SignUp Successfully");
      }, 2000);
      
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message);
    }
  };

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let user = response.user;
      let userName = user.displayName;
      let userEmail = user.email;

      const result = await axios.post(serverUrl + "/api/auth/googlesignup", { name: userName, email: userEmail, role }, { withCredentials: true });
      dispatch(setUserData(result.data));
      navigate("/");
      toast.success("SignUp Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Three.js Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black"
      />

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl flex overflow-hidden border border-white/20 animate-[fadeIn_0.5s_ease-out]">
          {/* Left Side - Form */}
          <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center gap-4 bg-white/95 relative">
            {/* Success Animation Overlay */}
            {formSubmitted && (
              <div className='absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center z-50 animate-[fadeIn_0.5s_ease-in-out] rounded-l-3xl'>
                <div className='text-white text-center animate-[slideUp_0.6s_ease-out]'>
                  <div className='text-6xl mb-4 animate-[bounce_1s_ease-in-out]'>✓</div>
                  <h2 className='text-2xl font-bold'>Welcome!</h2>
                  <p className='text-lg'>Account created successfully</p>
                </div>
              </div>
            )}

            <div className="text-center animate-[fadeInDown_0.6s_ease-out]">
              <h1 className="font-bold text-black text-3xl mb-2">
                Let's get Started
              </h1>
              <h2 className="text-gray-600 text-lg">Create your account</h2>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm animate-[slideInLeft_0.7s_ease-out] animate-delay-100">
              <label htmlFor="name" className="font-semibold text-sm">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="border-2 border-gray-300 w-full h-11 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition hover:border-gray-400"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm animate-[slideInLeft_0.7s_ease-out] animate-delay-200">
              <label htmlFor="email" className="font-semibold text-sm">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="border-2 border-gray-300 w-full h-11 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition hover:border-gray-400"
                placeholder="Your email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="flex flex-col gap-2 w-full max-w-sm relative animate-[slideInLeft_0.7s_ease-out] animate-delay-300">
              <label htmlFor="password" className="font-semibold text-sm">
                Password
              </label>
              <input
                id="password"
                type={show ? "text" : "password"}
                className="border-2 border-gray-300 w-full h-11 rounded-lg px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition hover:border-gray-400"
                placeholder="***********"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShow((prev) => !prev)}
              >
                {show ? <MdRemoveRedEye size={20} /> : <MdOutlineRemoveRedEye size={20} />}
              </button>
            </div>

            <div className="flex gap-4 w-full max-w-sm animate-[slideInLeft_0.7s_ease-out] animate-delay-400">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-full border-2 transition-all duration-300 ${
                  role === "student"
                    ? "border-purple-600 bg-purple-50 text-purple-600 scale-105"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
                onClick={() => setRole("student")}
              >
                Student
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-full border-2 transition-all duration-300 ${
                  role === "educator"
                    ? "border-purple-600 bg-purple-50 text-purple-600 scale-105"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
                onClick={() => setRole("educator")}
              >
                Educator
              </button>
            </div>

            <button
              className="w-full max-w-sm h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center transform hover:scale-105 active:scale-95 animate-[slideInLeft_0.7s_ease-out] animate-delay-500 shadow-lg"
              disabled={loading}
              onClick={handleSignUp}
            >
              {loading ? <ClipLoader size={24} color='white' /> : "Sign Up"}
            </button>

            <div className="w-full max-w-sm flex items-center gap-3 animate-[fadeIn_0.8s_ease-out] animate-delay-600">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            <button
              type="button"
              className="relative w-full max-w-sm h-12 bg-gradient-to-r from-blue-50 to-red-50 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-3 overflow-hidden group hover:border-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95 animate-[slideInLeft_0.7s_ease-out] animate-delay-700"
              onClick={googleSignUp}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/10 to-red-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <FcGoogle size={24} className="relative z-10" />
              <span className="relative z-10 text-base font-semibold text-gray-800">
                Continue with Google
              </span>
            </button>

            <div className="text-gray-600 text-sm animate-[fadeIn_0.9s_ease-out] animate-delay-800">
              Already have an account?{" "}
              <button
                type="button"
                className="text-purple-600 font-semibold hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>

          {/* Right Side - Branding */}
          <div className="hidden md:flex w-1/2 items-center justify-center flex-col bg-gradient-to-br from-purple-600 to-blue-600 text-white p-8 animate-[slideInRight_0.8s_ease-out]">
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm overflow-hidden animate-[float_3s_ease-in-out_infinite] shadow-2xl">
              <img src={logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-4xl font-bold mb-2 uppercase">decode verse 
               </h2>
            <h2 className="text-4xl font-bold mb-2 uppercase">
               COURSES</h2>
            <p className="text-center mt-4 text-white/80 max-w-xs text-sm">
              Join thousands of students learning from the best educators
              worldwide
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-delay-100 { animation-delay: 0.1s; }
        .animate-delay-200 { animation-delay: 0.2s; }
        .animate-delay-300 { animation-delay: 0.3s; }
        .animate-delay-400 { animation-delay: 0.4s; }
        .animate-delay-500 { animation-delay: 0.5s; }
        .animate-delay-600 { animation-delay: 0.6s; }
        .animate-delay-700 { animation-delay: 0.7s; }
        .animate-delay-800 { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
}

export default SignUp;
// import React, { useState } from 'react'
// import logo from '../assets/logo.jpg'
// import google from '../assets/google.jpg'
// import axios from 'axios'
// import { serverUrl } from '../App'
// import { MdOutlineRemoveRedEye } from "react-icons/md";

// import { MdRemoveRedEye } from "react-icons/md";
// import { useNavigate } from 'react-router-dom'
// import { signInWithPopup } from 'firebase/auth'
// import { auth, provider } from '../../utils/Firebase'
// import { ClipLoader } from 'react-spinners'
// import { toast } from 'react-toastify'
// import { useDispatch } from 'react-redux'
// import { setUserData } from '../redux/userSlice'
// function SignUp() {
//     const [name,setName]= useState("")
//     const [email,setEmail]= useState("")
//     const [password,setPassword]= useState("")
//     const [role,setRole]= useState("student")
//     const navigate = useNavigate()
//     let [show,setShow] = useState(false)
//     const [loading,setLoading]= useState(false)
//     let dispatch = useDispatch()

//     const handleSignUp = async () => {
//         setLoading(true)
//         try {
//             const result = await axios.post(serverUrl + "/api/auth/signup" , {name , email , password , role} , {withCredentials:true} )
//             dispatch(setUserData(result.data))

//             navigate("/")
//             toast.success("SignUp Successfully")
//             setLoading(false)
//         } 
//         catch (error) {
//             console.log(error)
//             setLoading(false)
//             toast.error(error.response.data.message)
//         }
        
//     }
//     const googleSignUp = async () => {
//         try {
//             const response = await signInWithPopup(auth,provider)
//             console.log(response)
//             let user = response.user
//             let name = user.displayName;
//             let email=user.email
            
            
//             const result = await axios.post(serverUrl + "/api/auth/googlesignup" , {name , email ,role}
//                 , {withCredentials:true}
//             )
//             dispatch(setUserData(result.data))
//             navigate("/")
//             toast.success("SignUp Successfully")
//         } catch (error) {
//             console.log(error)
//             toast.error(error.response.data.message)
//         }
        
//     }
//   return (
//     <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
//         <form className='w-[90%] md:w-200 h-150 bg-[white] shadow-xl rounded-2xl flex' onSubmit={(e)=>e.preventDefault()}>
//             <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-3 '>
//                 <div><h1 className='font-semibold text-[black] text-2xl'>Let's get Started</h1>
//                 <h2 className='text-[#999797] text-[18px]'>Create your account</h2>
//                 </div>
//                 <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
//                     <label htmlFor="name" className='font-semibold'>
//                         Name
//                     </label>
//                     <input id='name' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'placeholder='Your name' onChange={(e)=>setName(e.target.value)} value={name} />
//                 </div>
//                  <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3'>
//                     <label htmlFor="email" className='font-semibold'>
//                         Email
//                     </label>
//                     <input id='email' type="text" className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'placeholder='Your email' onChange={(e)=>setEmail(e.target.value)} value={email} />
//                 </div>
//                  <div className='flex flex-col gap-1 w-[80%] items-start justify-center px-3 relative'>
//                     <label htmlFor="password" className='font-semibold'>
//                         Password
//                     </label>
//                     <input id='password' type={show?"text":"password"} className='border-1 w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]' placeholder='***********' onChange={(e)=>setPassword(e.target.value)} value={password}/>
//                     {!show && <MdOutlineRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={()=>setShow(prev => !prev)}/>}
//               {show && <MdRemoveRedEye className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]' onClick={()=>setShow(prev => !prev)} />}
//                 </div>
//                  <div className='flex md:w-[50%] w-[70%] items-center justify-between'>
//                   <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${role === 'student' ? "border-black" : "border-[#646464]"}`} onClick={()=>setRole("student")}>Student</span>
//                   <span className={`px-[10px] py-[5px] border-[1px] border-[#e7e6e6] rounded-2xl  cursor-pointer ${role === 'educator' ? "border-black" : "border-[#646464]"}`}  onClick={()=>setRole("educator")}>Educator</span>
//                 </div>
//                 <button className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]' disabled={loading} onClick={handleSignUp}>{loading?<ClipLoader size={30} color='white' /> : "Sign Up"}</button>
             

//                 <div className='w-[80%] flex items-center gap-2'>
//                     <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
//                     <div className='w-[50%] text-[15px] text-[#6f6f6f] flex items-center justify-center '>Or continue with</div>
//                     <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
//                 </div>
//                 <div className='w-[80%] h-[40px] border-1 border-[black] rounded-[5px] flex items-center justify-center  ' onClick={googleSignUp} ><img src={google} alt="" className='w-[25px]' /><span className='text-[18px] text-gray-500'>oogle</span> </div>
//                  <div className='text-[#6f6f6f]'>Already have an account? <span className='underline underline-offset-1 text-[black]' onClick={()=>navigate("/login")}>Login</span></div>

//             </div>
//             <div className='w-[50%] h-[100%] rounded-r-2xl bg-[black] md:flex items-center justify-center flex-col hidden'><img src={logo} className='w-30 shadow-2xl' alt="" />
//             <span className='text-[white] text-2xl'>VIRTUAL COURSES</span>
//             </div>
           
//         </form>
     
//     </div>
//   )
// }

// export default SignUp
