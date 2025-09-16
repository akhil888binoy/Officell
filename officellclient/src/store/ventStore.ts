import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const ventStore=(set,get)=>({
    post:"",
    company_id:"",
    category:"",
    selectedMedia: null,
    mediaType: "",
    vents:[{
        id:"",
        category:"",
        content:"",
        upvote:"",
        downvote:"",
        company:{
            country:"",
            name:""
        },
        author:{
            username:""
        },
        author_id:"",
        createdAt:"",
        Media:[{}],
        votes:[],
        _count:{comments:0},
        company_id:""
    }],
    addVents:(data)=>{
        set((state)=>({
                vents:[...state.vents, ...data]
        }));
    },
    addVent:(data)=>{
        set((state)=>({
            vents:[data,...state.vents]
        }))
    },
    addTrendingVent:(data)=>{
        set((state)=>({
            vents:[...state.vents, data]
        }))
    },
    addPost:(data)=>{
        set({
            post:data
        });
    },
    addCategory:(data)=>{
        set({
            category: data
        });
    },
    addCompany_id:(data)=>{
        set({
            company_id: data
        });
    },
    addSelectedMedia:(data)=>{
        set({
            selectedMedia:data
        });
    },
    addMediaType:(data)=>{
        set({
            mediaType: data
        })
    },
    upVote: (id, user_id, votedata) => {
        const vents = get().vents;
        console.log("votedata",votedata)
            const updatedVents = vents.map((vent) => {
                if (vent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...vent,
                            upvote: Number(vent.upvote) - 1,
                            votes: vent.votes.map((vote)=>{
                                if( vote.user_id === user_id){
                                    return{
                                        ...vote,
                                        vote:'NOVOTE'
                                    }
                                }
                                return vote
                            })
                        };
                    }else if (votedata.vote === 'UPVOTE'){
                        const existDownVote = vent.votes.find((vote)=> vote.vote ==='DOWNVOTE');
                        return{
                            ...vent,
                            upvote: Number(vent.upvote) + 1,
                            downvote: existDownVote ? Number(vent.downvote) - 1 : Number(vent.downvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = vent.votes.map((vote) => {
                                    if( vote.user_id === user_id){
                                        userFound = true;
                                        return{
                                            ...vote,
                                            vote:'UPVOTE'
                                        }
                                    }
                                    return vote
                                });
                                
                                if (!userFound) {
                                    return [...updatedVotes, votedata];
                                }
                                return updatedVotes;
                            })()
                        }
                    }
                }
                return vent;
            });
                
            set({ vents: updatedVents });
            },
downVote: (id, user_id, votedata) => {
        const vents = get().vents;
        console.log("votedata",votedata)
            const updatedVents = vents.map((vent) => {
                if (vent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...vent,
                            downvote: Number(vent.downvote) - 1,
                            votes: vent.votes.map((vote)=>{
                                if( vote.user_id === user_id){
                                    return{
                                        ...vote,
                                        vote:'NOVOTE'
                                    }
                                }
                                return vote
                            })
                        };
                    }else if (votedata.vote === 'DOWNVOTE'){
                        const existUpVote = vent.votes.find((vote)=> vote.vote ==='UPVOTE');
                        return{
                            ...vent,
                            downvote: Number(vent.downvote) + 1,
                            upvote: existUpVote ? Number(vent.upvote) - 1 : Number(vent.upvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = vent.votes.map((vote) => {
                                    if( vote.user_id === user_id){
                                        userFound = true;
                                        return{
                                            ...vote,
                                            vote:'DOWNVOTE'
                                        }
                                    }
                                    return vote
                                });
                                
                                if (!userFound) {
                                    return [...updatedVotes, votedata];
                                }
                                return updatedVotes;
                            })()
                        }
                    }
                }
                return vent;
            });
                
            set({ vents: updatedVents });
            },
    getVent:(id)=>{
        const vents = get().vents;
        return vents.find((vent) => vent.id === Number(id)) || null;
    },
    deleteVent:(id)=>{
        const vents= get().vents;
        const updatedVents = vents.filter((vent => vent.id != id));
        set({
            vents: updatedVents
        })
    },
    reset:()=>{
        set({
            vents:[{}]
        })
    },
    resetSelectedMedia:()=>{
        set({
            selectedMedia: null
        })
    },
    restMediaType:()=>{
        set({
            mediaType: ""
        })
    },
    resetCompany_id:()=>{
        set({
            company_id: ""
        })
    },
    resetPost:()=>{
        set({
            post: ""
        })
    },
    resetCategory:()=>{
        set({
            category: ""
        })
    },
})

const useVentStore=create(persist(ventStore,{
    name:"vents",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useVentStore;