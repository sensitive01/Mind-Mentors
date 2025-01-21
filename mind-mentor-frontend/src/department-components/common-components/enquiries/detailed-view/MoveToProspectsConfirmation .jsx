import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { X } from "lucide-react";

const MoveToProspectsConfirmation = ({ open, onClose, onConfirm, studentName }) => {
  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            background: "linear-gradient(#642b8f, #aa88be)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Confirm Move to Prospects
          <IconButton onClick={onClose} sx={{ color: "#ffffff" }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <div className="flex flex-col gap-4">
            <p>Are you sure you want to move {studentName} to prospects?</p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{ color: "#642b8f", borderColor: "#642b8f" }}
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                variant="contained"
                sx={{ bgcolor: "#642b8f", "&:hover": { bgcolor: "#7b3ca8" } }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>{" "}
    </div>
  );
};

export default MoveToProspectsConfirmation;
