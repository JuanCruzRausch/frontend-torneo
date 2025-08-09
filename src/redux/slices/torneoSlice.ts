import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Torneo {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'planificado' | 'en_curso' | 'finalizado';
  maxEquipos: number;
  reglamento: string;
  createdAt: string;
  updatedAt: string;
}

interface TorneoState {
  torneos: Torneo[];
  selectedTorneo: Torneo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TorneoState = {
  torneos: [],
  selectedTorneo: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTorneos = createAsyncThunk(
  'torneos/fetchTorneos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/torneos');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar torneos');
    }
  }
);

export const fetchTorneoById = createAsyncThunk(
  'torneos/fetchTorneoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/torneos/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar torneo');
    }
  }
);

export const createTorneo = createAsyncThunk(
  'torneos/createTorneo',
  async (torneoData: Omit<Torneo, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/torneos', torneoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear torneo');
    }
  }
);

export const updateTorneo = createAsyncThunk(
  'torneos/updateTorneo',
  async ({ id, ...torneoData }: Partial<Torneo> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/torneos/${id}`, torneoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar torneo');
    }
  }
);

export const deleteTorneo = createAsyncThunk(
  'torneos/deleteTorneo',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/torneos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar torneo');
    }
  }
);

const torneoSlice = createSlice({
  name: 'torneos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedTorneo: (state) => {
      state.selectedTorneo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch torneos
      .addCase(fetchTorneos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTorneos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.torneos = action.payload;
      })
      .addCase(fetchTorneos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch torneo by id
      .addCase(fetchTorneoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTorneoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedTorneo = action.payload;
      })
      .addCase(fetchTorneoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create torneo
      .addCase(createTorneo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTorneo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.torneos.push(action.payload);
      })
      .addCase(createTorneo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update torneo
      .addCase(updateTorneo.fulfilled, (state, action) => {
        const index = state.torneos.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.torneos[index] = action.payload;
        }
        if (state.selectedTorneo?.id === action.payload.id) {
          state.selectedTorneo = action.payload;
        }
      })
      // Delete torneo
      .addCase(deleteTorneo.fulfilled, (state, action) => {
        state.torneos = state.torneos.filter(t => t.id !== action.payload);
        if (state.selectedTorneo?.id === action.payload) {
          state.selectedTorneo = null;
        }
      });
  },
});

export const { clearError, clearSelectedTorneo } = torneoSlice.actions;
export default torneoSlice.reducer; 