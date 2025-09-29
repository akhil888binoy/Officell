import { data } from 'react-router-dom';
import {create} from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

const profileventStore=(set,get)=>({
    
    scrollSkip:0,
    scrollLoading : true,
    scrollLoadinMore: false,
    scrollCategory: "",
    scrollHasMore : true,
    scrollToItem: 0,
    profilevents:[],
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
    addVents:(data)=>{
        set((state)=>({
                profilevents:[...state.profilevents, ...data]
        }));
    },
    addVent:(data)=>{
        set((state)=>({
            profilevents:[ data, ...state.profilevents]
        }))
    },
    upVote: (id, user_id, votedata) => {

        const profilevents = get().profilevents;

        console.log("votedata",votedata)
            const updatedVents = profilevents.map((profilevent) => {
                if (profilevent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...profilevent,
                            upvote: Number(profilevent.upvote) - 1,
                            votes: profilevent.votes.map((vote)=>{
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
                        const existDownVote = profilevent.votes.find((vote)=> vote.vote ==='DOWNVOTE');
                        return{
                            ...profilevent,
                            upvote: Number(profilevent.upvote) + 1,
                            downvote: existDownVote ? Number(profilevent.downvote) - 1 : Number(profilevent.downvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = profilevent.votes.map((vote) => {
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
                return profilevent;
            });
                set({ profilevents: updatedVents });
            },
downVote: (id, user_id, votedata) => {
        const profilevents = get().profilevents;
        console.log("votedata",votedata)
            const updatedVents = profilevents.map((profilevent) => {
                if (profilevent.id === id) {
                    if (votedata.vote ==='NOVOTE'){
                        return {
                            ...profilevent,
                            downvote: Number(profilevent.downvote) - 1,
                            votes: profilevent.votes.map((vote)=>{
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
                        const existUpVote = profilevent.votes.find((vote)=> vote.vote ==='UPVOTE');
                        return{
                            ...profilevent,
                            downvote: Number(profilevent.downvote) + 1,
                            upvote: existUpVote ? Number(profilevent.upvote) - 1 : Number(profilevent.upvote),
                            votes: (() => {
                                let userFound = false;
                                const updatedVotes = profilevent.votes.map((vote) => {
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
                return profilevent;
            });
                
            set({ profilevents: updatedVents });
            },
    getVent:(id)=>{
        const profilevents = get().profilevents;
        return profilevents.find((profilevent) => profilevent.id === Number(id)) || null;
    },
    deleteVent:(id)=>{
        const profilevents= get().profilevents;
        const updatedVents = profilevents.filter((profilevent => profilevent.id != id));
        set({
            profilevents: updatedVents
        })
    },
    resetScrollLoading:()=>{
        set({
            scrollLoading : true,
        })
    },
    resetScrollLoadingMore:()=>{
        set({
            scrollLoadinMore: false,
        })
    },
    resetScrollCategory:()=>{
        set({
            scrollCategory: "",
        })
    },
    resetScrollSkip:()=>{
        set({
            scrollSkip : 0,
        })
    },
    resetHasMore:()=>{
        set({
            scrollHasMore: true
        })
    },
    reset:()=>{
        set({
            profilevents:[]
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
            profilevents:[],
        })
    }
})

const useProfileVentStore=create(persist(profileventStore,{
    name:"profilevents",
    storage: createJSONStorage(()=>sessionStorage)
}));

export default useProfileVentStore;