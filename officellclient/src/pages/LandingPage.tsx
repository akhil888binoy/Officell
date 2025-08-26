import { Link } from "react-router-dom";
import DecryptedText from "../styles/DecryptedText"
import ScrambledText from "../styles/ScrambledText";

export const LandingPage=()=>{
    return(
        <div className="bg-gray-950 w-screen h-screen">
            <div className="flex">
                <div className="lg:ml-3">
                    <DecryptedText
                        text="⟢ OFFICELL"
                        className="text-5xl sm:text-4xl md:text-6xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.07em]"
                        encryptedClassName="text-5xl sm:text-4xl md:text-6xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.09em]"
                        parentClassName="mt-6 sm:mt-10 ml-4 sm:ml-10"
                        animateOn="view"
                        speed={75}
                        characters="ABCDEFGHIJKLMNOPQRST"
                        maxIterations={20}
                    />
                </div>
            </div> 
            <div className="mt-10 flex flex-col leading-[0.9] ">
                <div className="mt-10 " > 
                    <DecryptedText
                    text="SPILL THE TEA"
                    className="lg:text-[250px]  text-[100px]  font-arimo font-medium dark:text-white tracking-[-0.1em] lg:ml-2 "
                    encryptedClassName="lg:text-[200px] text-[80px] font-arimo text-white font-medium "
                    parentClassName="mt-10"
                    animateOn="view"
                    speed={75}
                    characters="ABCDEFG"      
                    maxIterations={20}
                    />
                </div>
                <div className="flex flex-row  justify-center items-center " >
                        <div className="flex flex-col leading-[0.9]">
                            <h1 className="lg:text-[160px] text-[80px] font-arimo font-medium dark:text-white ">N</h1>
                            <h1 className="lg:text-[160px] text-[80px] font-arimo font-medium dark:text-white">N</h1>
                        </div>
                        <Link to={`/login`}>
                        <div className="lg:w-69 lg:h-70 w-20 h-30 border-white lg:border-[18px] border-[10px] rounded-full 
                            flex items-center justify-center hover:bg-white  active:bg-white transition cursor-pointer group">
                        <span className="lg:text-2xl text-[10px] font-bold uppercase text-white group-hover:text-black group-active:text-black">
                            Get in
                        </span>
                        </div>
                </Link>
          

            <div className="flex flex-col leading-[0.9]">
                <ScrambledText
                    className="lg:text-[160px] text-[80px]  font-arimo font-medium dark:text-white tracking-[-0.09em] lg:mr-[100px]"
                    radius={100}
                    duration={1.2}
                    speed={0.5}
                    scrambleChars=".:"   
                    >
                    NAME
                </ScrambledText>

                <h1 className="lg:text-[160px] text-[80px] font-arimo font-medium dark:text-white tracking-[-0.09em]">
                    SHAME
                </h1>
            </div>

                </div>             
            </div>
        </div>
    )
}