import { Link } from "react-router-dom";
import DecryptedText from "../styles/DecryptedText"
import ScrambledText from "../styles/ScrambledText";

export const LandingPage=()=>{
    return(
        <div className="bg-gray-950 w-screen min-h-screen overflow-x-hidden">
            <div className="flex">
                <div className="lg:ml-3">
                    <DecryptedText
                        text="⟢ OFFICELL"
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.07em]"
                        encryptedClassName="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.09em]"
                        parentClassName="mt-4 sm:mt-6 lg:mt-6 ml-4 sm:ml-10"
                        animateOn="view"
                        speed={75}
                        characters="ABCDEFGHIJKLMNOPQRST"
                        maxIterations={20}
                    />
                </div>
            </div> 
            <div className="mt-4 sm:mt-6 lg:mt-10 flex flex-col leading-[0.9] px-2 sm:px-0">
                <div className="mt-4 sm:mt-6 lg:mt-10" > 
                    <DecryptedText
                    text="SPILL THE TEA"
                    className="text-[60px] landscape:text-[160px] sm:text-[80px] md:text-[120px] lg:text-[200px] xl:text-[250px] font-arimo font-medium dark:text-white tracking-[-0.1em] lg:ml-2"
                    encryptedClassName="text-[50px] landscape:text-[160px] sm:text-[70px] md:text-[100px] lg:text-[180px] xl:text-[200px] font-arimo text-white font-medium"
                    parentClassName="mt-4 sm:mt-6 lg:mt-10"
                    animateOn="view"
                    speed={75}
                    characters="ABCDEFG"      
                    maxIterations={20}
                    />
                </div>
                <div className="flex flex-row justify-center items-center gap-2 sm:gap-4 lg:gap-6" >
                    
                    <div className="flex flex-col leading-[0.9]">
                        <h1 className="text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] xl:text-[160px] font-arimo font-medium dark:text-white">N</h1>
                        <h1 className="text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] xl:text-[160px] font-arimo font-medium dark:text-white">N</h1>
                    </div>
                    <Link to={`/login`}>
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-64 lg:h-64 xl:w-72 xl:h-72 border-white border-[8px] sm:border-[10px] lg:border-[16px] xl:border-[18px] rounded-full 
                            flex items-center justify-center hover:bg-white active:bg-white transition cursor-pointer group">
                            <span className="text-[8px] sm:text-[10px] md:text-sm lg:text-xl xl:text-2xl font-bold uppercase text-white group-hover:text-black group-active:text-black">
                                Get in
                            </span>
                        </div>
                    </Link>

                    <div className="relative inline-block min-w-[20ch]">
                        <ScrambledText
                            className="text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] xl:text-[160px] font-arimo font-medium dark:text-white tracking-[-0.09em]"
                            radius={100}
                            duration={1.2}
                            speed={0.5}
                            scrambleChars=".:"   
                        >
                            NAME
                        </ScrambledText>

                        <h1 className="text-[50px] sm:text-[70px] md:text-[100px] lg:text-[130px] xl:text-[160px] font-arimo font-medium dark:text-white tracking-[-0.09em]">
                            SHAME
                        </h1>
                    </div>
                </div>             
            </div>
        </div>
    )
}