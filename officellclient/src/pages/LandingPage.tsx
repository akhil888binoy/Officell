import { useNavigate } from "react-router-dom";
import DecryptedText from "../styles/DecryptedText"
import ScrollVelocity from "../styles/ScrollVelocity";
import { useState } from "react";

export const LandingPage = () => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const wallet = "officell";

    const handleCopy = () => {
        navigator.clipboard.writeText(wallet);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
    <div className="bg-gray-950 w-screen min-h-screen">
    <div className="flex items-center justify-between ">
    {/* LEFT: Officell Text */}
    <DecryptedText
        text="⟢ OFFICELL"
        className="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.07em]"
        encryptedClassName="text-3xl sm:text-4xl md:text-5xl lg:text-[70px] font-arimo text-white font-bold tracking-[-0.09em]"
        parentClassName=""
        animateOn="view"
        speed={75}
        characters="ABCDEFGHIJKLMNOPQRST"
        maxIterations={20}
    />
    {/* RIGHT: Punch In Button */}
    <button
        onClick={() => navigate("/login")}
        className="
            lg:text-5xl text-3xl
            lg:px-10 px-6
            lg:py-2 py-1.5
            bg-white text-gray-950
            font-arimo font-bold tracking-[-0.07em]
            hover:bg-gray-950 hover:text-white
        "
    >
        Punch In.
    </button>

</div>



                        <div className="relative w-full mt-10 flex items-center justify-center overflow-x-hidden">

                    <ScrollVelocity
                        texts={['SPILL THE TEA', 'NO NAME . NO SHAME .']}
                        velocity={100}
                        className="
                            custom-scroll-text font-arimo text-white font-bold tracking-[-0.07em]
                            text-[200px]
                            sm:text-[120px]
                            md:text-[180px]
                            lg:text-[260px]
                            xl:text-[330px]
                            leading-[1]
                            whitespace-nowrap
                        "
                    />
                </div>
        <div className="mt-8 flex justify-center">
                <button
                    onClick={handleCopy}
                    className="text-white font-arimo text-xl tracking-wide opacity-80 flex items-center gap-2 hover:opacity-100"
                >
                    Founder's wallet: {wallet}
                    <span className="text-lg">📋</span>

                    {copied && (
                        <span className="text-white text-lg  animate-fade">
                            Copied!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
};

