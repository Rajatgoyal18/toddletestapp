import { UploadButton } from "@uploadthing/react";
import "@uploadthing/react/styles.css";

const UploadModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Upload file</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <UploadButton
            endpoint="fileUploader"
            onClientUploadComplete={(res) => {
              console.log("Files uploaded", res);
              alert("Upload complete! URL: " + res[0]?.url);
              onClose();
            }}
            onUploadError={(error) => {
              alert(`Upload failed: ${error.message}`);
            }}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
