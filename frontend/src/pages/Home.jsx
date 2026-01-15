import React, { useRef, useMemo, useEffect } from 'react'
import home from "../assets/home1.jpg"
import Nav from '../components/Nav'
import { SiViaplay } from "react-icons/si"
import Logos from '../components/Logos'
import Cardspage from '../components/Cardspage'
import ExploreCourses from '../components/ExploreCourses'
import About from '../components/About'
import ai from '../assets/ai.png'
import ai1 from '../assets/SearchAi.png'
import ReviewPage from '../components/ReviewPage'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'

function Home() {
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  
  // Simple Three.js background with floating particles
  useEffect(() => {
    if (!canvasRef.current) return
    
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    })
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5
    
    // Create simple floating particles
    const particleCount = 800
    const positions = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: '#ffffff',
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true
    })
    
    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    
    // Simple lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)
    
    // Animation
    let animationId
    const clock = new THREE.Clock()
    
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      
      particles.rotation.y = time * 0.05
      particles.rotation.x = Math.sin(time * 0.1) * 0.1
      
      renderer.render(scene, camera)
    }
    
    animate()
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div className='w-[100%] overflow-hidden relative'>
      
      {/* Subtle Three.js background */}
      <canvas
        ref={canvasRef}
        className='fixed top-0 left-0 w-full h-full -z-10 pointer-events-none'
        style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
      />
      
      <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
        <Nav/>
        
        <img 
          src={home} 
          className='object-cover md:object-fill w-[100%] lg:h-[100%] h-[50vh]' 
          alt="Decode Learning Platform" 
        />
        
        {/* Hero text */}
        <span className='lg:text-[70px] absolute md:text-[40px] lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] drop-shadow-2xl'>
          Grow Your Skills to Advance 
        </span>
        
        <span className='lg:text-[70px] text-[20px] md:text-[40px] absolute lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold drop-shadow-2xl'>
          Your Career Path
        </span>
        
        {/* Buttons with subtle hover effects */}
        <div className='absolute lg:top-[30%] top-[75%] md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap'>
          
          <button 
            className='px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm lg:bg-white/10' 
            onClick={() => navigate("/allcourses")}
          >
            View all Courses 
            <SiViaplay className='w-[30px] h-[30px] lg:fill-white fill' />
          </button>
          
          <button 
            className='px-[20px] py-[10px] lg:bg-white bg-blue lg:text-black text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl ' 
            onClick={() => navigate("/searchwithai")}
          >
            Search with AI 
            <img src={ai} className='w-[30px] h-[30px] rounded-full hidden lg:block' alt="AI" />
            <img src={ai1} className='w-[35px] h-[35px] rounded-full lg:hidden' alt="AI" />
          </button>
        </div>
      </div>
      
      {/* Other components */}
      <div className='relative bg-white'>
        <Logos/>
        <ExploreCourses/>
        <Cardspage/>
        <About/>
        <ReviewPage/>
        <Footer/>
      </div>
    </div>
  )
}

export default Home
// import React, { useRef, useMemo } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei'
// import { motion } from 'framer-motion'
// import { SiViaplay } from "react-icons/si"

// // Animated 3D Background Spheres
// function AnimatedSphere({ position, color, speed }) {
//   const meshRef = useRef()
  
//   useFrame((state) => {
//     meshRef.current.rotation.x = state.clock.elapsedTime * speed
//     meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
//     meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3
//   })

//   return (
//     <Float speed={2} rotationIntensity={1} floatIntensity={2}>
//       <Sphere ref={meshRef} args={[1, 64, 64]} position={position} scale={0.8}>
//         <MeshDistortMaterial
//           color={color}
//           attach="material"
//           distort={0.4}
//           speed={2}
//           roughness={0.2}
//           metalness={0.8}
//         />
//       </Sphere>
//     </Float>
//   )
// }

// // Particle System
// function Particles() {
//   const points = useRef()
  
//   const particlesPosition = useMemo(() => {
//     const positions = new Float32Array(2000 * 3)
//     for (let i = 0; i < 2000; i++) {
//       positions[i * 3] = (Math.random() - 0.5) * 25
//       positions[i * 3 + 1] = (Math.random() - 0.5) * 25
//       positions[i * 3 + 2] = (Math.random() - 0.5) * 25
//     }
//     return positions
//   }, [])

//   useFrame((state) => {
//     points.current.rotation.y = state.clock.elapsedTime * 0.05
//     points.current.rotation.x = state.clock.elapsedTime * 0.03
//   })

//   return (
//     <points ref={points}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={particlesPosition.length / 3}
//           array={particlesPosition}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
//     </points>
//   )
// }

// function Scene() {
//   return (
//     <>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[10, 10, 5]} intensity={1} />
//       <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
      
//       <AnimatedSphere position={[-4, 0, -5]} color="#4f46e5" speed={0.3} />
//       <AnimatedSphere position={[4, 2, -5]} color="#06b6d4" speed={0.4} />
//       <AnimatedSphere position={[0, -2, -6]} color="#8b5cf6" speed={0.35} />
      
//       <Particles />
      
//       <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
//     </>
//   )
// }

// function Home() {
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//         delayChildren: 0.3
//       }
//     }
//   }

//   const itemVariants = {
//     hidden: { y: 50, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 12
//       }
//     }
//   }

//   return (
//     <div className='w-full overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen'>
//       <div className='w-full lg:h-screen h-[70vh] relative'>
//         {/* Navigation placeholder */}
//         <div className='absolute top-0 left-0 w-full z-50 p-6'>
//           <div className='text-white text-2xl font-bold'>Your Logo</div>
//         </div>
        
//         {/* Background gradient */}
//         <div className='absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-cyan-900/40'></div>
        
