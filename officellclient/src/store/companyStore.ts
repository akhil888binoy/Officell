import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const companyStore=(set,get)=>({

    companies:[{
        id:"",
        name:"",
        industry:"",
        city:"",
        country:"",
        domain:"",
        _count:{vents:0}
    }],

    addCompanies:(data)=>{
        set((state)=>({
                companies:[...state.companies, ...data]
        }));
    },
    getCompany :(id)=>{
        const companies = get().companies;
        return companies.find((company) => company.id === Number(id)) || null;
    },
    reset:()=>{
        set({
            companies:[{}]
        })
    }
})

const useCompanyStore=create(persist(companyStore,{
    name:"companies",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useCompanyStore;