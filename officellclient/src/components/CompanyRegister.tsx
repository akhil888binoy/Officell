import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import { categories } from './CompanyCategory';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';

const customRender = (props) => {
  const {
    options,
    value,
    disabled,
    onChange,
    onBlur,
    customProps,
    ...selectProps
  } = props;

  return (
    <Select
      {...selectProps}
      options={options}
      isDisabled={disabled}
      isSearchable={true}
      isClearable={true}
      value={customProps.reactSelectValue}
      onChange={customProps.onChange}   
    />
  );
};

type ReactSelectOption = {
  label: string;
  key:string;
  value: string;
};


const CompanyRegister = () => {
    const [companyName, setCompanyName] = useState("");
    const [domain , setDomain] = useState("");
    const [industry, setIndustry] = useState("");
    const [country, setCountry] = useState<ReactSelectOption | undefined>();
    const [region, setRegion] = useState<ReactSelectOption | undefined>();
    const [loading, setLoading] = useState(false);

  const handleSubmit=async()=>{
    
if(!domain){
            toast.error('Please Provide Company Website/Linkedin', {
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
      }else if (!industry){
        toast.error('Choose an Industry', {
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
      }else if (!country){
        toast.error('Choose a Country', {
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
      }else if (!region){
        toast.error('Choose a City', {
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
      setLoading(true);
      const token = Cookies.get("Auth");
      const headers={
        'Authorization': `Bearer ${token}`
      }
      const  response = await axios.post("http://localhost:3000/v1/companies", {
        name: companyName,
        domain : domain,
        industry: industry,
        city: region?.value,
        country: country?.key
      },{
          headers:headers,
      });
      console.log(response);
      setLoading(false);
      setCompanyName("");
      setIndustry("");
      setDomain("");
    setCountry({ label: "", value: "", key: "" });
    setRegion({ label: "", value: "", key: "" });
      toast.success('Yay! you did it 🎉', {
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
      toast.error('Oops Failed to Register! Dont worry its a mistake from our side ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
              });
      setLoading(false);
    }
  }
  return (
  <div>
    <ToastContainer></ToastContainer>
  <div className=" mx-auto  lg:p-20 p-10">
  <h2 className="text-4xl sm:text-4xl md:text-6xl lg:text-[40px] mt-4 mb-10 font-arimo text-white font-bold tracking-[-0.02em]">
        Add Company on Hitlist
  </h2>
        {/* Company Name */}
  <div className="relative z-0 w-full mb-5 group">
      <input value={companyName} onChange={(e)=>setCompanyName(e.target.value)} name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
      <label htmlFor="floating_name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company Name</label>
  </div>
  <div className="grid md:grid-cols-2 md:gap-6">
  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
  <div className="w-full sm:w-1/2">
    <CountryDropdown
      value={country?.value || ""}
      className="country"
      name="country-field"
      customRender={customRender}
      customProps={{
        reactSelectValue: country,
        classNamePrefix: "country-",
        onChange: (value) => {
          setCountry(value ? value : undefined);
          console.log("Country Code ", value?.key)
          setRegion(null);
        },
      }}
    />
  </div>

  <div className="w-full sm:w-1/2">
    <RegionDropdown
      country={country?.value || ""}
      value={region?.value || null}
      className="region"
      name="region-field"
      customRender={customRender}
      customProps={{
        reactSelectValue: region,
        classNamePrefix: "region-",
        onChange: (value) => {
          setRegion(value ? value : undefined);
        },
      }}
    />
  </div>
</div>

  

    <div className="relative z-0 w-full lg:mt-0 mt-5 group ">
      {/* Industry Dropdown */}
      <div className="relative">
        <select value={industry} onChange={(e)=> {
          setIndustry(e.target.value);
          console.log(e.target.value);
        }} className="block appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
        <option value="">Select Industry</option>
        {categories.map((cat, index)=>(
          <option key={index} value={cat.name}>{cat.name}</option>
        ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>

      <div className="relative z-0 w-full mb-5 group mt-5 lg:mt-0">
        <input value={domain} onChange={(e)=> setDomain(e.target.value)} type="text"  name="floating_website" id="floating_website" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label htmlFor="floating_website" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Company Website / Linkedin</label>
    </div>
  </div>
  <button onClick={handleSubmit} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
  </div>
    </div>
  )
}

export default CompanyRegister