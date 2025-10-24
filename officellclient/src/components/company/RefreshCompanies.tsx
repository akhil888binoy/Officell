import { useEffect } from "react";
import Cookies from 'js-cookie';
import useCompanyStore from "../../store/companyStore";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { IoRefreshCircleOutline } from "react-icons/io5";

const RefreshCompanies = () => {

        const refreshButton = useCompanyStore((state)=> state.refreshButton);
        const setRefreshButton = useCompanyStore((state)=> state.setRefreshButton);
        const companies = useCompanyStore((state) => state.companies);
        const refreshCompanies = useCompanyStore((state)=> state.logout);
        const {pathname} = useLocation();

        const fetchDbCompanies = async()=>{
            try {
            const token =  Cookies.get("Auth");
            const headers={
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
    
            const lastCreatedAt = companies.sort((a,b)=> a.createdAt > b.createdAt ? -1: 1)[0];
            const {data: response } = await axios.get(`${import.meta.env.VITE_API}/companies/count?lastcreatedAt=${lastCreatedAt.createdAt}`,{
                headers: headers,
                withCredentials: true
            });
            if (response.count_companies > 10){
                setRefreshButton(true)
            }
            } catch (error) {
                console.error(error);
            }
        }
        const handleRefresh = ()=>{
            refreshCompanies();
            setRefreshButton(false);
        }
        
    useEffect(()=>{
        setInterval(() => {
        if (companies.length > 0){
            fetchDbCompanies();
        }
        }, 100000);
    },[]);
    
    return (
        <>
            { refreshButton && pathname =="/companies" &&
                <button
                onClick={handleRefresh}
                className="w-55 border border-white text-white px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-white active:bg-white active:text-black hover:text-black transition duration-200 whitespace-nowrap"
                >
                    New Companies
                </button>
            }
        {
            refreshButton && pathname =="/companies" && 
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

export default RefreshCompanies