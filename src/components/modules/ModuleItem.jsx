import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ITEM_TYPE = 'RESOURCE_ITEM';

const ModuleItem = ({ item, onDelete, onPreview, index, moveItem, moduleId }) => {
  const ref = useRef(null);

  // Drag and drop hooks
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const dragModuleId = draggedItem.moduleId;
      const hoverModuleId = moduleId;
      if (dragIndex === hoverIndex && dragModuleId === hoverModuleId) return;
      moveItem(draggedItem, { index: hoverIndex, moduleId: hoverModuleId });
      draggedItem.index = hoverIndex;
      draggedItem.moduleId = hoverModuleId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: item.id, index, moduleId },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleDelete = e => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handlePreview = e => {
    e.stopPropagation();
    if (onPreview) onPreview(item);
  };

  if (item.type === 'link') {
    return (
      <div className="module-item link-item" onClick={handlePreview} ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-link">🔗</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <a
              href={item.url}
              className="item-url"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
            >
              {item.url}
            </a>
          </div>
        </div>
        <button className="item-delete" onClick={handleDelete}>
          <span className="delete-icon">🗑️</span>
        </button>
      </div>
    );
  }

  if (item.type === 'file') {
    return (
      <div className="module-item file-item" onClick={handlePreview} ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="item-content">
          <div className="item-icon">
            <span className="icon-file">📄</span>
          </div>
          <div className="item-info">
            <h4 className="item-title">{item.title}</h4>
            <p className="item-details">
              {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
            </p>
          </div>
        </div>
        <button className="item-delete" onClick={handleDelete}>
          <span className="delete-icon">🗑️</span>
        </button>
      </div>
    );
  }

  return null; // Fallback for unknown item types
};

export default ModuleItem;
