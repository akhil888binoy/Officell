import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const companyStore=(set,get)=>({

    
    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollHasMore : true,
    scrollToItem: 0,
    companies:[],
    addScrollSkip : (data)=>{
        set((state)=>({
            scrollSkip: data
        }))
    },
    addScrollLoading : (data)=>{
        set((state)=>({
            scrollLoading: data
        }))
    },
    addScrollLoadingMore:(data)=>{
        set((state)=>({
            scrollLoadinMore: data
        }))
    },
    addScrollCategory:(data)=>{
        set((state)=>({
            scrollCategory: data
        }))
    },
    addHasMore: (data)=>{
        set((state)=>({
            scrollHasMore : data,
        }))
    },
    addScrollToItem: (data)=>{
        set((state)=>({
            scrollToItem : data,
        }))
    },
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
            companies:[]
        })
    },
    logout:()=>{
        set({
                scrollSkip:0,
                scrollLoading : true,
                scrollLoadinMore: false,
                scrollCategory: "",
                scrollHasMore : true,
                scrollToItem: 0,
                companies:[],
        })
    }

})

const useCompanyStore=create(persist(companyStore,{
    name:"companies",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useCompanyStore;