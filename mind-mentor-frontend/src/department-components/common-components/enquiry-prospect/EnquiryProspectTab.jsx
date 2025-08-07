import React, { useState, useEffect } from "react";
import { Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Typography } from "@mui/material";
import { Search, Clear, Visibility } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Prospect from "../prospects/Prospects";
import Enquiry from "../enquiries/Enquires";
import ActiveKids from "../../../department-components/common-components/enrolled-kids-SD/ActiveEnquiry";

const EnquiryProspectTab = () => {
  const [activeTab, setActiveTab] = useState("enquiry");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const department = localStorage.getItem("department");

  // Function to search across all components
  const performUniversalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = [];
      
      // Search in Enquiry component
      // You'll need to expose a search function from your Enquiry component
      const enquiryResults = await searchInEnquiry(query);
      if (enquiryResults.length > 0) {
        results.push(...enquiryResults.map(item => ({ ...item, source: 'Leads' })));
      }

      // Search in Prospects component
      const prospectResults = await searchInProspects(query);
      if (prospectResults.length > 0) {
        results.push(...prospectResults.map(item => ({ ...item, source: 'Prospects' })));
      }

      // Search in ActiveKids component
      const activeKidsResults = await searchInActiveKids(query);
      if (activeKidsResults.length > 0) {
        results.push(...activeKidsResults.map(item => ({ ...item, source: 'Active Kids' })));
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // These functions should call the search methods from your actual components
  const searchInEnquiry = async (query) => {
    // Example: If your Enquiry component has a search method
    // return await EnquiryComponent.searchKids(query);
    
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data - replace with actual search logic
        const mockEnquiryData = [
          { id: 1, name: "John Doe", phone: "123-456-7890", email: "john@example.com", course: "Math", status: "New Lead", date: "2024-01-15" }
        ];
        const filtered = mockEnquiryData.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  const searchInProspects = async (query) => {
    // Mock implementation - replace with actual search logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockProspectData = [
          { id: 2, name: "Jane Smith", phone: "098-765-4321", email: "jane@example.com", course: "Science", status: "Hot Prospect", date: "2024-01-14" }
        ];
        const filtered = mockProspectData.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  const searchInActiveKids = async (query) => {
    // Mock implementation - replace with actual search logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockActiveKidsData = [
          { id: 3, name: "Tommy Brown", phone: "777-888-9999", email: "tommy@example.com", course: "Art", status: "Active", date: "2024-01-11" }
        ];
        const filtered = mockActiveKidsData.filter(item => 
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.phone.includes(query) ||
          item.email.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 300);
    });
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performUniversalSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const getStatusChipColor = (status, source) => {
    switch (status.toLowerCase()) {
      case 'new lead':
        return 'primary';
      case 'contacted':
        return 'info';
      case 'hot prospect':
        return 'error';
      case 'warm prospect':
        return 'warning';
      case 'active':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg shadow-sm">
      {/* Header Section with Search */}
      <div className="px-6 py-4 border-b bg-white rounded-t-lg">
        {/* Search Bar */}
        <div className="mb-4">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for kids by name, phone, or email..."
            value={searchQuery}
            onChange={handleSearchChange}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#642b8f',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#642b8f',
                },
              },
            }}
          />
        </div>

        {/* Tabs and Button */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            {/* Leads */}
            <button
              className={`py-2 px-4 font-medium transition-colors relative ${
                activeTab === "enquiry"
                  ? "text-[#642b8f]"
                  : "text-gray-600 hover:text-[#642b8f]"
              }`}
              onClick={() => setActiveTab("enquiry")}
            >
              Leads
              {activeTab === "enquiry" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
              )}
            </button>

            {/* Prospects */}
            <button
              className={`py-2 px-4 font-medium transition-colors relative ${
                activeTab === "prospects"
                  ? "text-[#642b8f]"
                  : "text-gray-600 hover:text-[#642b8f]"
              }`}
              onClick={() => setActiveTab("prospects")}
            >
              Prospects
              {activeTab === "prospects" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
              )}
            </button>

            {/* Active Kids */}
            <button
              className={`py-2 px-4 font-medium transition-colors relative ${
                activeTab === "activeKids"
                  ? "text-[#642b8f]"
                  : "text-gray-600 hover:text-[#642b8f]"
              }`}
              onClick={() => setActiveTab("activeKids")}
            >
              Active Kids
              {activeTab === "activeKids" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
              )}
            </button>
          </div>

          {/* New Enquiry Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#642b8f",
              "&:hover": {
                backgroundColor: "#4a1d6e",
                color: "#f8a213",
              },
            }}
            component={Link}
            to={`/${department}/department/enquiry-form`}
          >
            + New Enquiry Form
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-2">
        {/* Show search results if searching */}
        {searchQuery && (
          <div className="mb-4">
            <Typography variant="h6" className="mb-3 text-gray-700">
              Search Results {isSearching && "(Searching...)"}
            </Typography>
            
            {searchResults.length > 0 ? (
              <TableContainer component={Paper} className="shadow-md">
                <Table>
                  <TableHead>
                    <TableRow className="bg-gray-50">
                      <TableCell className="font-semibold">Name</TableCell>
                      <TableCell className="font-semibold">Phone</TableCell>
                      <TableCell className="font-semibold">Email</TableCell>
                      <TableCell className="font-semibold">Course</TableCell>
                      <TableCell className="font-semibold">Status</TableCell>
                      <TableCell className="font-semibold">Source</TableCell>
                      <TableCell className="font-semibold">Date</TableCell>
                      <TableCell className="font-semibold">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchResults.map((kid, index) => (
                      <TableRow key={`${kid.source}-${kid.id || index}`} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{kid.name}</TableCell>
                        <TableCell>{kid.phone}</TableCell>
                        <TableCell>{kid.email}</TableCell>
                        <TableCell>{kid.course}</TableCell>
                        <TableCell>
                          <Chip
                            label={kid.status}
                            color={getStatusChipColor(kid.status, kid.source)}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={kid.source}
                            size="small"
                            sx={{ backgroundColor: '#642b8f', color: 'white' }}
                          />
                        </TableCell>
                        <TableCell>{new Date(kid.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              // Handle view details action
                              console.log('View details for:', kid);
                            }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : !isSearching && (
              <Paper className="p-8 text-center">
                <Typography variant="body1" className="text-gray-500">
                  No results found for "{searchQuery}"
                </Typography>
              </Paper>
            )}
          </div>
        )}

        {/* Show normal tab content when not searching */}
        {!searchQuery && (
          <div>
            {activeTab === "enquiry" && <Enquiry />}
            {activeTab === "prospects" && <Prospect />}
            {activeTab === "activeKids" && <ActiveKids />}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryProspectTab;