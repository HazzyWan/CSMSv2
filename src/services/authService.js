const signUp = async ({ firstName, lastName, email, password, role }) => {
    // Send sign-up request to backend
    // Replace with actual API call
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password, role }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (data.success) {
      return { success: true, role };
    } else {
      return { success: false, message: data.message };
    }
  };
  
  const login = async ({ email, password }) => {
    // Send login request to backend
    // Replace with actual API call
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });
  
    const data = await response.json();
    if (data.success) {
      return { success: true, role: data.role };
    } else {
      return { success: false, message: data.message };
    }
  };
  
  export default { signUp, login };
  