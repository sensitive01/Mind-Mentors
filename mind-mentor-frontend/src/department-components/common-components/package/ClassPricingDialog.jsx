import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  getAllProgrameData,
  saveHybridClassPricing,
  setKitPriceData,
  submitHybridClassPriceWithCenter,
  submitOnlineClassPrice,
  submitPhysicalCenterClassPrice,
  submitPhysicalCenterClassPriceWithCenter,
} from "../../../api/service/employee/EmployeeService";
import { toast } from "react-toastify";
import ClassPriceForm from "./ClassPriceForm";

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
    <Box
      sx={{ display: "flex", alignItems: "center", mb: 2, flexWrap: "wrap" }}
    >
      <FormControl
        variant="outlined"
        size="small"
        sx={{ width: 150, mr: 2, mb: 1 }}
      >
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

      <FormControl
        variant="outlined"
        size="small"
        sx={{ width: 150, mr: 2, mb: 1 }}
      >
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

      {isHybrid && (
        <FormControl
          variant="outlined"
          size="small"
          sx={{ width: 150, mr: 2, mb: 1 }}
        >
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

      <FormControl
        variant="outlined"
        size="small"
        sx={{ width: 150, mr: 2, mb: 1 }}
      >
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

      {isHybrid && (
        <TextField
          label="Number of class from"
          type="number"
          value={data.classStartFrom || ""}
          onChange={(e) => onChange(index, "classStartFrom", e.target.value)}
          sx={{ width: 150, mr: 2, mb: 1 }}
          variant="outlined"
          size="small"
        />
      )}

      {isHybrid ? (
        <TextField
          label="Number of class upto"
          type="number"
          value={data.classUpTo || ""}
          onChange={(e) => onChange(index, "classUpTo", e.target.value)}
          sx={{ width: 150, mr: 2, mb: 1 }}
          variant="outlined"
          size="small"
        />
      ) : (
        <>
          <TextField
            label="Class Start from"
            type="number"
            value={data.classStartFrom || ""}
            onChange={(e) => onChange(index, "classStartFrom", e.target.value)}
            sx={{ width: 150, mr: 2, mb: 1 }}
            variant="outlined"
            size="small"
          />
          <TextField
            label="Classes Up To"
            type="number"
            value={data.classUpTo || ""}
            onChange={(e) => onChange(index, "classUpTo", e.target.value)}
            sx={{ width: 150, mr: 2, mb: 1 }}
            variant="outlined"
            size="small"
          />
        </>
      )}

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
  onDataUpdate, // Add this prop to handle data updates
}) => {
  const [tabValue, setTabValue] = useState(0);

  const [programs, setPrograms] = useState([]);

  const [onlineClassPrices, setOnlineClassPrices] = useState([
    {
      classStartFrom: 1,
      classUpTo: 8,
      amount: onlinePrice || "",
      program: "",
      level: "",
      time: "",
      mode: "",
    },
  ]);

  const [hybridClassPrices, setHybridClassPrices] = useState([
    {
      classStartFrom: 1,
      classUpTo: 8,
      amount: "",
      program: "",
      level: "",
      time: "",
      mode: "",
    },
  ]);

  const [kitPrice, setKitPrice] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [applyPhysicalToAll, setApplyPhysicalToAll] = useState(true);
  const [applyHybridToAll, setApplyHybridToAll] = useState(true);

  const [centerPhysicalPrices, setCenterPhysicalPrices] = useState({});
  const [centerHybridPrices, setCenterHybridPrices] = useState({});

  const [physicalClassPrices, setPhysicalClassPrices] = useState([
    {
      classStartFrom: 1,
      classUpTo: 8,
      amount: "",
      program: "",
      level: "",
      time: "",
      mode: "",
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProgrameData();
        if (response.status === 200) {
          setPrograms(response.data.programs);
        }
      } catch (error) {
        console.error("Failed to fetch programs:", error);
      }
    };
    fetchData();
  }, []);

  const resetForm = () => {
    setOnlineClassPrices([
      {
        classStartFrom: 1,
        classUpTo: 8,
        amount: onlinePrice || "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
    setHybridClassPrices([
      {
        classStartFrom: 1,
        classUpTo: 8,
        amount: "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
    setPhysicalClassPrices([
      {
        classStartFrom: 1,
        classUpTo: 8,
        amount: "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
    setKitPrice("");
    setQuantity(1);
    setCenterPhysicalPrices({});
    setCenterHybridPrices({});
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOnlineClassPriceChange = (index, field, value) => {
    const newPrices = [...onlineClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setOnlineClassPrices(newPrices);
  };

  const handleHybridClassPriceChange = (index, field, value) => {
    const newPrices = [...hybridClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setHybridClassPrices(newPrices);
  };

  const addOnlineClassPrice = () => {
    setOnlineClassPrices([
      ...onlineClassPrices,
      {
        classStartFrom: "",
        classUpTo: "",
        amount: "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
  };

  const addHybridClassPrice = () => {
    setHybridClassPrices([
      ...hybridClassPrices,
      {
        classStartFrom: "",
        classUpTo: "",
        amount: "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
  };

  const deleteOnlineClassPrice = (index) => {
    const newPrices = onlineClassPrices.filter((_, i) => i !== index);
    setOnlineClassPrices(newPrices);
  };

  const deleteHybridClassPrice = (index) => {
    const newPrices = hybridClassPrices.filter((_, i) => i !== index);
    setHybridClassPrices(newPrices);
  };

  const handlePhysicalClassPriceChange = (index, field, value) => {
    const newPrices = [...physicalClassPrices];
    newPrices[index] = { ...newPrices[index], [field]: value };
    if (field === "program") {
      newPrices[index].level = "";
    }
    setPhysicalClassPrices(newPrices);
  };

  const handleCenterPhysicalPriceChange = (centerId, index, field, value) => {
    const centerPrices = centerPhysicalPrices[centerId] || [
      ...physicalClassPrices,
    ];
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

  const addPhysicalClassPrice = () => {
    setPhysicalClassPrices([
      ...physicalClassPrices,
      {
        classStartFrom: "",
        classUpTo: "",
        amount: "",
        program: "",
        level: "",
        time: "",
        mode: "",
      },
    ]);
  };

  const deletePhysicalClassPrice = (index) => {
    const newPrices = physicalClassPrices.filter((_, i) => i !== index);
    setPhysicalClassPrices(newPrices);
  };

  const addCenterPhysicalClassPrice = (centerId) => {
    const centerPrices = centerPhysicalPrices[centerId] || [
      ...physicalClassPrices,
    ];
    setCenterPhysicalPrices({
      ...centerPhysicalPrices,
      [centerId]: [
        ...centerPrices,
        {
          classStartFrom: "",
          classUpTo: "",
          amount: "",
          program: "",
          level: "",
          time: "",
          mode: "",
        },
      ],
    });
  };

  const addCenterHybridClassPrice = (centerId) => {
    const centerPrices = centerHybridPrices[centerId] || [...hybridClassPrices];
    setCenterHybridPrices({
      ...centerHybridPrices,
      [centerId]: [
        ...centerPrices,
        {
          classStartFrom: "",
          classUpTo: "",
          amount: "",
          program: "",
          level: "",
          time: "",
          mode: "",
        },
      ],
    });
  };

  const deleteCenterPhysicalClassPrice = (centerId, index) => {
    const centerPrices = centerPhysicalPrices[centerId] || [
      ...physicalClassPrices,
    ];
    const newPrices = centerPrices.filter((_, i) => i !== index);
    setCenterPhysicalPrices({
      ...centerPhysicalPrices,
      [centerId]: newPrices,
    });
  };

  const deleteCenterHybridClassPrice = (centerId, index) => {
    const centerPrices = centerHybridPrices[centerId] || [...hybridClassPrices];
    const newPrices = centerPrices.filter((_, i) => i !== index);
    setCenterHybridPrices({
      ...centerHybridPrices,
      [centerId]: newPrices,
    });
  };

  const handleSubmitOnlineClasses = async () => {
    console.log("Submitting online classes pricing:", onlineClassPrices);
    try {
      const response = await submitOnlineClassPrice(onlineClassPrices);
      console.log("response", response);
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          resetForm();
          onClose();
          if (onDataUpdate) {
            onDataUpdate();
          }
        }, 1500);
      }
    } catch (err) {
      console.log("error in submitting the online class price", err);
      toast.error("Failed to submit online class pricing");
    }
  };

  const handleSubmitPhysicalClasses = async () => {
    console.log("Submitting physical classes pricing:", physicalClassPrices);
    try {
      const response = await submitPhysicalCenterClassPrice(
        physicalClassPrices,
        applyPhysicalToAll
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          resetForm();
          onClose();
          if (onDataUpdate) {
            onDataUpdate();
          }
        }, 1500);
      }
    } catch (err) {
      console.log("error in submitting physical class price", err);
      toast.error("Failed to submit physical class pricing");
    }
  };

  const handleSubmitHybridClasses = async () => {
    console.log("Submitting hybrid classes pricing:", hybridClassPrices);
    try {
      const response = await saveHybridClassPricing(
        hybridClassPrices,
        applyHybridToAll
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        resetForm();
        onClose();
        if (onDataUpdate) {
          onDataUpdate();
        }
      }
    } catch (err) {
      console.log("error in submitting hybrid class price", err);
      toast.error("Failed to submit hybrid class pricing");
    }
  };

  const handleSubmitKitPrice = async () => {
    try {
      const response = await setKitPriceData(quantity, kitPrice);
      if (response.status === 200) {
        toast.success("Kit price updated successfully");
        resetForm();
        onClose();
        if (onDataUpdate) {
          onDataUpdate();
        }
      }
    } catch (err) {
      console.log("error in submitting kit price", err);
      toast.error("Failed to submit kit price");
    }
  };

  const handleSubmitCenterPhysicalPrices = async (centerId) => {
    try {
      const response = await submitPhysicalCenterClassPriceWithCenter(
        centerId,
        centerPhysicalPrices[centerId],
        applyPhysicalToAll
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        if (onDataUpdate) {
          onDataUpdate();
        }
      }
    } catch (err) {
      console.log("error in submitting center physical prices", err);
      toast.error("Failed to submit center physical prices");
    }
  };

  const handleSubmitCenterHybridPrices = async (centerId) => {
    try {
      const response = await submitHybridClassPriceWithCenter(
        centerId,
        centerHybridPrices[centerId],
        applyPhysicalToAll
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        if (onDataUpdate) {
          onDataUpdate();
        }
      }
    } catch (err) {
      console.log("error in submitting center hybrid prices", err);
      toast.error("Failed to submit center hybrid prices");
    }
  };

  return (
    <ClassPriceForm
      onClose={onClose}
      tabValue={tabValue}
      handleTabChange={handleTabChange}
      TabPanel={TabPanel}
      onlineClassPrices={onlineClassPrices}
      ClassAmountRow={ClassAmountRow}
      handleOnlineClassPriceChange={handleOnlineClassPriceChange}
      deleteOnlineClassPrice={deleteOnlineClassPrice}
      programs={programs}
      addOnlineClassPrice={addOnlineClassPrice}
      handleSubmitOnlineClasses={handleSubmitOnlineClasses}
      loading={loading}
      applyPhysicalToAll={applyPhysicalToAll}
      setApplyPhysicalToAll={setApplyPhysicalToAll}
      physicalClassPrices={physicalClassPrices}
      existingCenters={existingCenters}
      centerPhysicalPrices={centerPhysicalPrices}
      handleCenterPhysicalPriceChange={handleCenterPhysicalPriceChange}
      handlePhysicalClassPriceChange={handlePhysicalClassPriceChange}
      addPhysicalClassPrice={addPhysicalClassPrice}
      deleteCenterPhysicalClassPrice={deleteCenterPhysicalClassPrice}
      handleSubmitPhysicalClasses={handleSubmitPhysicalClasses}
      addCenterPhysicalClassPrice={addCenterPhysicalClassPrice}
      centerHybridPrices={centerHybridPrices}
      handleSubmitCenterPhysicalPrices={handleSubmitCenterPhysicalPrices}
      applyHybridToAll={applyHybridToAll}
      setApplyHybridToAll={setApplyHybridToAll}
      hybridClassPrices={hybridClassPrices}
      handleHybridClassPriceChange={handleHybridClassPriceChange}
      deleteHybridClassPrice={deleteHybridClassPrice}
      handleSubmitHybridClasses={handleSubmitHybridClasses}
      addHybridClassPrice={addHybridClassPrice}
      handleCenterHybridPriceChange={handleCenterHybridPriceChange}
      deleteCenterHybridClassPrice={deleteCenterHybridClassPrice}
      addCenterHybridClassPrice={addCenterHybridClassPrice}
      handleSubmitCenterHybridPrices={handleSubmitCenterHybridPrices}
      quantity={quantity}
      setQuantity={setQuantity}
      kitPrice={kitPrice}
      setKitPrice={setKitPrice}
      handleSubmitKitPrice={handleSubmitKitPrice}
      deletePhysicalClassPrice={deletePhysicalClassPrice}
    />
  );
};

export default ClassPricingDialog;
