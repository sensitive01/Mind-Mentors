/* eslint-disable no-undef */
import {
  Box,
  Typography,
  Modal,
  Backdrop,
  Fade,
  IconButton,
  Button,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  Person as TeacherIcon,
  People as StudentsIcon,
  School as SubjectIcon,
  Close as CloseIcon,
  EventSeat as LevelIcon,
  CalendarToday as DayIcon,
} from "@mui/icons-material";
import { customColors, DetailRow, ModalContent } from "../../../../coach/Layout/customStyle";

const SheduleModal = () => {
  return (
    <div>
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: "rgba(100, 43, 143, 0.4)",
          },
        }}
      >
        <Fade in={modalOpen}>
          <ModalContent
            sx={{
              maxHeight: "80vh",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: customColors.primary,
                borderRadius: "4px",
              },
            }}
          >
            {selectedClass && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",

                    // position: "sticky",
                    top: 0,
                    backgroundColor: "white",
                    zIndex: 10,
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      color: customColors.primary,
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    Class Details
                  </Typography>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      color: customColors.primary,
                      "&:hover": {
                        backgroundColor: `${customColors.primary}20`,
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                <DetailRow>
                  <DayIcon sx={{ color: customColors.primary, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: customColors.primary }}>
                    {selectedDay}
                  </Typography>
                </DetailRow>

                <DetailRow>
                  <SubjectIcon
                    sx={{ color: customColors.secondary, fontSize: 28 }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: customColors.primary }}
                    >
                      {selectedClass.subject}
                    </Typography>
                  </Box>
                </DetailRow>

                <DetailRow>
                  <TimeIcon sx={{ color: customColors.accent, fontSize: 28 }} />
                  <Typography variant="h6" sx={{ color: customColors.accent }}>
                    {selectedClass.time}
                  </Typography>
                </DetailRow>

                <DetailRow>
                  <TeacherIcon
                    sx={{ color: customColors.highlight, fontSize: 28 }}
                  />
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ color: customColors.primary }}
                    >
                      Instructor
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: customColors.highlight }}
                    >
                      {selectedClass.teacher}
                    </Typography>
                  </Box>
                </DetailRow>
                <DetailRow>
                  <StudentsIcon
                    sx={{ color: customColors.secondary, fontSize: 28 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%", 
                    }}
                  >
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: customColors.primary }}
                      >
                        Class Size
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.secondary }}
                      >
                        {selectedClass?.students} Students
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        navigate(
                          `/employeeAssignDemoClass/${selectedClass.id}`
                        );
                      }}
                      disabled={selectedClass.status !== "Scheduled"} 
                      sx={{
                        height: "fit-content",
                        backgroundColor:
                          selectedClass.status !== "Scheduled"
                            ? "#cccccc"
                            : "#642b8f", 
                        color:
                          selectedClass.status !== "Scheduled"
                            ? "black"
                            : "white", 
                        "&:hover": {
                          backgroundColor:
                            selectedClass.status !== "Scheduled"
                              ? "#cccccc"
                              : "#0056b3", 
                        },
                      }}
                    >
                      Add kids
                    </Button>
                  </Box>
                </DetailRow>

                {selectedClass.level && selectedClass.level !== "N/A" && (
                  <DetailRow>
                    <LevelIcon
                      sx={{ color: customColors.accent, fontSize: 28 }}
                    />
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ color: customColors.primary }}
                      >
                        Level
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ color: customColors.accent }}
                      >
                        {selectedClass.level}
                      </Typography>
                    </Box>
                  </DetailRow>
                )}

                {selectedClass.classType && (
                  <DetailRow>
                    <Typography
                      variant="body1"
                      sx={{ color: customColors.primary }}
                    >
                      Class Type: {selectedClass.classType}
                    </Typography>
                  </DetailRow>
                )}

                {selectedClass.status && (
                  <DetailRow>
                    <Typography
                      variant="body1"
                      sx={{ color: customColors.primary }}
                    >
                      Status: {selectedClass.status}
                    </Typography>
                  </DetailRow>
                )}
              </>
            )}
          </ModalContent>
        </Fade>
      </Modal>
    </div>
  );
};

export default SheduleModal;
