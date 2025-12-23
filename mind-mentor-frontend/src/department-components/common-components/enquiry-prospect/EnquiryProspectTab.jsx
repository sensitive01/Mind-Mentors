import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  X,
  Eye,
  UserPlus,
  Users,
  UserCheck,
  UserMinus,
  Layers,
} from "lucide-react";
import Prospect from "../prospects/Prospects";
import Enquiry from "../enquiries/Enquires";
import ActiveKids from "../../../department-components/common-components/enrolled-kids-SD/ActiveEnquiry";
import DeactivatedKids from "../../../department-components/common-components/enrolled-kids-SD/DeactivatedEnquiry";

const EnquiryProspectTab = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const enquiryStatus = searchParams.get("enquiryStatus");

  // ✅ Default active tab based on URL
  const [activeTab, setActiveTab] = useState(() => {
    if (enquiryStatus === "Active") return "activeKids";
    return tab || "enquiry";
  });

  // Sync tab state with URL parameter
  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const department = localStorage.getItem("department");

  // 🔍 UNIVERSAL SEARCH API
  const performUniversalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BASE_ROUTE
        }/global-search/global-search?q=${query}`
      );
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Global search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // ⏳ DEBOUNCE SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      performUniversalSearch(searchQuery);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  // 🎨 STATUS CHIP COLORS
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700";
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "closed":
        return "bg-rose-100 text-rose-700";
      case "warm":
        return "bg-yellow-100 text-yellow-700";
      case "cold":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const handleView = (kid) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);

    let targetTab = "enquiry";
    if (kid.enquiryField === "prospects" && kid.enquiryStatus === "Active") {
      targetTab = "activeKids";
    } else if (kid.enquiryField === "prospects") {
      targetTab = "prospects";
    } else if (kid.enquiryField === "enquiryList") {
      targetTab = "enquiry";
    }

    setActiveTab(targetTab);
    navigate(`?tab=${targetTab}&selected=${kid._id}`);
  };

  const tabs = [
    { id: "enquiry", label: "Leads", icon: Layers },
    { id: "prospects", label: "Prospects", icon: Users },
    { id: "activeKids", label: "Active Kids", icon: UserCheck },
    { id: "deactivatedKids", label: "Deactivated Kids", icon: UserMinus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-[1920px] mx-auto">
        {/* HEADER SECTION */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          {/* SEARCH BOX */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all shadow-sm hover:bg-white"
              placeholder="Search by Parent, Kid, Phone or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          {/* RIGHT ACTIONS */}
          <Link
            to={`/${department}/department/enquiry-form`}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            New Enquiry
          </Link>
        </div>

        {/* TABS & CONTENT CONTAINER */}
        <div className="p-6">
          {/* TABS NAVIGATION */}
          <div className="flex items-center gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-200 w-fit shadow-sm">
            {tabs.map((tabItem) => {
              const isActive = activeTab === tabItem.id;
              const Icon = tabItem.icon;
              return (
                <button
                  key={tabItem.id}
                  onClick={() => setActiveTab(tabItem.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-indigo-300" : "text-slate-400"
                    }`}
                  />
                  {tabItem.label}
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[600px] overflow-hidden relative">
            {/* SEARCH RESULTS OVERLAY */}
            {searchQuery ? (
              <div className="p-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800">
                    Search Results
                    {isSearching && (
                      <span className="text-sm font-normal text-slate-400 ml-2 animate-pulse">
                        (Searching...)
                      </span>
                    )}
                  </h3>
                  <span className="text-sm text-slate-500">
                    {searchResults.length} results found
                  </span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          {[
                            "Parent",
                            "Kid",
                            "Phone",
                            "Type",
                            "Status",
                            "Date",
                            "Action",
                          ].map((head) => (
                            <th
                              key={head}
                              className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider"
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {searchResults.map((kid) => (
                          <tr
                            key={kid._id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                              {kid.parentName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                              {kid.kidName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-mono">
                              {kid.whatsappNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {kid.enquiryField}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  kid.enquiryStatus
                                )}`}
                              >
                                {kid.enquiryStatus || "Enquiry"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {kid.formattedCreatedAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleView(kid)}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  !isSearching && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No results found</p>
                      <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                  )
                )}
              </div>
            ) : (
              /* TAB CONTENTS */
              <div className="h-full">
                {activeTab === "enquiry" && <Enquiry />}
                {activeTab === "prospects" && <Prospect />}
                {activeTab === "activeKids" && <ActiveKids />}
                {activeTab === "deactivatedKids" && <DeactivatedKids />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnquiryProspectTab;
