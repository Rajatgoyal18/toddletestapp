import React from 'react';

const Outline = ({ modules, activeModuleId, onSelectModule }) => {
  return (
    <nav className="outline-sidebar">
      <h3 className="outline-title">Outline</h3>
      <ul className="outline-list">
        {modules.map(module => (
          <li
            key={module.id}
            className={`outline-item${module.id === activeModuleId ? ' active' : ''}`}
            onClick={() => onSelectModule(module.id)}
          >
            {module.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Outline;