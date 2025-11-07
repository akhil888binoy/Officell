// types/vent.ts
export interface Vote {
  user_id: string;
  vote: 'UPVOTE' | 'DOWNVOTE' | 'NOVOTE';
  vent_id?:string;
}

export interface Media {
  id: string;
  url: string;
  type: string;
}

export interface Company {
  id: string;
  name: string;
  country: string;
}

export interface Author {
  id: string;
  username: string;
}

export interface Vent {
  id: string;
  category: string;
  content: string;
  upvote: number;
  downvote: number;
  company?: Company;
  company_name?: string;
  company_country?: string;
  author?: Author;
  author_id: string;
  commentcount?: number;
  createdAt: string;
  Media: Media[];
  votes: Vote[];
  _count?: {
    comments: number;
  };
}

export interface VentCardProps {
  id: string;
  category: string;
  content: string;
  upvote: number;
  downvote: number;
  company_name?: string;
  company_country?: string;
  author?: string;
  author_id: string;
  commentcount?: number;
  createdAt: string;
  media: Media[];
  votes: Vote[];
  user_id: string;
}

export interface ProfileVentState {
  scrollSkip: number;
  scrollLoading: boolean;
  scrollLoadinMore: boolean;
  scrollCategory: string;
  scrollHasMore: boolean;
  scrollToItem: number | null;
  profilevents: Vent[];
  addScrollSkip: (data: number) => void;
  addScrollLoading: (data: boolean) => void;
  addScrollLoadingMore: (data: boolean) => void;
  addScrollCategory: (data: string) => void;
  addHasMore: (data: boolean) => void;
  addScrollToItem: (data: number | null) => void;
  addVents: (data: Vent[]) => void;
  addVent: (data: Vent) => void;
  upVote: (id: string, user_id: string, votedata: Vote) => void;
  downVote: (id: string, user_id: string, votedata: Vote) => void;
  getVent: (id: string) => Vent | null;
  deleteVent: (id: string) => void;
  resetScrollLoading: () => void;
  resetScrollLoadingMore: () => void;
  resetScrollCategory: () => void;
  resetScrollSkip: () => void;
  resetHasMore: () => void;
  reset: () => void;
  resetScrollToItem: () => void;
  logout: () => void;
}

export interface TrendingVentState {
  scrollSkip: number;
  scrollLoading: boolean;
  scrollLoadinMore: boolean;
  scrollCategory: string;
  scrollHasMore: boolean;
  scrollToItem: number | null;
  trendingvents: Vent[];
  addScrollSkip: (data: number) => void;
  addScrollLoading: (data: boolean) => void;
  addScrollLoadingMore: (data: boolean) => void;
  addScrollCategory: (data: string) => void;
  addHasMore: (data: boolean) => void;
  addScrollToItem: (data: number | null) => void;
  addVents: (data: Vent[]) => void;
  addVent: (data: Vent) => void;
  upVote: (id: string, user_id: string, votedata: Vote) => void;
  downVote: (id: string, user_id: string, votedata: Vote) => void;
  getVent: (id: string) => Vent | null;
  deleteVent: (id: string) => void;
  resetScrollLoading: () => void;
  resetScrollLoadingMore: () => void;
  resetScrollCategory: () => void;
  resetScrollSkip: () => void;
  resetHasMore: () => void;
  resetScrollToItem: () => void;
  reset: () => void;
  logout: () => void;
}

export interface VentState {
  post: string;
  company_id: string;
  category: string | null;
  selectedMedia: File | null;
  mediaType: string;
  scrollSkip: number;
  scrollLoading: boolean;
  scrollLoadinMore: boolean;
  scrollCategory: string;
  scrollHasMore: boolean;
  scrollToItem: number | null;
  vents: Vent[];
  refreshButton: boolean;
  setRefreshButton: (data: boolean) => void;
  addScrollSkip: (data: number) => void;
  addScrollLoading: (data: boolean) => void;
  addScrollLoadingMore: (data: boolean) => void;
  addScrollCategory: (data: string) => void;
  addHasMore: (data: boolean) => void;
  addScrollToItem: (data: number | null) => void;
  addVents: (data: Vent[]) => void;
  addVent: (data: Vent) => void;
  addTrendingVent: (data: Vent) => void;
  addPost: (data: string) => void;
  addCategory: (data: string | null) => void;
  addCompany_id: (data: string) => void;
  addSelectedMedia: (data: File | null) => void;
  addMediaType: (data: string) => void;
  upVote: (id: string, user_id: string, votedata: Vote) => void;
  downVote: (id: string, user_id: string, votedata: Vote) => void;
  getVent: (id: string) => Vent | null;
  deleteVent: (id: string) => void;
  resetScrollLoading: () => void;
  resetScrollLoadingMore: () => void;
  resetScrollCategory: () => void;
  resetScrollSkip: () => void;
  resetHasMore: () => void;
  reset: () => void;
  resetSelectedMedia: () => void;
  restMediaType: () => void;
  resetCompany_id: () => void;
  resetPost: () => void;
  resetCategory: () => void;
  resetScrollToItem: () => void;
  logout: () => void;
}

export interface CompanyVentState {
  scrollSkip: number;
  scrollLoading: boolean;
  scrollLoadinMore: boolean;
  scrollCategory: string;
  scrollHasMore: boolean;
  scrollToItem: number | null;
  companyvents: Vent[];
  addScrollSkip: (data: number) => void;
  addScrollLoading: (data: boolean) => void;
  addScrollLoadingMore: (data: boolean) => void;
  addScrollCategory: (data: string) => void;
  addHasMore: (data: boolean) => void;
  addScrollToItem: (data: number | null) => void;
  addVents: (data: Vent[]) => void;
  addVent: (data: Vent) => void;
  upVote: (id: string, user_id: string, votedata: Vote) => void;
  downVote: (id: string, user_id: string, votedata: Vote) => void;
  getVent: (id: string) => Vent | null;
  deleteVent: (id: string) => void;
  resetScrollLoading: () => void;
  resetScrollLoadingMore: () => void;
  resetScrollCategory: () => void;
  resetScrollSkip: () => void;
  resetHasMore: () => void;
  reset: () => void;
  resetScrollToItem: () => void;
  logout: () => void;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  vent_id: string;
  createdAt: string;
  author?: {
    username: string;
  };
  votes?: Vote[];
  upvote?: number;
  downvote?: number;
  _count?: {
    comments: number;
  };
}