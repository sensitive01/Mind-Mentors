import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";
import { Search, Clear, Visibility } from "@mui/icons-material";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Prospect from "../prospects/Prospects";
import Enquiry from "../enquiries/Enquires";
import ActiveKids from "../../../department-components/common-components/enrolled-kids-SD/ActiveEnquiry";

const EnquiryProspectTab = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const enquiryStatus = searchParams.get("enquiryStatus");

  // ✅ Default active tab based on URL
  const [activeTab, setActiveTab] = useState(() => {
    if (enquiryStatus === "Active") return "activeKids";
    return tab || "enquiry";
  });

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
        `http://localhost:3001/global-search/global-search?q=${query}`
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
  const getStatusChipColor = (status) => {
    if (!status) return "default";

    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "closed":
        return "error";
      default:
        return "info";
    }
  };

  const handleView = (kid) => {
    // Hide search results
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);

    let targetTab = "enquiry";

    // 1️⃣ ACTIVE KIDS
    if (kid.enquiryField === "prospects" && kid.enquiryStatus === "Active") {
      targetTab = "activeKids";
    }

    // 2️⃣ PROSPECTS
    else if (kid.enquiryField === "prospects") {
      targetTab = "prospects";
    }

    // 3️⃣ ENQUIRY
    else if (kid.enquiryField === "enquiryList") {
      targetTab = "enquiry";
    }

    setActiveTab(targetTab);

    navigate(`?tab=${targetTab}&selected=${kid._id}`);
  };








  return (
    <div className="w-full h-full bg-gray-100 rounded-lg shadow-sm">
      {/* HEADER */}
      <div className="px-6 py-4 border-b bg-white rounded-t-lg">
        {/* SEARCH BAR */}
        <div className="mb-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by Parent / Kid / Phone / ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={clearSearch} size="small">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* TABS */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            {["enquiry", "prospects", "activeKids"].map((tabName, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(tabName)}
                className={`py-2 px-4 font-medium ${activeTab === tabName
                  ? "text-purple-700 border-b-2 border-purple-700"
                  : "text-gray-600"
                  }`}
              >
                {tabName === "enquiry"
                  ? "Leads"
                  : tabName === "prospects"
                    ? "Prospects"
                    : "Active Kids"}
              </button>
            ))}
          </div>

          <Button
            variant="contained"
            sx={{ backgroundColor: "#642b8f" }}
            component={Link}
            to={`/${department}/department/enquiry-form`}
          >
            + New Enquiry
          </Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-2">
        {/* 🔍 SEARCH RESULTS */}
        {searchQuery && (
          <div className="mb-4">
            <Typography variant="h6" className="mb-3">
              Search Results {isSearching && "(Searching...)"}
            </Typography>

            {searchResults.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parent</TableCell>
                      <TableCell>Kid</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Source</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.map((kid) => (
                      <TableRow key={kid._id}>
                        <TableCell>{kid.parentName}</TableCell>
                        <TableCell>{kid.kidName}</TableCell>
                        <TableCell>{kid.whatsappNumber}</TableCell>
                        <TableCell>{kid.enquiryField}</TableCell>
                        <TableCell>
                          <Chip
                            label={kid.enquiryStatus || "Enquiry"}
                            color={getStatusChipColor(kid.enquiryStatus)}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={kid.enquiryField}
                            size="small"
                            sx={{ bgcolor: "#642b8f", color: "white" }}
                          />
                        </TableCell>
                        <TableCell>{kid.formattedCreatedAt}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleView(kid)}>
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              !isSearching && (
                <Paper className="p-6 text-center">No results found</Paper>
              )
            )}
          </div>
        )}

        {/* DEFAULT TABS */}
        {!searchQuery && (
          <>
            {activeTab === "enquiry" && <Enquiry />}
            {activeTab === "prospects" && <Prospect />}
            {activeTab === "activeKids" && <ActiveKids />}
          </>
        )}
      </div>
    </div>
  );
};

export default EnquiryProspectTab;
