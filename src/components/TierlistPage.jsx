import React, { useState } from 'react';
import './TierlistPage.css';

const TierlistPage = ({ tierList, onUpdateTierList, onFindProfile, onRestart }) => {
  const [draggedCourse, setDraggedCourse] = useState(null);
  const [dragOverTier, setDragOverTier] = useState(null);
  const [originalTierList] = useState(tierList);

  const tierConfig = {
    S: { label: 'S Tier', color: '#FF6B35', description: 'Exceptional' },
    A: { label: 'A Tier', color: '#FF8C00', description: 'Great' },
    B: { label: 'B Tier', color: '#FFB347', description: 'Good' },
    C: { label: 'C Tier', color: '#FFA500', description: 'Decent' }
  };

  const handleDragStart = (e, course, fromTier) => {
    setDraggedCourse({ course, fromTier });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, tier) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTier(tier);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverTier(null);
    }
  };

  const handleDrop = (e, toTier) => {
    e.preventDefault();
    setDragOverTier(null);

    if (!draggedCourse || draggedCourse.fromTier === toTier) {
      setDraggedCourse(null);
      return;
    }

    const newTierList = { ...tierList };
    
    // Remove from original tier
    newTierList[draggedCourse.fromTier] = newTierList[draggedCourse.fromTier].filter(
      course => course.id !== draggedCourse.course.id
    );
    
    // Add to new tier
    newTierList[toTier] = [...newTierList[toTier], draggedCourse.course];
    
    onUpdateTierList(newTierList);
    setDraggedCourse(null);
  };

  const handleDragEnd = () => {
    setDraggedCourse(null);
    setDragOverTier(null);
  };

  const resetTierList = () => {
    onUpdateTierList(originalTierList);
  };

  const renderCourseCard = (course, tier) => (
    <div
      key={course.id}
      className="course-card-tier"
      draggable
      onDragStart={(e) => handleDragStart(e, course, tier)}
      onDragEnd={handleDragEnd}
    >
      <span className="course-name">{course.name}</span>
    </div>
  );

  const renderTier = (tierKey) => {
    const config = tierConfig[tierKey];
    const courses = tierList[tierKey] || [];
    const isDragOver = dragOverTier === tierKey;

    return (
      <div
        key={tierKey}
        className={`tier-container ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => handleDragOver(e, tierKey)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, tierKey)}
        style={{ '--tier-color': config.color }}
      >
        <div className="tier-header">
          <div className="tier-label">{config.label}</div>
          <div className="tier-description">{config.description}</div>
        </div>
        <div className="tier-content">
          <div className="courses-container">
            {courses.map(course => renderCourseCard(course, tierKey))}
            {courses.length === 0 && (
              <div className="empty-tier">Drop courses here</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tierlist-page">
      <div className="tierlist-header">
        <h1>Öğrenme Profili Sıralaması</h1>
        <p>Kursları tercih sıralamanıza göre düzenleyin</p>
      </div>

      <div className="tierlist-container">
        {Object.keys(tierConfig).map(tierKey => renderTier(tierKey))}
      </div>

      <div className="tierlist-actions">
        <button className="reset-button" onClick={resetTierList}>
          Sıralamayı Sıfırla
        </button>
        <button className="profile-button" onClick={onFindProfile}>
          Profilimi Keşfet
        </button>
        <button className="restart-button" onClick={onRestart}>
          Yeniden Başla
        </button>
      </div>
    </div>
  );
};

export default TierlistPage;