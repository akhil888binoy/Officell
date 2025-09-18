import { useEffect, useState } from "react";
import { MdOutlineAttachFile, MdOutlineCategory } from "react-icons/md"
import { RiBuilding2Line } from "react-icons/ri"
import Cookies from 'js-cookie';
import axios from 'axios';
import CompanySearchBar from "./CompanySearchBar";
import { CompanySearchCard } from "./CompanySearchCard";
import { FaUserTie, FaRegLaughBeam, FaBeer, FaUsers, FaBriefcase } from "react-icons/fa";
import { MdOutlineWorkHistory, MdOutlineLaptopChromebook, MdOutlineDarkMode } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import AddCompany from "./AddCompany";
import useCompanyStore from "../store/companyStore";
import useVentStore from "../store/ventStore";
import {  useLocation, useParams } from 'react-router-dom';
import Shuffle from "../styles/Shuffle";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

const PostCard = () => {

  const {id} = useParams();
  const page = useLocation();
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search , setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [postloading, setPostLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openCategory , setOpenCategory] = useState(false);
  const [openMedia , setOpenMedia] = useState(false);
  const [openCompanies , setOpenCompanies] = useState(false);
  const companies = useCompanyStore((state) => state.companies);
  const post = useVentStore((state)=> state.post);
  const category = useVentStore((state)=> state.category);
  const company_id = useVentStore((state)=>state.company_id);
  const selectedMedia = useVentStore((state)=>state.selectedMedia);
  const mediaType = useVentStore((state)=>state.mediaType);
  const addCompanies = useCompanyStore((state) => state.addCompanies);
  const addVent = useVentStore((state) => state.addVent);
  const addTrendingVent = useVentStore((state) => state.addTrendingVent);
  const addPost = useVentStore((state)=>state.addPost);
  const addCompanyId = useVentStore((state)=>state.addCompany_id);
  const addCategory = useVentStore((state)=>state.addCategory);
  const addSelectedMedia = useVentStore((state)=>state.addSelectedMedia);
  const addMediaType = useVentStore((state)=>state.addMediaType);
  const reset = useCompanyStore((state)=>state.reset);
  const resetPost = useVentStore((state)=>state.resetPost);
  const resetCategory = useVentStore((state)=>state.resetCategory);
  const resetCompanyId = useVentStore((state)=>state.resetCompany_id);
  const resetSelectedMedia = useVentStore((state)=>state.resetSelectedMedia);
  const resetMediaType = useVentStore((state)=>state.restMediaType);


 const categories = [
   { name: "Work Culture", icon: <FaBriefcase /> },
   { name: "Colleague Drama", icon: <FaUsers /> },
   { name: "Boss Stories", icon: <FaUserTie /> },
   { name: "Overtime", icon: <MdOutlineWorkHistory /> },
   { name: "Salary & Perks", icon: <BiMoney /> },
   { name: "WFH Chronicles", icon: <MdOutlineLaptopChromebook /> },
   { name: "Secret Affairs", icon: <FiEye /> },
   { name: "Gossip", icon: <FaRegLaughBeam /> },
   { name: "After Work Fun", icon: <FaBeer /> },
   { name: "Dark Secrets", icon: <MdOutlineDarkMode /> },
 ];
 
  const handlePost= async ()=>{
    if(!post){
            toast.error('Spill Some tea to post', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
            return
      }else if (!category){
        toast.error('Choose a Category', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return
      }else if (!company_id){
        toast.error('Choose a Company', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            return
      }
    try {
      setPostLoading(true)
      const token =  Cookies.get("Auth");
      if(!token){
          await axios.post("http://localhost:3000/v1/auth/refreshtoken", {}, { withCredentials: true });
      }
      console.log(token);
      const headers={
        'Authorization': `Bearer ${token}`
      }
      const formData = new FormData();
      formData.append('content', post);
      formData.append('company_id', company_id);
      formData.append('category', category);
      formData.append('type', mediaType);
      if (selectedMedia)
      formData.append('file', selectedMedia); 
      const  {data: response} = await axios.post("http://localhost:3000/v1/vents", formData, {
          headers:headers,
      });
      console.log(response.vent);
      setPostLoading(false);
      if(page.pathname === '/feed' || (page.pathname === `/companies/${id}` && Number(company_id) === Number(id)) || page.pathname ==='/profile'){
        addVent(response.vent);
      } else if(page.pathname === '/trending'){
        addTrendingVent(response.vent);
      } 
      resetPost();
      resetCompanyId();
      resetCategory();
      resetSelectedMedia();
      resetMediaType();
        toast.success('Yay! you spilled it 🎉', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
    } catch (error) {
      console.error(error);
      toast.error('Oops Failed to Post!', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
        });
      setPostLoading(false);
    }
  }

const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // File type check
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    alert("Only images or videos are allowed!");
    e.target.value = "";
    return;
  }

  // Size check
  const imageMax = 5 * 1024 * 1024;   // 5MB
  const videoMax = 50 * 1024 * 1024;  // 50MB

  if ((isImage && file.size > imageMax) || (isVideo && file.size > videoMax)) {
    alert(
      isImage
        ? "Image is too large! Please upload under 5MB."
        : "Video is too large! Please upload under 50MB."
    );
    e.target.value = "";
    return;
  }
  addSelectedMedia(file);
  addMediaType(isImage? 'IMAGE': 'VIDEO');

};


  const handleAddCategory=(e)=>{
    const newCategory = e.currentTarget.value;
    addCategory(newCategory);
  }

  useEffect(()=>{
    reset();
  },[]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (companies.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: companiesJson } = await axios.get(`http://localhost:3000/v1/companies?skip=${skip}&company_name=${search}`, {
          headers: headers
        });
        
        const newCompanies = companiesJson.companies;
        if (newCompanies.length === 0) {
          setHasMore(false);
        } else {
          addCompanies(newCompanies);
        }
        
        setError(null);
      } catch (error) {
        console.error(error);
        
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    if (hasMore || companies.length === 0 || search.length > 0) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },500);
      return () => clearTimeout(timer)
    }
  }, [skip, search]);

  
  return (

    <div className="w-full  bg-gray-950 ">
      {/* Input */}
      {postloading ? 
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
                        <Shuffle
                          text="spilling the tea"
                          className="font-arimo text-white font-bold tracking-[-0.001em] text-4xl lg:text-[70px] lg:ml-55"
                          shuffleDirection="right"
                          duration={0.35}
                          animationMode="evenodd"
                          shuffleTimes={1}
                          ease="power3.out"
                          stagger={0.03}
                          threshold={0.1}
                          loop={true}
                          respectReducedMotion={true}
            />
            </div>
            : 
      <>
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
        <input maxLength={1000} value={post} onChange={e=>addPost(e.target.value)} placeholder="Spill the tea..." className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base" />
        {post.length > 1000 ? 'only ': ''}
      </div>

       {/* Action Row */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-10 pb-3 pt-3 border-gray-950 border-b">
        {/* Left side icons */}
        <div className="flex gap-x-2 sm:gap-x-3">
          {/* Select Image Button */}
            <button  onClick={()=> setOpenMedia(true)}
            className={`flex items-center justify-center rounded-full p-1.5 sm:p-2 
                  hover:bg-gray-800 active:scale-95 transition 
                  ${selectedMedia ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
            >
              <MdOutlineAttachFile className="text-base sm:text-lg" />
          </button>
          {/* Select Company Button */}
          <button onClick={()=>setOpenCompanies(true)}
            className={`flex items-center justify-center rounded-full p-1.5 sm:p-2 
                  hover:bg-gray-800 active:scale-95 transition 
                  ${company_id ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
          >
            <RiBuilding2Line className="text-base sm:text-lg" />
          </button>
          {/* Select Category */}
            <button
                onClick={()=> setOpenCategory(true)}
                className={`flex items-center justify-center rounded-full p-1.5 sm:p-2 
                  hover:bg-gray-800 active:scale-95 transition 
                  ${category ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
              >
                <MdOutlineCategory className="text-base sm:text-lg" />
              </button>
        </div>
        {/* Post Button */}
        <button onClick={handlePost} className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition">
          Post
        </button>
      </div>
      </>
        
      }
    
      
    
<ToastContainer />


<Dialog open={openMedia} onClose={setOpenMedia} className="relative z-10">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-950/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-10 flex items-center justify-center p-2 sm:p-4">
    <DialogPanel
      transition
      className="relative w-full max-w-[90%] sm:max-w-lg mx-auto transform overflow-hidden rounded-lg bg-gray-950 shadow-xl outline -outline-offset-1 outline-white/10 transition-all
        data-closed:translate-y-4 data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out 
        data-leave:duration-200 data-leave:ease-in 
        data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      {/* Header */}
      <div className="bg-gray-950 px-4 sm:px-6 pt-5 pb-4">
        <DialogTitle as="h3" className="text-base sm:text-lg font-semibold text-white">
          Show us proof
        </DialogTitle>
        <div className="flex items-center justify-between md:p-5 rounded-t ">
          <input
            name="file"
            accept="image/*,video/*"
            type="file"
            onChange={handleAddMedia}
            className="rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition"
          />

        </div>

    {selectedMedia != null &&  mediaType == 'IMAGE' && (
      <div className="p-4 md:p-5 flex flex-col items-center justify-center gap-4 overflow-y-auto max-h-[60vh] ">
          <img
            alt="preview"
            width="250"
            src={URL.createObjectURL(selectedMedia)}
            className="rounded-md"
          />
      </div>
    )}

    {selectedMedia != null &&  mediaType == 'VIDEO' && (
      <div className="p-4 md:p-5 flex flex-col items-center justify-center gap-4 overflow-y-auto max-h-[60vh] ">
          <video
            controls
            width="250"
            className="rounded-md"
          >
            <source src={URL.createObjectURL(selectedMedia)} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
      </div>
    )}
    
      </div>
      {/* Footer */}
      <div className="bg-gray-950 px-4 sm:px-6 py-3 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
        <button
          type="button"
          onClick={() => setOpenMedia(false)}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-950 transition"
        >
          Confirm
        </button>

        <button
          type="button"
          onClick={() => {
            setOpenMedia(false);
            resetSelectedMedia();
          }}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>


  <Dialog open={openCategory} onClose={setOpenCategory} className="relative z-10">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-950/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-10 flex items-center justify-center p-2 sm:p-4">
    <DialogPanel
      transition
      className="relative w-full max-w-[90%] sm:max-w-lg mx-auto transform overflow-hidden rounded-lg bg-gray-950 shadow-xl outline -outline-offset-1 outline-white/10 transition-all
        data-closed:translate-y-4 data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out 
        data-leave:duration-200 data-leave:ease-in 
        data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      {/* Header */}
      <div className="bg-gray-950 px-4 sm:px-6 pt-5 pb-4">
        <DialogTitle as="h3" className="text-base sm:text-lg font-semibold text-white">
          Choose a category
        </DialogTitle>

        <div className="mt-4 flex flex-col gap-3">
          {categories.map((cat, index) => (
            <button
              onClick={handleAddCategory}
              key={index}
              value={cat.name}
              className={`flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-xl
                bg-gray-800 text-gray-200
                hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] 
                active:scale-95 active:bg-gray-600
                transition-all duration-200 ease-in-out
                shadow-sm ${category === cat.name ? 'border border-white' : ''}`}
            >
              <span className="text-lg">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-950 px-4 sm:px-6 py-3 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0">
        <button
          type="button"
          onClick={() => setOpenCategory(false)}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-950 transition"
        >
          Choose
        </button>

        <button
          type="button"
          onClick={() => {
            setOpenCategory(false);
            resetCategory();
          }}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>





 <Dialog open={openCompanies} onClose={setOpenCompanies} className="relative z-10">
  <DialogBackdrop
    transition
    className="fixed inset-0 bg-gray-950/70 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
  />

  <div className="fixed inset-0 z-10 flex items-center justify-center p-2 sm:p-4">
    <DialogPanel
      transition
      className="relative w-full max-w-[90%] sm:max-w-lg mx-auto transform overflow-hidden rounded-lg bg-gray-950 shadow-xl outline -outline-offset-1 outline-white/10 transition-all
        data-closed:translate-y-4 data-closed:opacity-0 
        data-enter:duration-300 data-enter:ease-out 
        data-leave:duration-200 data-leave:ease-in 
        data-closed:sm:translate-y-0 data-closed:sm:scale-95"
    >
      {/* Header */}
          <CompanySearchBar 
            onSearch={(q) => {
              setSkip(0);
              setHasMore(true);
              reset();
              setSearch(q);
            }} 
          />
      {/* Body */}
      <div className="p-4 md:p-5 flex-1 overflow-y-auto h-[60vh] border-t border-gray-800 space-y-4">
        {loading && companies.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <Shuffle
              text="⟢ spilling the tea"
              className="font-arimo text-white font-bold tracking-[-0.001em] text-4xl sm:text-5xl md:text-6xl lg:text-[70px]"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              loop={true}
              respectReducedMotion={true}
            />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-center p-4">
            {error}
          </div>
        )}

        {/* Companies list */}
        <div className="space-y-2">
          {companies.map((company, index) => (
            <div
              key={index}
              className={`transition cursor-pointer ${
                company_id === company.id ? "border border-gray-200" : "border border-transparent"
              }`}
              onClick={() => {
                addCompanyId(company.id);
                console.log("Company Id", company_id);
              }}
            >
              <CompanySearchCard
                company_id={company.id}
                company_name={company.name}
                industry={company.industry}
                city={company.city}
                country={company.country}
                domain={company.domain}
              />
            </div>
          ))}
        </div>

        {/* Loading more */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <Shuffle
              text="⟢ OFFICELL"
              className="font-arimo text-white font-bold tracking-[-0.001em] text-4xl sm:text-5xl md:text-6xl lg:text-[70px]"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              loop={true}
              respectReducedMotion={true}
            />
          </div>
        )}

        {/* Add new company */}
        <AddCompany />

        {/* End of results */}
        {!hasMore && companies.length > 0 && (
          <div className="text-center text-gray-400 py-6">
            You've reached the end of the list
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-950 px-4 sm:px-6 py-3 flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-0 border-t border-gray-800">
        <button
          type="button"
          onClick={() => setOpenCompanies(false)}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-950 transition"
        >
          Choose
        </button>

        <button
          type="button"
          onClick={() => {
            setOpenCompanies(false);
            resetCompanyId();
          }}
          className="w-full sm:w-auto inline-flex justify-center rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
        >
          Cancel
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>





    </div>
  )
}

export default PostCard