//         {/* 3D Canvas Background */}
//         <div className='absolute top-0 left-0 w-full h-full'>
//           <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
//             <Scene />
//           </Canvas>
//         </div>

//         {/* Overlay gradient */}
//         <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-transparent to-black/40'></div>
        
//         {/* Hero Content */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className='absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-10'
//         >
//           <motion.h1 
//             variants={itemVariants}
//             className='lg:text-7xl md:text-5xl text-3xl text-white font-bold text-center px-4 mb-4'
//             style={{
//               textShadow: '0 0 40px rgba(99, 102, 241, 0.5), 0 0 80px rgba(99, 102, 241, 0.3)'
//             }}
//           >
//             Grow Your Skills to Advance
//           </motion.h1>
          
//           <motion.h2 
//             variants={itemVariants}
//             className='lg:text-7xl md:text-5xl text-3xl text-white font-bold text-center px-4 mb-12'
//             style={{
//               textShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3)'
//             }}
//           >
//             Your Career Path
//           </motion.h2>
          
//           <motion.div 
//             variants={itemVariants}
//             className='flex items-center justify-center gap-4 flex-wrap px-4'
//           >
//             <motion.button 
//               whileHover={{ 
//                 scale: 1.05, 
//                 boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)",
//                 borderColor: "rgba(139, 92, 246, 1)"
//               }}
//               whileTap={{ scale: 0.95 }}
//               className='px-6 py-3 border-2 border-white/50 text-white rounded-xl text-lg font-medium flex items-center gap-2 cursor-pointer backdrop-blur-md bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg' 
//             >
//               View all Courses 
//               <SiViaplay className='w-6 h-6 fill-white' />
//             </motion.button>
            
//             <motion.button 
//               whileHover={{ 
//                 scale: 1.05, 
//                 boxShadow: "0 0 30px rgba(255, 255, 255, 0.8)",
//                 backgroundColor: "#f3f4f6"
//               }}
//               whileTap={{ scale: 0.95 }}
//               className='px-6 py-3 bg-white text-slate-900 rounded-xl text-lg font-medium flex items-center gap-2 cursor-pointer hover:bg-gray-100 transition-all duration-300 shadow-xl' 
//             >
//               Search with AI 
//               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
//               </svg>
//             </motion.button>
//           </motion.div>

//           {/* Floating elements indicator */}
//           <motion.div
//             variants={itemVariants}
//             className='absolute bottom-10 left-1/2 transform -translate-x-1/2'
//           >
//             <motion.div
//               animate={{ y: [0, 10, 0] }}
//               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//               className='text-white/70 text-sm flex flex-col items-center gap-2'
//             >
//               <span>Scroll to explore</span>
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//               </svg>
//             </motion.div>
//           </motion.div>
//         </motion.div>
//       </div>
      
//       {/* Additional sections placeholder */}
//       <div className='relative z-20 bg-gradient-to-b from-slate-800 to-slate-900 py-20'>
//         <div className='text-center text-white/80 max-w-4xl mx-auto px-4'>
//           <h3 className='text-3xl font-bold mb-4'>Your other components go here</h3>
//           <p className='text-lg'>Logos, ExploreCourses, Cardspage, About, ReviewPage, Footer components...</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Home
//2nd : innovation 


// import React from 'react'
// import home from "../assets/home1.jpg"
// import Nav from '../components/Nav'
// import { SiViaplay } from "react-icons/si";
// import Logos from '../components/Logos';
// import Cardspage from '../components/Cardspage';
// import ExploreCourses from '../components/ExploreCourses';
// import About from '../components/About';
// import ai from '../assets/ai.png'
// import ai1 from '../assets/SearchAi.png'
// import ReviewPage from '../components/ReviewPage';
// import Footer from '../components/Footer';
// import { useNavigate } from 'react-router-dom';
// function Home() {
//       const navigate = useNavigate()

//   return (

    
    
//     <div className='w-[100%] overflow-hidden'>
      
//       <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
//         <Nav/>
//         <img src={home} className='object-cover md:object-fill   w-[100%] lg:h-[100%] h-[50vh]' alt="" />
//         <span className='lg:text-[70px] absolute  md:text-[40px]  lg:top-[10%] top-[15%] w-[100%] flex items-center justify-center text-white font-bold text-[20px] '>
//           Grow Your Skills to Advance 
//         </span>
//         <span className='lg:text-[70px] text-[20px] md:text-[40px] absolute lg:top-[18%] top-[20%] w-[100%] flex items-center justify-center text-white font-bold'>
//           Your Career path
//         </span>
//         <div className='absolute lg:top-[30%] top-[75%]  md:top-[80%] w-[100%] flex items-center justify-center gap-3 flex-wrap'>
          
//       <button className='px-[20px] py-[10px] border-2 lg:border-white border-black lg:text-white text-black rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer' onClick={()=>navigate("/allcourses")}>View all Courses <SiViaplay className='w-[30px] h-[30px] lg:fill-white fill-black' /></button>
//       <button className='px-[20px] py-[10px] lg:bg-white bg-black lg:text-black text-white rounded-[10px] text-[18px] font-light flex gap-2 cursor-pointer items-center justify-center' onClick={()=>navigate("/searchwithai")}>Search with AI <img src={ai} className='w-[30px] h-[30px] rounded-full hidden lg:block' alt="" /><img src={ai1} className='w-[35px] h-[35px] rounded-full lg:hidden' alt="" /></button>
//       </div>
//       </div>
//       <Logos/>
//       <ExploreCourses/>
//       <Cardspage/>
//       <About/>
//       <ReviewPage/>
//       <Footer/>

      
      
      
//     </div>

//   ) 
// }

// export default Home
