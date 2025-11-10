import { useState, useEffect } from 'react';
import axios from 'axios';
import './AnnouncementBar.css';

/**
 * Announcement Bar Component
 * Displays site-wide announcements that can be dismissed
 */
const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

 const fetchAnnouncement = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/announcements/active`
    );
    console.log('Fetched announcement data:', response.data);  // ✅ ye backend se aaya data
    if (response.data && response.data.length > 0) {
      const activeAnnouncement = response.data[0];
      console.log('Active Announcement:', activeAnnouncement);  // ✅ ye frontend state me set hone wala data

      const dismissedAnnouncements = JSON.parse(
        localStorage.getItem('dismissedAnnouncements') || '[]'
      );

      if (!dismissedAnnouncements.includes(activeAnnouncement._id)) {
        setAnnouncement(activeAnnouncement);
        setIsVisible(true);
      }
    }
  } catch (error) {
    console.error('Error fetching announcement:', error);
  }
};


  const handleDismiss = () => {
    if (announcement && announcement.isDismissible) {
      setIsVisible(false);

      // Save dismissed announcement to localStorage
      const dismissedAnnouncements = JSON.parse(
        localStorage.getItem('dismissedAnnouncements') || '[]'
      );
      dismissedAnnouncements.push(announcement._id);
      localStorage.setItem('dismissedAnnouncements', JSON.stringify(dismissedAnnouncements));
    }
  };

  if (!isVisible || !announcement) {
    return null;
  }

  return (
    <div className="center">
    <div
      className="announcement-bar "
      style={{
        backgroundColor: announcement.backgroundColor,
        color: announcement.textColor,
      }}
    >
      <div className="announcement-content">
        <p className="announcement-message">{announcement.message}</p>
        
        {announcement.link && announcement.link.url && (
          <a
            href={announcement.link.url}
            className="announcement-link"
            style={{ color: announcement.textColor }}
          >
            {announcement.link.text || 'Learn More'}
          </a>
        )}
      </div>

      {announcement.isDismissible && (
        <button
          className="announcement-close"
          onClick={handleDismiss}
          aria-label="Close announcement"
        >
          ×
        </button>
      )}
    </div>
    </div>
  );
};

export default AnnouncementBar;
