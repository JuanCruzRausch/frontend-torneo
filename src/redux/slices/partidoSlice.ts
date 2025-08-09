import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Partido {
  id: string;
  equipoLocalId: string;
  equipoVisitanteId: string;
  fecha: string;
  hora: string;
  estadio?: string;
  golesLocal?: number;
  golesVisitante?: number;
  estado: 'programado' | 'en_curso' | 'finalizado' | 'suspendido';
  torneoId: string;
  zonaId?: string;
  jornada?: number;
  observaciones?: string;
  equipoLocal?: {
    id: string;
    nombre: string;
    escudo: string;
  };
  equipoVisitante?: {
    id: string;
    nombre: string;
    escudo: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface PartidoState {
  partidos: Partido[];
  partidosOrdenados: Partido[];
  selectedPartido: Partido | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PartidoState = {
  partidos: [],
  partidosOrdenados: [],
  selectedPartido: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchPartidos = createAsyncThunk(
  'partidos/fetchPartidos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/partidos');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar partidos');
    }
  }
);

export const fetchPartidosOrdenados = createAsyncThunk(
  'partidos/fetchPartidosOrdenados',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/partidos/ordenados');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar partidos ordenados');
    }
  }
);

export const fetchPartidoById = createAsyncThunk(
  'partidos/fetchPartidoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/partidos/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar partido');
    }
  }
);

export const createPartido = createAsyncThunk(
  'partidos/createPartido',
  async (partidoData: Omit<Partido, 'id' | 'createdAt' | 'updatedAt' | 'equipoLocal' | 'equipoVisitante'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/partidos', partidoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear partido');
    }
  }
);

export const updatePartido = createAsyncThunk(
  'partidos/updatePartido',
  async ({ id, ...partidoData }: Partial<Partido> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/partidos/${id}`, partidoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar partido');
    }
  }
);

export const deletePartido = createAsyncThunk(
  'partidos/deletePartido',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/partidos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar partido');
    }
  }
);

const partidoSlice = createSlice({
  name: 'partidos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPartido: (state) => {
      state.selectedPartido = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch partidos
      .addCase(fetchPartidos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartidos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partidos = action.payload;
      })
      .addCase(fetchPartidos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch partidos ordenados
      .addCase(fetchPartidosOrdenados.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartidosOrdenados.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partidosOrdenados = action.payload;
      })
      .addCase(fetchPartidosOrdenados.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch partido by id
      .addCase(fetchPartidoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartidoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPartido = action.payload;
      })
      .addCase(fetchPartidoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create partido
      .addCase(createPartido.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPartido.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partidos.push(action.payload);
      })
      .addCase(createPartido.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update partido
      .addCase(updatePartido.fulfilled, (state, action) => {
        const index = state.partidos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.partidos[index] = action.payload;
        }
        if (state.selectedPartido?.id === action.payload.id) {
          state.selectedPartido = action.payload;
        }
      })
      // Delete partido
      .addCase(deletePartido.fulfilled, (state, action) => {
        state.partidos = state.partidos.filter(p => p.id !== action.payload);
        state.partidosOrdenados = state.partidosOrdenados.filter(p => p.id !== action.payload);
        if (state.selectedPartido?.id === action.payload) {
          state.selectedPartido = null;
        }
      });
  },
});

export const { clearError, clearSelectedPartido } = partidoSlice.actions;
export default partidoSlice.reducer; 