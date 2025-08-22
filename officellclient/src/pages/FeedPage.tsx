import {Navbar} from "../components/Navbar";

export const FeedPage =()=>{
    
    return(
        <div className=" w-screen h-screen flex flex-row bg-amber-900">
            {/* Navbar */}
            <div className ="" >
                <Navbar></Navbar>
            </div>
            {/* Feeds */}
            <div className="bg-amber-600 h-7xl w-7xl">
                Feeds
            </div>
            {/* Filters & Categories */}
            <div className="bg-red-700 h-2xl w-2xl">
                Filters and categories
            </div>
        </div>
    );
}