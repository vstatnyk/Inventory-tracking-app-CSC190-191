import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
} from "@mui/material";
import PropTypes from "prop-types";

const SetUrlDialog = ({
  urlDialogOpen,
  handleUrlDialogClose,
  url,
  setUrl,
  handleUrlUpdate,
}) => {
  return (
    <Dialog open={urlDialogOpen} onClose={handleUrlDialogClose}>
      <DialogTitle>Set URL</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="url"
          label="URL"
          type="text"
          fullWidth
          variant="standard"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUrlDialogClose}>Cancel</Button>
        <Button onClick={handleUrlUpdate}>Update URL</Button>
      </DialogActions>
    </Dialog>
  );
};

SetUrlDialog.propTypes = {
  urlDialogOpen: PropTypes.bool.isRequired,
  handleUrlDialogClose: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  handleUrlUpdate: PropTypes.func.isRequired,
};

export default SetUrlDialog;
