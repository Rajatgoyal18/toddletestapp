import { useState, useRef, useEffect } from 'react';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ResourcePreviewModal from './ResourcePreviewModal';
import ModuleItem from './ModuleItem';
import Outline from './Outline';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  const [previewItem, setPreviewItem] = useState(null);

  const [activeModuleId, setActiveModuleId] = useState(null);
  const moduleRefs = useRef({});

  const [searchValue, setSearchValue] = useState('');

  const handleAddClick = type => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        // This is handled through the module card now
        break;
      case 'upload':
        // This is handled through the module card now
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = module => {
    if (currentModule) {
      // Edit existing module
      setModules(modules.map(m => (m.id === module.id ? module : m)));
    } else {
      // Add new module
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = module => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = moduleId => {
    setModules(modules.filter(module => module.id !== moduleId));
    // Also remove any items associated with this module
    setItems(items.filter(item => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') {
      setIsLinkModalOpen(true);
    } else if (type === 'file') {
      setIsUploadModalOpen(true);
    }
  };

  const handleSaveLink = linkItem => {
    setItems([...items, linkItem]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = fileItem => {
    setItems([...items, fileItem]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = itemId => {
    setItems(items.filter(item => item.id !== itemId));
  };

  // Move module in the list
  const moveModule = (fromIndex, toIndex) => {
    setModules(prevModules => {
      const updated = [...prevModules];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      return updated;
    });
  };

  // Move resource item in the list or between modules/outside
  const moveItem = (dragged, hover) => {
    setItems(prevItems => {
      const updated = [...prevItems];
      // Find the dragged item
      const dragIdx = updated.findIndex(i => i.id === dragged.id);
      if (dragIdx === -1) return updated;
      const item = { ...updated[dragIdx], moduleId: hover.moduleId };
      // Remove from old position
      updated.splice(dragIdx, 1);
      // Find new position (in the new module or outside)
      const filtered = updated.filter(i => (hover.moduleId ? i.moduleId === hover.moduleId : !i.moduleId));
      let insertIdx = hover.index;
      if (hover.moduleId) {
        // Find the index in the full array
        const before = updated.findIndex(i => i.moduleId === hover.moduleId);
        insertIdx = before + hover.index;
      } else {
        // For outside, count only items with no moduleId
        insertIdx = updated.findIndex((i, idx) => !i.moduleId && idx === hover.index);
        if (insertIdx === -1) insertIdx = updated.length;
      }
      updated.splice(insertIdx, 0, item);
      return updated;
    });
  };

  // Scroll to module when selected in outline
  const handleSelectModule = moduleId => {
    setActiveModuleId(moduleId);
    const ref = moduleRefs.current[moduleId];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Update active module on scroll
  useEffect(() => {
    const handleScroll = () => {
      const entries = Object.entries(moduleRefs.current);
      let current = null;
      for (const [id, ref] of entries) {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top < 120) {
            current = id;
          }
        }
      }
      setActiveModuleId(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter logic for search
  const getFilteredModulesAndItems = () => {
    if (!searchValue.trim()) {
      return { filteredModules: modules, filteredItems: items };
    }
    const q = searchValue.trim().toLowerCase();
    // Modules that match
    const matchingModules = modules.filter(m => m.name.toLowerCase().includes(q));
    // Items that match
    const matchingItems = items.filter(item => {
      if (item.type === 'link') {
        return (
          item.title.toLowerCase().includes(q) ||
          (item.url && item.url.toLowerCase().includes(q))
        );
      }
      if (item.type === 'file') {
        return (
          item.title.toLowerCase().includes(q) ||
          (item.fileName && item.fileName.toLowerCase().includes(q))
        );
      }
      return false;
    });
    // Modules to show: those that match, or have a matching item
    const moduleIdsToShow = new Set([
      ...matchingModules.map(m => m.id),
      ...matchingItems.filter(i => i.moduleId).map(i => i.moduleId),
    ]);
    const filteredModules = modules.filter(m => moduleIdsToShow.has(m.id));
    // Items to show: those in shown modules, or outside modules and matching
    const filteredItems = items.filter(item => {
      if (!item.moduleId) {
        // Only show outside-module items if they match
        return matchingItems.some(i => i.id === item.id);
      }
      // Show all items for a matching module, or just matching items for non-matching modules
      return moduleIdsToShow.has(item.moduleId)
        ? (matchingModules.some(m => m.id === item.moduleId) ? true : matchingItems.some(i => i.id === item.id))
        : false;
    });
    return { filteredModules, filteredItems };
  };

  const { filteredModules, filteredItems } = getFilteredModulesAndItems();

  return (
    <div className="course-builder">
      <Header onAddClick={handleAddClick} searchValue={searchValue} onSearchChange={setSearchValue} />
      <div className="builder-layout">
        <Outline
          modules={filteredModules}
          activeModuleId={activeModuleId}
          onSelectModule={handleSelectModule}
        />
        <div className="builder-content">
          {/* Resources outside modules */}
          {filteredItems.filter(item => !item.moduleId).length > 0 && (
            <div className="outside-module-section">
              <h3>Resources outside modules</h3>
              <div className="outside-module-list">
                {filteredItems.filter(item => !item.moduleId).map((item, idx) => (
                  <ModuleItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteItem}
                    onPreview={setPreviewItem}
                    index={idx}
                    moveItem={moveItem}
                    moduleId={null}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Modules and their resources */}
          {filteredModules.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="module-list">
              {filteredModules.map((module, idx) => (
                <div
                  key={module.id}
                  ref={el => (moduleRefs.current[module.id] = el)}
                  className="module-section"
                >
                  <ModuleCard
                    module={module}
                    items={filteredItems}
                    onEdit={handleEditModule}
                    onDelete={handleDeleteModule}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onPreview={setPreviewItem}
                    index={idx}
                    moveModule={moveModule}
                    moveItem={moveItem}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Module Modal */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
        modules={modules}
      />

      {/* Link Modal */}
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
        items={items}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
        items={items}
      />

      {/* Resource Preview Modal */}
      <ResourcePreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
      />
    </div>
  );
};

export default CourseBuilder;
