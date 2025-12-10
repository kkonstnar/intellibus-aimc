import { useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

export const useContentUpdate = (contentType: string, hasContent: boolean) => {
  const { addNotification } = useNotification();

  useEffect(() => {
    if (hasContent) {
      // Show notification on mobile devices
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        addNotification(
          `${contentType} has been updated successfully!`,
          'success',
          4000
        );
      }
    }
  }, [hasContent, contentType, addNotification]);
};

export default useContentUpdate;



