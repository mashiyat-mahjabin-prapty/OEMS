import React from 'react';

const Notification = ({ message }) => {
    console.log('Rendering Notification'); // Add this line

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 0, 0, 0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 1000, // Ensure the notification appears on top of other elements
      }}
    >
      {message}
    </div>
  );
};

export default Notification;