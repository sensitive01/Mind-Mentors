import {
  Modal,
  Box,
  Typography,
  IconButton,
  Fade,
  Backdrop,
  Stack,
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

import { customColors } from "../../Layout/customStyle";

const ClassDetailsModal = ({
  modalOpen,
  handleCloseModal,
  selectedClass,
  selectedDay,
}) => {
  if (!selectedClass) return null;

  console.log("selectedClass", selectedClass);

  return (
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
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            borderRadius: 3,
            p: 4,
            width: 440,
            maxWidth: "90%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: 24,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              pb: 2,
              borderBottom: `2px solid ${customColors.primary}20`,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                color: customColors.primary,
                fontWeight: "bold",
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

          {/* Content */}
          <Stack spacing={3}>
            <DetailRow>
              <DayIcon sx={{ color: customColors.primary, fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  color: customColors.primary,
                  ml: 2,
                }}
              >
                {selectedDay}
              </Typography>
            </DetailRow>

            <DetailRow>
              <SubjectIcon
                sx={{ color: customColors.secondary, fontSize: 28 }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" sx={{ color: customColors.primary }}>
                  {selectedClass.program}
                </Typography>
              </Box>
            </DetailRow>

            <DetailRow>
              <TimeIcon sx={{ color: customColors.accent, fontSize: 28 }} />
              <Typography
                variant="h6"
                sx={{
                  color: customColors.accent,
                  ml: 2,
                }}
              >
                {selectedClass.classTime}
              </Typography>
            </DetailRow>

            <DetailRow>
              <TeacherIcon
                sx={{ color: customColors.highlight, fontSize: 28 }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: customColors.primary,
                    mb: 0.5,
                  }}
                >
                  Instructor
                </Typography>
                <Typography variant="h6" sx={{ color: customColors.highlight }}>
                  {selectedClass.coachName}
                </Typography>
              </Box>
            </DetailRow>

            <DetailRow>
              <StudentsIcon
                sx={{ color: customColors.secondary, fontSize: 28 }}
              />
              <Box sx={{ ml: 2, width: "100%" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: customColors.primary,
                    mb: 0.5,
                  }}
                >
                  Students
                </Typography>
                {selectedClass.selectedStudents &&
                selectedClass.selectedStudents.length > 0 ? (
                  <Box
                    sx={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: `1px solid ${customColors.secondary}20`,
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    {selectedClass.selectedStudents.map((student, index) => (
                      <span key={index}>
                        {index > 0 && ", "}
                        {student.kidName}
                      </span>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ color: customColors.secondary }}
                  >
                    No students enrolled
                  </Typography>
                )}
              </Box>
            </DetailRow>

            {selectedClass.level && selectedClass.level !== "N/A" && (
              <DetailRow>
                <LevelIcon sx={{ color: customColors.accent, fontSize: 28 }} />
                <Box sx={{ ml: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: customColors.primary,
                      mb: 0.5,
                    }}
                  >
                    Level
                  </Typography>
                  <Typography variant="h6" sx={{ color: customColors.accent }}>
                    {selectedClass.level}
                  </Typography>
                </Box>
              </DetailRow>
            )}

            {selectedClass.classType && (
              <DetailRow>
                <Box sx={{ ml: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: customColors.primary,
                      fontWeight: 500,
                    }}
                  >
                    Class Type: {selectedClass.classType}
                  </Typography>
                </Box>
              </DetailRow>
            )}

            {selectedClass.status && (
              <DetailRow>
                <Box sx={{ ml: 4 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: customColors.primary,
                      fontWeight: 500,
                    }}
                  >
                    Status: {selectedClass.status}
                  </Typography>
                </Box>
              </DetailRow>
            )}
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};

const DetailRow = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      {children}
    </Box>
  );
};

export default ClassDetailsModal;
