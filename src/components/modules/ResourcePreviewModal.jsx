import { useEffect, useRef } from 'react';

const ResourcePreviewModal = ({ item, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const renderPreview = () => {
    if (item.type === 'link') {
      return (
        <div className="preview-link">
          <h3>{item.title}</h3>
          <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
          {/* Optionally, fetch and show link metadata here */}
        </div>
      );
    }
    if (item.type === 'file') {
      if (item.fileType && item.fileType.startsWith('image/')) {
        // Show image preview
        return (
          <div className="preview-image">
            <h3>{item.title}</h3>
            <img
              src={URL.createObjectURL(item.file)}
              alt={item.title}
              style={{ maxWidth: '100%', maxHeight: 400 }}
            />
            <p>{item.fileName} ({Math.round(item.fileSize / 1024)} KB)</p>
          </div>
        );
      }
      if (item.fileType === 'application/pdf') {
        // Show PDF preview (first page)
        return (
          <div className="preview-pdf">
            <h3>{item.title}</h3>
            <embed
              src={URL.createObjectURL(item.file)}
              type="application/pdf"
              width="100%"
              height="400px"
            />
            <p>{item.fileName} ({Math.round(item.fileSize / 1024)} KB)</p>
          </div>
        );
      }
      // Fallback for other file types
      return (
        <div className="preview-file">
          <h3>{item.title}</h3>
          <p>{item.fileName} ({Math.round(item.fileSize / 1024)} KB)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay" ref={modalRef} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Resource Preview</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

export default ResourcePreviewModal; 