// Mock authentication service for demo purposes when backend is not available

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'shopper';
}

interface AuthResponse {
  token: string;
  user: User;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '555-123-4567',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Test User',
    email: 'user@example.com',
    phone: '555-987-6543',
    role: 'customer',
  },
  {
    id: '3',
    name: 'Shopper User',
    email: 'shopper@example.com',
    phone: '555-456-7890',
    role: 'shopper',
  },
];

// Mock token generator
const generateToken = () => {
  return `mock-token-${Math.random().toString(36).substring(2, 15)}`;
};

// Mock login function
export const mockLogin = (email: string, password: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    // Removed artificial delay for better performance
    const user = mockUsers.find(u => u.email === email);
    
    if (user) {
      resolve({
        token: generateToken(),
        user,
      });
    } else {
      reject(new Error('Invalid credentials'));
    }
  });
};

// Mock register function
export const mockRegister = (userData: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    // Removed artificial delay for better performance
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (existingUser) {
      reject(new Error('User already exists'));
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'customer',
    };
    
    // Add to mock users (in a real app, this would persist to a database)
    mockUsers.push(newUser);
    
    resolve({
      token: generateToken(),
      user: newUser,
    });
  });
};

// Mock get current user function
export const mockGetCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    // Removed artificial delay for better performance
    const token = localStorage.getItem('token');
    
    if (!token) {
      resolve(null);
      return;
    }
    
    // In a real app, we would validate the token
    // For demo, just return the first user
    resolve(mockUsers[1]);
  });
};

// Check if we should use mock auth (when backend is not available)
export const shouldUseMockAuth = (): boolean => {
  // You can add more sophisticated detection here
  return true; // For now, always use mock auth
};
