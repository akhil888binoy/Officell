import { CategoryBarM } from "../components/CategoryBarM";
import { CommentSection } from "../components/CommentSection";
import { Sidebar } from "../components/Sidebar";
import { VentCard } from "../components/VentCard";

export const VentDetailsPage = () => {

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
    <div className="h-screen border-r-1 border-gray-700  " >
      <Sidebar/>
      <CategoryBarM></CategoryBarM>
      </div>
      {/* Main Content */}
        <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">

        <div className="flex-1 bg-gray-950 overflow-y-scroll ">
          <VentCard />
          <div className="space-y-4 ">
            <CommentSection></CommentSection>
          </div>
        </div>
      </div>
    </div>
  );
};
