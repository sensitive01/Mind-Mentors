import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  School,
  LocationOn,
  Add as AddIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon,
  LocalShipping as KitIcon,
} from "@mui/icons-material";
import { getAllProgrameData, submitOnlineClassPrice } from "../../../api/service/employee/EmployeeService";

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`class-tabpanel-${index}`}
      aria-labelledby={`class-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// ClassAmountRow with Program and Level dropdowns added
const ClassAmountRow = ({
  index,
  data,
  onChange,
  onDelete,
  disableDelete,
  isHybrid = false,
  programs,
}) => {
  const programObj = programs.find((p) => p._id === data.program);

  return (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}>
      {/* Program dropdown */}
      <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2, mb: 1 }}>
        <InputLabel>Program</InputLabel>
        <Select
          value={data.program || ""}
          onChange={(e) => onChange(index, "program", e.target.value)}
          label="Program"
        >
          {programs.map((program) => (
            <MenuItem key={program._id} value={program._id}>
              {program.programName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Level dropdown */}
      <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2, mb: 1 }}>
        <InputLabel>Level</InputLabel>
        <Select
          value={data.level || ""}
          onChange={(e) => onChange(index, "level", e.target.value)}
          label="Level"
          disabled={!programObj}
        >
          {programObj &&
            programObj.programLevel.map((level, idx) => (
              <MenuItem key={idx} value={level}>
                {level}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* Mode dropdown (only for hybrid) */}
      {isHybrid && (
        <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2, mb: 1 }}>
          <InputLabel>Mode</InputLabel>
          <Select
            value={data.mode || ""}
            onChange={(e) => onChange(index, "mode", e.target.value)}
            label="Mode"
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
          </Select>
        </FormControl>
      )}

      {/* Time dropdown (always shown) */}
      <FormControl variant="outlined" size="small" sx={{ width: 150, mr: 2, mb: 1 }}>
        <InputLabel>Time</InputLabel>
        <Select
          value={data.time || ""}
          onChange={(e) => onChange(index, "time", e.target.value)}
          label="Time"
        >
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="night">Night</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Number of Classes"
        type="number"
        value={data.classes || ""}
        onChange={(e) => onChange(index, "classes", e.target.value)}
        sx={{ width: 150, mr: 2, mb: 1 }}
        variant="outlined"
        size="small"
      />
      <TextField
        label="Price"
        type="number"
        value={data.amount || ""}
        onChange={(e) => onChange(index, "amount", e.target.value)}
        InputProps={{
          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
        }}
        sx={{ width: 150, mr: 2, mb: 1 }}
        variant="outlined"
        size="small"
      />

      {!disableDelete && (
        <IconButton color="error" onClick={() => onDelete(index)}>
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

const ClassPricingDialog = ({
  open,
  onClose,
  loading,
  onlinePrice,
  setOnlinePrice,
  centerPrices,
  handleCenterPriceChange,
  existingCenters,
  handleSubmitOnlinePrice,
  handleSubmitCenterPrice,
}) => {
  const [tabValue, setTabValue] = useState(0);

  // State for programs fetched from API
  const [programs, setPrograms] = useState([]);

  // State for online classes with multiple price points
  const [onlineClassPrices, setOnlineClassPrices] = useState([
    { classes: 1, amount: onlinePrice || "", program: "", level: "", time: "", mode: "" },
  ]);

  const [hybridClassPrices, setHybridClassPrices] = useState([
    { classes: 1, amount: "", program: "", level: "", time: "", mode: "" },
  ]);

  const [kitPrice, setKitPrice] = useState("");

  const [applyPhysicalToAll, setApplyPhysicalToAll] = useState(true);
  const [applyHybridToAll, setApplyHybridToAll] = useState(true);

  const [centerPhysicalPrices, setCenterPhysicalPrices] = useState({});
  const [centerHybridPrices, setCenterHybridPrices] = useState({});

  const [physicalClassPrices, setPhysicalClassPrices] = useState([
    { classes: 1, amount: "", program: "", level: "", time: "", mode: "" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgrameData();
        if (response.status===200) {
          setPrograms(response.data.programs);
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handler for online class prices
  const handleOnlineClassPriceChange = (index, field, value) => {
    const newPrices = [...onlineClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    // Reset level if program changed
    if (field === "program") {
      newPrices[index].level = "";
    }
    setOnlineClassPrices(newPrices);
  };

  // Handler for hybrid class prices
  const handleHybridClassPriceChange = (index, field, value) => {
    const newPrices = [...hybridClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setHybridClassPrices(newPrices);
  };

  // Add new row for online prices
  const addOnlineClassPrice = () => {
    setOnlineClassPrices([
      ...onlineClassPrices,
      { classes: "", amount: "", program: "", level: "", time: "", mode: "" },
    ]);
  };

  // Add new row for hybrid prices
  const addHybridClassPrice = () => {
    setHybridClassPrices([
      ...hybridClassPrices,
      { classes: "", amount: "", program: "", level: "", time: "", mode: "" },
    ]);
  };

  // Delete row for online prices
  const deleteOnlineClassPrice = (index) => {
    const newPrices = onlineClassPrices.filter((_, i) => i !== index);
    setOnlineClassPrices(newPrices);
  };

  // Delete row for hybrid prices
  const deleteHybridClassPrice = (index) => {
    const newPrices = hybridClassPrices.filter((_, i) => i !== index);
    setHybridClassPrices(newPrices);
  };

  // Handler for physical class prices (when "Apply to all" is ON)
  const handlePhysicalClassPriceChange = (index, field, value) => {
    const newPrices = [...physicalClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setPhysicalClassPrices(newPrices);
  };

  // Handler for center-specific physical prices
  const handleCenterPhysicalPriceChange = (centerId, index, field, value) => {
    const centerPrices = centerPhysicalPrices[centerId] || [...physicalClassPrices];
    const newPrices = [...centerPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setCenterPhysicalPrices({
      ...centerPhysicalPrices,
      [centerId]: newPrices,
    });
  };

  // Handler for center-specific hybrid prices
  const handleCenterHybridPriceChange = (centerId, index, field, value) => {
    const centerPrices = centerHybridPrices[centerId] || [...hybridClassPrices];
    const newPrices = [...centerPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setCenterHybridPrices({
      ...centerHybridPrices,
      [centerId]: newPrices,
    });
  };

  // Add new row for physical class prices
  const addPhysicalClassPrice = () => {
    setPhysicalClassPrices([
      ...physicalClassPrices,
      { classes: "", amount: "", program: "", level: "", time: "", mode: "" },
    ]);
  };

  // Delete row for physical class prices
  const deletePhysicalClassPrice = (index) => {
    const newPrices = physicalClassPrices.filter((_, i) => i !== index);
    setPhysicalClassPrices(newPrices);
  };

  // Add new row for center-specific physical prices
  const addCenterPhysicalClassPrice = (centerId) => {
    const centerPrices = centerPhysicalPrices[centerId] || [...physicalClassPrices];
    setCenterPhysicalPrices({
      ...centerPhysicalPrices,
      [centerId]: [...centerPrices, { classes: "", amount: "", program: "", level: "", time: "", mode: "" }],
    });
  };

  // Add new row for center-specific hybrid prices
  const addCenterHybridClassPrice = (centerId) => {
    const centerPrices = centerHybridPrices[centerId] || [...hybridClassPrices];
    setCenterHybridPrices({
      ...centerHybridPrices,
      [centerId]: [...centerPrices, { classes: "", amount: "", program: "", level: "", time: "", mode: "" }],
    });
  };

  // Delete row for center-specific physical prices
  const deleteCenterPhysicalClassPrice = (centerId, index) => {
    const centerPrices = centerPhysicalPrices[centerId] || [...physicalClassPrices];
    const newPrices = centerPrices.filter((_, i) => i !== index);
    setCenterPhysicalPrices({
      ...centerPhysicalPrices,
      [centerId]: newPrices,
    });
  };

  // Delete row for center-specific hybrid prices
  const deleteCenterHybridClassPrice = (centerId, index) => {
    const centerPrices = centerHybridPrices[centerId] || [...hybridClassPrices];
    const newPrices = centerPrices.filter((_, i) => i !== index);
    setCenterHybridPrices({
      ...centerHybridPrices,
      [centerId]: newPrices,
    });
  };

  // Mock submit handlers for new functionality
  const handleSubmitOnlineClasses = async() => {
    console.log("Submitting online classes pricing:", onlineClassPrices)
    try{
      const respose = await submitOnlineClassPrice(onlineClassPrices)
      console.log("response",respose)

    }catch(err){
      console.log("errorin submittingthe online class price",err)

    }
  };

  const handleSubmitPhysicalClasses = () => {
    console.log("Submitting physical classes pricing:", physicalClassPrices);
    // Implement actual API call here
  };

  const handleSubmitHybridClasses = () => {
    console.log("Submitting hybrid classes pricing:", hybridClassPrices);
    // Implement actual API call here
  };

  const handleSubmitKitPrice = () => {
    console.log("Submitting kit price:", kitPrice);
    // Implement actual API call here
  };

  const handleSubmitCenterPhysicalPrices = (centerId) => {
    console.log(
      "Submitting center physical prices for center:",
      centerId,
      centerPhysicalPrices[centerId]
    );
    // Implement actual API call here
  };

  const handleSubmitCenterHybridPrices = (centerId) => {
    console.log(
      "Submitting center hybrid prices for center:",
      centerId,
      centerHybridPrices[centerId]
    );
    // Implement actual API call here
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Set Class Price
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="class type tabs"
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label="Online Classes"
              id="class-tab-0"
              aria-controls="class-tabpanel-0"
              icon={<School />}
              iconPosition="start"
            />
            <Tab
              label="Physical Center Classes"
              id="class-tab-1"
              aria-controls="class-tabpanel-1"
              icon={<LocationOn />}
              iconPosition="start"
            />
            <Tab
              label="Hybrid Classes"
              id="class-tab-2"
              aria-controls="class-tabpanel-2"
              icon={<SyncIcon />}
              iconPosition="start"
            />
            <Tab
              label="Kit"
              id="class-tab-3"
              aria-controls="class-tabpanel-3"
              icon={<KitIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Online Classes Tab */}
        <TabPanel value={tabValue} index={0}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Online Class Pricing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set prices for different numbers of online classes (including GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Online Class-Amount Rows */}
              <Box sx={{ mt: 3 }}>
                {onlineClassPrices.map((price, index) => (
                  <ClassAmountRow
                    key={index}
                    index={index}
                    data={price}
                    onChange={handleOnlineClassPriceChange}
                    onDelete={deleteOnlineClassPrice}
                    disableDelete={onlineClassPrices.length === 1}
                    isHybrid={false} // Explicitly set to false for online classes
                    programs={programs}
                  />
                ))}

                {/* Add Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addOnlineClassPrice}
                    variant="outlined"
                    size="small"
                  >
                    Add Price Point
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitOnlineClasses}
                    disabled={
                      loading ||
                      onlineClassPrices.some(
                        (p) =>
                          !p.classes ||
                          !p.amount ||
                          !p.program ||
                          !p.level ||
                          !p.time
                      )
                    }
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Physical Centers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" color="primary" gutterBottom>
                Physical Center Class Pricing
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={applyPhysicalToAll}
                    onChange={(e) => setApplyPhysicalToAll(e.target.checked)}
                    color="primary"
                  />
                }
                label="Apply to all centers"
              />
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Set pricing for physical center classes (including GST)
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* When "Apply to all centers" is ON */}
            {applyPhysicalToAll && (
              <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 4 }}>
                <CardContent>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    Common Pricing for All Centers
                  </Typography>

                  {/* Physical Class-Amount Rows */}
                  <Box sx={{ mt: 3 }}>
                    {physicalClassPrices.map((price, index) => (
                      <ClassAmountRow
                        key={index}
                        index={index}
                        data={price}
                        onChange={handlePhysicalClassPriceChange}
                        onDelete={deletePhysicalClassPrice}
                        disableDelete={physicalClassPrices.length === 1}
                        isHybrid={false} // Explicitly set to false for physical classes
                        programs={programs}
                      />
                    ))}

                    {/* Add Button */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addPhysicalClassPrice}
                        variant="outlined"
                        size="small"
                      >
                        Add Price Point
                      </Button>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmitPhysicalClasses}
                        disabled={
                          loading ||
                          physicalClassPrices.some(
                            (p) =>
                              !p.classes ||
                              !p.amount ||
                              !p.program ||
                              !p.level ||
                              !p.time
                          )
                        }
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Center-specific pricing section - shown in both modes but with different functionality */}
            <Typography variant="h6" color="primary" sx={{ mt: 2, mb: 2 }}>
              {applyPhysicalToAll ? "Centers" : "Center-Specific Pricing"}
            </Typography>

            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {existingCenters.length > 0 ? (
                  existingCenters.map((center) => (
                    <Grid item xs={12} key={center.id}>
                      <Card
                        elevation={1}
                        sx={{
                          borderRadius: 2,
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              flexWrap: "wrap",
                              gap: 2,
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 500, mb: 0.5 }}
                              >
                                {center.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                                {center.location || "Location not specified"}
                              </Typography>
                            </Box>
                          </Box>

                          {/* When "Apply to all centers" is OFF, show multiple class/amount inputs */}
                          {!applyPhysicalToAll ? (
                            <>
                              <Divider sx={{ my: 2 }} />

                              {/* Center-specific Physical Class-Amount Rows */}
                              {(
                                centerPhysicalPrices[center.id] || [
                                  ...physicalClassPrices,
                                ]
                              ).map((price, index) => (
                                <ClassAmountRow
                                  key={index}
                                  index={index}
                                  data={price}
                                  onChange={(idx, field, value) =>
                                    handleCenterPhysicalPriceChange(
                                      center.id,
                                      idx,
                                      field,
                                      value
                                    )
                                  }
                                  onDelete={(idx) =>
                                    deleteCenterPhysicalClassPrice(
                                      center.id,
                                      idx
                                    )
                                  }
                                  disableDelete={
                                    (
                                      centerPhysicalPrices[center.id] ||
                                      physicalClassPrices
                                    ).length === 1
                                  }
                                  isHybrid={false} // Explicitly set to false
                                  programs={programs}
                                />
                              ))}

                              {/* Add Button for Center-specific Physical Pricing */}
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  mt: 2,
                                }}
                              >
                                <Button
                                  startIcon={<AddIcon />}
                                  onClick={() =>
                                    addCenterPhysicalClassPrice(center.id)
                                  }
                                  variant="outlined"
                                  size="small"
                                >
                                  Add Price Point
                                </Button>

                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    handleSubmitCenterPhysicalPrices(center.id)
                                  }
                                  disabled={
                                    loading ||
                                    (
                                      centerPhysicalPrices[center.id] ||
                                      physicalClassPrices
                                    ).some(
                                      (p) =>
                                        !p.classes ||
                                        !p.amount ||
                                        !p.program ||
                                        !p.level ||
                                        !p.time
                                    )
                                  }
                                  size="medium"
                                >
                                  {loading ? (
                                    <CircularProgress size={20} />
                                  ) : (
                                    "Save"
                                  )}
                                </Button>
                              </Box>
                            </>
                          ) : (
                            // When "Apply to all centers" is ON, show only a view of the center
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                mt: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Using common pricing settings
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Alert
                      severity="info"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      No physical centers found. Please add physical centers
                      first to set pricing.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </TabPanel>

        {/* Hybrid Classes Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  Hybrid Class Pricing
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={applyHybridToAll}
                      onChange={(e) => setApplyHybridToAll(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Apply to all centers"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set prices for different numbers of hybrid classes (including GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Hybrid Class-Amount Rows */}
              <Box sx={{ mt: 3 }}>
                {hybridClassPrices.map((price, index) => (
                  <ClassAmountRow
                    key={index}
                    index={index}
                    data={price}
                    onChange={handleHybridClassPriceChange}
                    onDelete={deleteHybridClassPrice}
                    disableDelete={hybridClassPrices.length === 1}
                    isHybrid={true}
                    programs={programs}
                  />
                ))}

                {/* Add Button */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addHybridClassPrice}
                    variant="outlined"
                    size="small"
                  >
                    Add Price Point
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitHybridClasses}
                    disabled={
                      loading ||
                      hybridClassPrices.some(
                        (p) =>
                          !p.classes ||
                          !p.amount ||
                          !p.program ||
                          !p.level ||
                          !p.time
                      )
                    }
                  >
                    {loading ? <CircularProgress size={24} /> : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Center-specific Hybrid Pricing when "Apply to all" is off */}
          {!applyHybridToAll && (
            <>
              <Typography variant="h6" color="primary" sx={{ mt: 4, mb: 2 }}>
                Center-Specific Hybrid Pricing
              </Typography>
              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  {existingCenters.length > 0 ? (
                    existingCenters.map((center) => (
                      <Grid item xs={12} key={center.id}>
                        <Card
                          elevation={1}
                          sx={{
                            borderRadius: 2,
                            transition: "all 0.3s",
                            "&:hover": {
                              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              {center.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                              {center.location || "Location not specified"}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Center-specific Hybrid Class-Amount Rows */}
                            {(
                              centerHybridPrices[center.id] || [...hybridClassPrices]
                            ).map((price, index) => (
                              <ClassAmountRow
                                key={index}
                                index={index}
                                data={price}
                                onChange={(idx, field, value) =>
                                  handleCenterHybridPriceChange(
                                    center.id,
                                    idx,
                                    field,
                                    value
                                  )
                                }
                                onDelete={(idx) =>
                                  deleteCenterHybridClassPrice(center.id, idx)
                                }
                                disableDelete={
                                  (
                                    centerHybridPrices[center.id] || hybridClassPrices
                                  ).length === 1
                                }
                                isHybrid={true}
                                programs={programs}
                              />
                            ))}

                            {/* Add Button for Center-specific Hybrid Pricing */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mt: 2,
                              }}
                            >
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() =>
                                  addCenterHybridClassPrice(center.id)
                                }
                                variant="outlined"
                                size="small"
                              >
                                Add Price Point
                              </Button>

                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                  handleSubmitCenterHybridPrices(center.id)
                                }
                                disabled={
                                  loading ||
                                  (
                                    centerHybridPrices[center.id] || hybridClassPrices
                                  ).some(
                                    (p) =>
                                      !p.classes ||
                                      !p.amount ||
                                      !p.program ||
                                      !p.level ||
                                      !p.time
                                  )
                                }
                                size="medium"
                              >
                                {loading ? <CircularProgress size={20} /> : "Save"}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        No physical centers found. Please add physical centers
                        first to set pricing.
                      </Alert>
                    </Grid>
                  )}
                </Grid>
              )}
            </>
          )}
        </TabPanel>

        {/* Kit Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Kit Pricing
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set the price for the kit (including GST)
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", alignItems: "center", mt: 3 }}>
                <TextField
                  label="Kit Price"
                  type="number"
                  value={kitPrice}
                  onChange={(e) => setKitPrice(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  sx={{ width: 250, mr: 2 }}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmitKitPrice}
                  disabled={loading || !kitPrice}
                  sx={{ height: 56 }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save Changes"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassPricingDialog;


