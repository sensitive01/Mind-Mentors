import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { Card, Paper, Box } from "@mui/material";

// Custom colors
export const customColors = {
  primary: "#642b8f",
  secondary: "#F8A213",
  accent: "#AA88BE",
  highlight: "#F0BA6F",
  background: "#EFE8F0",
};

// Material-UI Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: customColors.primary,
      light: "#818CF8",
    },
    secondary: {
      main: "#EC4899",
      light: "#F472B6",
      dark: "#DB2777",
    },
    warm: {
      main: "#F59E0B",
      light: "#FCD34D",
      dark: "#D97706",
    },
    cold: {
      main: "#3B82F6",
      light: "#60A5FA",
      dark: "#2563EB",
    },
    background: {
      default: "#F1F5F9",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E293B",
      secondary: "#64748B",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "none",
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});

// Styled Components
export const AnimatedCard = styled(Card)({
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: `0 12px 20px rgba(100, 43, 143, 0.2)`,
    cursor: "pointer",
  },
  height: "100%",
  background: customColors.background,
  position: "relative",
});

export const ClassCard = styled(Paper)({
  padding: "16px",
  marginBottom: "16px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  background: "#ffffff",
  borderLeft: `4px solid ${customColors.primary}`,
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: `0 8px 16px rgba(100, 43, 143, 0.2)`,
    borderLeft: `4px solid ${customColors.secondary}`,
  },
});

export const IconText = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "8px",
  "& svg": {
    transition: "transform 0.3s ease-in-out",
  },
  "&:hover svg": {
    transform: "scale(1.1)",
  },
});

export const ModalContent = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "500px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  boxShadow: "0 24px 48px rgba(100, 43, 143, 0.2)",
  padding: "24px",
  outline: "none",
});

export const DetailRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "16px",
  backgroundColor: customColors.background,
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateX(8px)",
  },
});
