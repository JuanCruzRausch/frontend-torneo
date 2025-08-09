import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  rol: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      console.log('login: Raw response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success && response.data.data && response.data.token) {
        console.log('login: Login data extracted:', {
          user: response.data.data,
          token: response.data.token
        });
        return {
          user: response.data.data,
          token: response.data.token
        };
      } else {
        console.error('login: Invalid response structure:', response.data);
        return rejectWithValue('Respuesta de API inválida');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error de login');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      console.log('getMe: Fetching user data...');
      const response = await axios.get('/auth/me');
      console.log('getMe: Raw response:', response.data);
      
      // Handle the new API response structure
      if (response.data.success && response.data.data) {
        console.log('getMe: User data extracted:', response.data.data);
        return response.data.data;
      } else {
        console.error('getMe: Invalid response structure:', response.data);
        return rejectWithValue('Respuesta de API inválida');
      }
    } catch (error: any) {
      console.error('getMe: Error fetching user data:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al obtener usuario');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        console.log('getMe: Pending...');
        state.isLoading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        console.log('getMe: Fulfilled with user:', action.payload);
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state, action) => {
        console.error('getMe: Rejected with error:', action.payload);
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setToken } = authSlice.actions;
export default authSlice.reducer; 