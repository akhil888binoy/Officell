import { useEffect, useState } from "react";
import { MdOutlineAttachFile, MdOutlineCategory } from "react-icons/md"
import { RiBuilding2Line } from "react-icons/ri"
import InputEmoji from 'react-input-emoji';
import Cookies from 'js-cookie';
import axios from 'axios';
import CompanySearchBar from "./CompanySearchBar";
import { CompanyCard } from "./CompanyCard";
import { Loader } from "../components/Loader";
import { CompanySearchCard } from "./CompanySearchCard";
import { FaUserTie, FaRegLaughBeam, FaBeer, FaUsers, FaBriefcase } from "react-icons/fa";
import { MdOutlineWorkHistory, MdOutlineLaptopChromebook, MdOutlineDarkMode } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';

interface Company {
  id: string;
  name: string;
  industry: string;
  city: string;
  country: string;
}

const PostCard = () => {

  const [post , setPost ] = useState("");
  const [company_id , setCompany_id] = useState("");
  const [category , setCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [search , setSearch] = useState("")
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [postloading, setPostLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posterror, setPostError] = useState<string | null>(null);

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
      }
    try {
      setPostLoading(true)
      const token =  Cookies.get("Auth");
      console.log(token);
      const headers={
        'Authorization': `Bearer ${token}`
      }
      const formData = new FormData();
      formData.append('content', post);
      formData.append('company_id', company_id);
      formData.append('category', category);
      if (selectedImage)
      formData.append('file', selectedImage); 

      const  response = await axios.post("http://localhost:3000/v1/vents", formData,{
          headers:headers,
      });
      console.log(response)
      setPostLoading(false);
      setPost("");
      setCompany_id("");
      setCategory("");
      setSelectedImage(null);
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
      toast.error('Oops Failed to Post! Dont worry its a mistake from our side ', {
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

  const handleAddImage =(e)=>{
    setSelectedImage(e.target.files[0]);
  }

  const handleAddCategory=(e)=>{
    const newCategory = e.currentTarget.value;
    setCategory(newCategory);
  }


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
        
        console.log(companiesJson.companies);
        const newCompanies = companiesJson.companies;
        
        // Check if we've reached the end of the list
        if (newCompanies.length === 0) {
          setHasMore(false);
        } else {
          setCompanies([...companies, ...newCompanies]);
        }
        
        setError(null);
      } catch (error) {
        console.error(error);
        toast.error('Failed fetch companies', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    if (hasMore || companies.length === 0 || search.length > 0) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },1000);
      return () => clearTimeout(timer)
    }
  }, [skip, search]);

  
  return (

    <div className="w-full  bg-gray-950 ">
      {/* Input */}
      {postloading ? <Loader></Loader> : 
      <>
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
            <input
              value={post}
              onChange={e=>setPost(e.target.value)}
              placeholder="Spill the tea..."
              className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            />
          </div>
       {/* Action Row */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-10 pb-3 pt-3 border-gray-950 border-b">
        {/* Left side icons */}
        <div className="flex gap-x-2 sm:gap-x-3">
          {/* Select Image Button */}
            <button  data-modal-target="image-modal" data-modal-toggle="image-modal"
            className={`flex items-center justify-center rounded-full p-1.5 sm:p-2 
                  hover:bg-gray-800 active:scale-95 transition 
                  ${selectedImage ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
            >
              <MdOutlineAttachFile className="text-base sm:text-lg" />
          </button>
          {/* Select Company Button */}
          <button  data-modal-target="default-modal" data-modal-toggle="default-modal" 
            className={`flex items-center justify-center rounded-full p-1.5 sm:p-2 
                  hover:bg-gray-800 active:scale-95 transition 
                  ${company_id ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
          >
            <RiBuilding2Line className="text-base sm:text-lg" />
          </button>
          {/* Select Category */}
            <button
                data-modal-target="category-modal"
                data-modal-toggle="category-modal"
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
  {/* Add image popup */}
  <div id="image-modal" ria-hidden="true" className="hidden  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(90%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-2xl  max-h-full">
        
          <div className="relative rounded-lg shadow-sm bg-gray-950 ">
            
              <div className="flex  items-center justify-between md:p-5  rounded-t border-r border-l border-t border-gray-700">
                      <input name="file" accept="file/*" type="file" onChange={handleAddImage}   className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition"></input>
              </div>
            {selectedImage && (
              <div className="p-4 md:p-5 justify-center items-center flex-1 overflow-y-scroll max-h-[60vh] border-l border-r border-t border-gray-700">
                  
                    <div >
                      {/* Display the selected image */}
                      <img
                        alt="not found"
                        width={"250px"}
                        src={URL.createObjectURL(selectedImage)}
                      />
                      <br /> <br />
                      {/* Button to remove the selected image */}
                      <button className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition" onClick={() => setSelectedImage(null)}>Remove</button>
                    </div>
              </div>
              )}
              <div className="flex items-center justify-between p-4 md:p-5  border-gray-200 rounded-b border dark:border-gray-600">
                  <button data-modal-hide="image-modal" type="button" className="text-black bg-gray-50 hover:bg-gray-950 hover:text-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Choose</button>
                  <button type="button" onClick={() => setSelectedImage(null)} className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline" data-modal-hide="image-modal">
                      Cancel
                  </button>
              </div>
          </div>
      </div>
  </div>

{/* Add Catgeory popup */}
  <div id="category-modal" ria-hidden="true" className="hidden  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(90%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-md  max-h-full">
        
          <div className="relative rounded-lg shadow-sm bg-gray-950 ">
            
              <div className="flex  items-center justify-between md:p-5  rounded-t border-r border-l border-t border-gray-700">
                      <h2 className="px-4 pt-4 pb-4 text-lg font-light text-white tracking-widest">Choose Category</h2>
              </div>
              <div className="p-4  md:p-5 justify-center items-center flex-1 overflow-y-scroll max-h-[60vh] border-l border-r border-t border-gray-700">
                  <div className="flex flex-col gap-4 p-4">
                        {categories.map((cat, index) => (
                            <button
                              onClick={handleAddCategory}
                              key={index}
                              value={cat.name}
                              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-4xl
                                bg-gray-800 text-gray-200
                                hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] 
                                active:scale-95 active:bg-gray-600
                                transition-all duration-200 ease-in-out
                                shadow-sm ${category === cat.name ? 'border border-white' : ''}`}>
                              <span className="text-lg">{cat.icon}</span>
                              {cat.name}
                            </button>
                        ))}
                  </div>
              </div>
          
              <div className="flex items-center justify-between p-4 md:p-5  border-gray-200 rounded-b border dark:border-gray-600">
              <button data-modal-hide="category-modal" type="button" className="text-black bg-gray-50 hover:bg-gray-950 hover:text-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Choose</button>
              <button type="button" onClick={() => setCategory("")} 		className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline" data-modal-hide="category-modal">
                      Cancel
                </button>
              </div>
          </div>
      </div>
  </div>

     {/* Search Company Section */}
<div id="default-modal" ria-hidden="true" className="hidden  fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(90%-1rem)] max-h-full">
    <div className="relative p-4 w-full max-w-2xl  max-h-full">
       
        <div className="relative rounded-lg shadow-sm bg-gray-950 ">
           
            <div className="flex  items-center justify-between md:p-5  rounded-t border-r border-l border-t border-gray-700">
                  <CompanySearchBar 
                  onSearch={(q) => {
                            setSkip(0);
                            setHasMore(true);
                            setCompanies([]);
                            setSearch(q);
                    }} />
            </div>
          
            <div className="p-4 md:p-5   flex-1 overflow-y-scroll h-[60vh] border-l border-r border-t border-gray-700">
                {loading && companies.length === 0 && <Loader />}
                        
                        {/* Error message */}
                        {error && (
                          <div className="text-red-500 text-center p-4">
                            {error}
                          </div>
                        )}
                  {companies.map(company => (
                        <div  
                            className={`${company_id === company.id? 'border  border-gray-100':''}`} 
                            key={company.id} 
                            onClick={() => {
                                setCompany_id(company.id)
                                console.log("Company Id", company.id)
                              }}
                          >
                        <CompanySearchCard
                              company_id={company.id}
                              company_name={company.name}
                              industry={company.industry}
                              city={company.city}
                              country={company.country}
                            />
                    </div>
                
                  ))}
                    {loadingMore && <Loader />}
                    
                    {/* End of results message */}
                    {!hasMore && companies.length > 0 && (
                      <div className="text-center text-gray-400 py-6">
                        You've reached the end of the list
                      </div>
                    )}       
            </div>
          
            <div className="flex items-center justify-between p-4 md:p-5  border-gray-200 rounded-b border dark:border-gray-600">
                <button data-modal-hide="default-modal" type="button" className="text-black bg-gray-50 hover:bg-gray-950 hover:text-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Choose</button>
                    <button type="button" onClick={() => setCompany_id("")} 		className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline" data-modal-hide="default-modal">
                      Cancel
                </button>
            </div>
        </div>
    </div>
</div>




    </div>
  )
}

export default PostCard
