import {
    CheckCircle as CheckCircleIcon,
    CloudUpload as CloudUploadIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Container,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Step,
    StepContent,
    StepLabel,
    Stepper,
    Tooltip,
    Typography
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const EmployeeDocumentUpload = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [documents, setDocuments] = useState({});
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentFiles, setCurrentFiles] = useState([]);
  const documentCategories = [
    { 
      label: 'Personal Documents', 
      value: 'personal', 
      types: ['Passport', 'Aadhar Card', 'PAN Card', 'Driving License']
    },
    { 
      label: 'Professional Documents', 
      value: 'professional', 
      types: ['Offer Letter', 'Experience Certificate', 'Salary Slip', 'Employment Contract']
    },
    { 
      label: 'Educational Documents', 
      value: 'educational', 
      types: ['Degree Certificate', 'Mark Sheets', 'Diploma', 'Academic Transcripts']
    },
    { 
      label: 'Other Documents', 
      value: 'other', 
      types: ['Medical Certificate', 'Insurance Documents', 'Miscellaneous']
    }
  ];
  const onDrop = useCallback((acceptedFiles) => {
    const newDocuments = acceptedFiles.map(file => ({
      file,
      type: '',
      uploadDate: new Date(),
      id: `${file.name}-${Date.now()}`,
      status: 'pending'
    }));
    setCurrentFiles(newDocuments);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5 * 1024 * 1024 // 5MB file size limit
  });
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
    setDocuments({});
    setCurrentCategory(null);
    setCurrentFiles([]);
  };
  const handleCategorySelection = (category) => {
    setCurrentCategory(category);
    handleNext();
  };
  const handleFileTypeAssignment = () => {
    const updatedFiles = currentFiles.map(file => ({
      ...file,
      status: 'completed'
    }));
    setDocuments(prevDocs => ({
      ...prevDocs,
      [currentCategory]: [
        ...(prevDocs[currentCategory] || []),
        ...updatedFiles
      ]
    }));
    handleNext();
  };
  const removeDocument = (id) => {
    setDocuments(prevDocs => {
      const updatedCategory = (prevDocs[currentCategory] || [])
        .filter(doc => doc.id !== id);
      return {
        ...prevDocs,
        [currentCategory]: updatedCategory
      };
    });
  };
  const renderCategoryStep = () => (
    <Grid container spacing={2}>
      {documentCategories.map((category) => (
        <Grid item xs={12} sm={6} key={category.value}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={() => handleCategorySelection(category.value)}
            sx={{ 
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Typography variant="body" style={{color:"#642b8f",fontSize:"20px"}}>{category.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {category.types.join(', ')}
            </Typography>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
  const renderUploadStep = () => (
    <Box 
      {...getRootProps()} 
      sx={{ 
        border: '2px dashed', 
        borderColor: isDragActive ? '#642b8f.main' : 'grey.400',
        p: 4, 
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <input {...getInputProps()} />
      <CloudUploadIcon color="#642b8f" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h6">
  {isDragActive 
    ? 'Drop files here' 
    : `Upload ${documentCategories.find(c => c.value === currentCategory)?.label || 'Documents'}`}
</Typography>
      <Typography variant="body2" color="text.secondary">
        PDF, JPEG, PNG, DOC, DOCX (Max 5MB)
      </Typography>
    </Box>
  );
  const renderFileTypeStep = () => (
    <Grid container spacing={2}>
      {currentFiles.map((file, index) => (
        <Grid item xs={12} key={file.id}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={6}>
                <Typography>{file.file.name}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Select
                  fullWidth
                  displayEmpty
                  value={file.type}
                  onChange={(e) => {
                    const updatedFiles = [...currentFiles];
                    updatedFiles[index].type = e.target.value;
                    setCurrentFiles(updatedFiles);
                  }}
                >
                  <MenuItem value="" disabled>Select Document Type</MenuItem>
                  {documentCategories
                    .find(c => c.value === currentCategory)
                    .types.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
  const renderReviewStep = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Uploaded Documents
      </Typography>
      <List>
        {documents[currentCategory]?.map((doc) => (
          <ListItem key={doc.id} divider>
            <ListItemText 
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {doc.file.name}
                  {doc.status === 'completed' && (
                    <Tooltip title="Document Verified">
                      <CheckCircleIcon color="#f8a213" fontSize="small" />
                    </Tooltip>
                  )}
                </Box>
              }
              secondary={`Type: ${doc.type}`} 
            />
            <ListItemSecondaryAction>
              <Tooltip title="Remove Document">
                <IconButton 
                  edge="end" 
                  onClick={() => removeDocument(doc.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          color="#642b8f"
        >
          Employee Document Upload
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical" style={{color:"#f8a213"}}>
          <Step  >
            <StepLabel>Select Document Category</StepLabel>
            <StepContent style={{color:"#f8a213"}}>
              {renderCategoryStep()}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Upload Documents</StepLabel>
            <StepContent>
              {renderUploadStep()}
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1, color:"#ffffff", background:"#642b8f" }}
                    disabled={currentFiles.length === 0}
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, color:"#642b8f" }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Assign Document Types</StepLabel>
            <StepContent>
              {renderFileTypeStep()}
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleFileTypeAssignment}
                    sx={{ mt: 1, mr: 1, color:"#ffffff", background:"#642b8f" }}
                    disabled={currentFiles.some(file => !file.type)}
                  >
                    Save Documents
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1,color:"#642b8f" }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Review Documents</StepLabel>
            <StepContent>
              {renderReviewStep()}
              <Box sx={{ mb: 2, mt: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1, color:"#ffffff", background:"#642b8f" }}
                  >
                    Finish
                  </Button>
                  <Button
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1,color:"#642b8f" }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
        {activeStep === 4 && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All documents uploaded successfully!</Typography>
            <Button onClick={handleReset}                     sx={{ mt: 1, mr: 1, color:"#ffffff", background:"#642b8f" }}
 >
              Upload More Documents
            </Button>
          </Paper>
        )}
      </Paper>
    </Container>
  );
};
export default EmployeeDocumentUpload;