import { useState, useEffect } from 'react';

const ModuleModal = ({ isOpen, onClose, onSave, module = null, modules = [] }) => {
  const [moduleName, setModuleName] = useState(module ? module.name : '');
  const [error, setError] = useState('');

  useEffect(() => {
    setModuleName(module ? module.name : '');
    setError('');
  }, [isOpen, module]);

  const validate = name => {
    if (!name.trim()) return 'Module name cannot be empty.';
    const duplicate = modules.some(
      m => m.name.trim().toLowerCase() === name.trim().toLowerCase() && (!module || m.id !== module.id)
    );
    if (duplicate) return 'Module name must be unique.';
    return '';
  };

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate(moduleName);
    if (err) {
      setError(err);
      return;
    }
    onSave({
      id: module ? module.id : Date.now().toString(),
      name: moduleName.trim(),
    });
    setModuleName('');
    setError('');
  };

  if (!isOpen) return null;

  const isInvalid = !!validate(moduleName);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{module ? 'Edit module' : 'Create new module'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="module-name">Module name</label>
              <input
                id="module-name"
                type="text"
                value={moduleName}
                onChange={e => {
                  setModuleName(e.target.value);
                  setError('');
                }}
                placeholder="Introduction to Trigonometry"
                className="form-input"
                autoFocus
              />
              {error && <div className="form-error">{error}</div>}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-create" disabled={isInvalid}>
              {module ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleModal;
