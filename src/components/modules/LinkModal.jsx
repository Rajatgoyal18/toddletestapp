import { useState, useEffect } from 'react';

const LinkModal = ({ isOpen, onClose, onSave, moduleId, items = [] }) => {
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setLinkTitle('');
    setLinkUrl('');
    setError('');
  }, [isOpen]);

  const isValidUrl = url => {
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = (title, url) => {
    if (!title.trim()) return 'Link title cannot be empty.';
    if (!url.trim()) return 'URL cannot be empty.';
    if (!isValidUrl(url.trim())) return 'Please enter a valid URL.';
    const duplicate = items.some(
      i =>
        i.type === 'link' &&
        i.title.trim().toLowerCase() === title.trim().toLowerCase() &&
        (!moduleId || i.moduleId === moduleId)
    );
    if (duplicate) return 'Link title must be unique.';
    return '';
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate(linkTitle, linkUrl);
    if (err) {
      setError(err);
      return;
    }
    onSave({
      id: Date.now().toString(),
      moduleId,
      type: 'link',
      title: linkTitle.trim(),
      url: linkUrl.trim(),
    });
    setLinkTitle('');
    setLinkUrl('');
    setError('');
  };

  if (!isOpen) return null;

  const isInvalid = !!validate(linkTitle, linkUrl);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add a link</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="link-title">Link title</label>
              <input
                id="link-title"
                type="text"
                value={linkTitle}
                onChange={e => {
                  setLinkTitle(e.target.value);
                  setError('');
                }}
                placeholder="Link title"
                className="form-input"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="link-url">URL</label>
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={e => {
                  setLinkUrl(e.target.value);
                  setError('');
                }}
                placeholder="https://example.com"
                className="form-input"
              />
              {error && <div className="form-error">{error}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create"
              disabled={isInvalid}
            >
              Add link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkModal;
