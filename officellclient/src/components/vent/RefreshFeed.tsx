import { useEffect } from "react";
import useVentStore from "../../store/ventStore";
import Cookies from 'js-cookie';
import useTrendingVentStore from "../../store/trendingventStore";
import useCompanyVentStore from "../../store/companyventStore";
import useProfileVentStore from "../../store/profileventStore";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { IoRefreshCircleOutline } from "react-icons/io5";

const RefreshFeed = () => {

        const refreshButton = useVentStore((state)=> state.refreshButton);
        const setRefreshButton = useVentStore((state)=> state.setRefreshButton);
        const vents = useVentStore((state) => state.vents);
        const refreshTrending = useTrendingVentStore((state)=> state.logout);
        const refreshFeed= useVentStore((state)=> state.logout);
        const refreshCompany = useCompanyVentStore((state)=> state.logout);
        const refreshProfile = useProfileVentStore((state)=> state.logout);
        const {pathname} = useLocation();

        const fetchDbVents = async()=>{
            try {
            const token =  Cookies.get("Auth");
            const headers={
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const lastCreatedAt = vents.sort((a , b  )=> a.createdAt > b.createdAt ? -1: 1)[0];
            const {data: response } = await axios.get(`${import.meta.env.VITE_API}/vents/count?lastcreatedAt=${lastCreatedAt.createdAt}`,{
                headers: headers,
                withCredentials: true
            });
            if (response.count_vents > 10){
                setRefreshButton(true)
            }
            } catch (error) {
                console.error(error);
            }
        }

        const handleRefresh = ()=>{
            refreshTrending();
            refreshFeed();
            refreshProfile();
            refreshCompany();
            setRefreshButton(false);
        }

    useEffect(()=>{
        setInterval(() => {
        if (vents.length > 0){
            fetchDbVents();
        }
        }, 100000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    
    return (
        <>
            { refreshButton && pathname != "/companies" &&
                <button
                onClick={handleRefresh}
                className="portrait:hidden w-55 border border-white text-white px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-white active:bg-white active:text-black hover:text-black transition duration-200 whitespace-nowrap"
                >
                New Feeds
                </button>
            }
            {refreshButton && pathname != "/companies" &&
            <button
            onClick={handleRefresh}
            className={` landscape:hidden items-center justify-center ms-3 mt-2 p-2 
                hover:bg-gray-800 active:scale-95 transition text-sm sm:hidden
                focus:outline-none focus:ring-2 focus:ring-gray-200 `}
            >
                <IoRefreshCircleOutline className="text-white w-full h-6 "/>
            </button>
            }
            </>
        )
}

export default RefreshFeed