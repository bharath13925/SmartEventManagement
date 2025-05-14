// Frontend authentication utility functions

// User Authentication Functions
export const setUserData = (userData) => {
    localStorage.setItem('uid', userData.uid);
    localStorage.setItem('User', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userType', 'user');
  };
  
  export const getCurrentUser = () => {
    const userStr = localStorage.getItem('User');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (err) {
      console.error('Error parsing user data:', err);
      return null;
    }
  };
  
  // Organizer Authentication Functions
  export const setOrganizerData = (organizerData) => {
    localStorage.setItem('uid', organizerData.uid);
    localStorage.setItem('Organizer', JSON.stringify(organizerData));
    localStorage.setItem('token', organizerData.token);
    localStorage.setItem('userType', 'organizer');
  };
  
  export const getCurrentOrganizer = () => {
    const organizerStr = localStorage.getItem('Organizer');
    if (!organizerStr) return null;
    
    try {
      return JSON.parse(organizerStr);
    } catch (err) {
      console.error('Error parsing organizer data:', err);
      return null;
    }
  };
  
  // Common Authentication Functions
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const isLoggedIn = () => {
    return !!localStorage.getItem('uid');
  };
  
  export const getUserType = () => {
    return localStorage.getItem('userType');
  };
  
  export const logout = () => {
    localStorage.removeItem('uid');
    localStorage.removeItem('User');
    localStorage.removeItem('Organizer');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  };
  
  // User API Functions
  export const fetchUserProfile = async (uid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await response.json();
      
      // Update localStorage with latest data
      localStorage.setItem('User', JSON.stringify(userData));
      
      return userData;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      throw err;
    }
  };
  
  export const updateUserProfile = async (uid, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedUser = await response.json();
      
      // Update localStorage with latest data
      localStorage.setItem('User', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };
  
  // Organizer API Functions
  export const fetchOrganizerProfile = async (uid) => {
    try {
      const response = await fetch(`http://localhost:5000/api/organizers/${uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch organizer profile');
      }
      
      const organizerData = await response.json();
      
      // Update localStorage with latest data
      localStorage.setItem('Organizer', JSON.stringify(organizerData));
      
      return organizerData;
    } catch (err) {
      console.error('Error fetching organizer profile:', err);
      throw err;
    }
  };
  
  export const updateOrganizerProfile = async (uid, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/organizers/${uid}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedOrganizer = await response.json();
      
      // Update localStorage with latest data
      localStorage.setItem('Organizer', JSON.stringify(updatedOrganizer));
      
      return updatedOrganizer;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };