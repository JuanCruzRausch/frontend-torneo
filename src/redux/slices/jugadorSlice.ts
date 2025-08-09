import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  posicion: string;
  dorsal?: number;
  equipoId: string;
  fechaNacimiento?: string;
  nacionalidad?: string;
  altura?: number;
  peso?: number;
  foto?: string;
  goles?: number;
  tarjetasAmarillas?: number;
  tarjetasRojas?: number;
  partidos?: number;
  equipo?: {
    id: string;
    nombre: string;
    escudo: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Goleador extends Jugador {
  totalGoles: number;
}

interface JugadorState {
  jugadores: Jugador[];
  goleadores: Goleador[];
  selectedJugador: Jugador | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: JugadorState = {
  jugadores: [],
  goleadores: [],
  selectedJugador: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchJugadores = createAsyncThunk(
  'jugadores/fetchJugadores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/jugadores');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar jugadores');
    }
  }
);

export const fetchGoleadores = createAsyncThunk(
  'jugadores/fetchGoleadores',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/jugadores/goleadores');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar goleadores');
    }
  }
);

export const fetchJugadorById = createAsyncThunk(
  'jugadores/fetchJugadorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/jugadores/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar jugador');
    }
  }
);

export const createJugador = createAsyncThunk(
  'jugadores/createJugador',
  async (jugadorData: Omit<Jugador, 'id' | 'createdAt' | 'updatedAt' | 'equipo'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/jugadores', jugadorData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear jugador');
    }
  }
);

export const updateJugador = createAsyncThunk(
  'jugadores/updateJugador',
  async ({ id, ...jugadorData }: Partial<Jugador> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/jugadores/${id}`, jugadorData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar jugador');
    }
  }
);

export const deleteJugador = createAsyncThunk(
  'jugadores/deleteJugador',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/jugadores/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar jugador');
    }
  }
);

const jugadorSlice = createSlice({
  name: 'jugadores',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedJugador: (state) => {
      state.selectedJugador = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch jugadores
      .addCase(fetchJugadores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJugadores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jugadores = action.payload;
      })
      .addCase(fetchJugadores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch goleadores
      .addCase(fetchGoleadores.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGoleadores.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goleadores = action.payload;
      })
      .addCase(fetchGoleadores.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch jugador by id
      .addCase(fetchJugadorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchJugadorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedJugador = action.payload;
      })
      .addCase(fetchJugadorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create jugador
      .addCase(createJugador.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createJugador.fulfilled, (state, action) => {
        state.isLoading = false;
        state.jugadores.push(action.payload);
      })
      .addCase(createJugador.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update jugador
      .addCase(updateJugador.fulfilled, (state, action) => {
        const index = state.jugadores.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
          state.jugadores[index] = action.payload;
        }
        if (state.selectedJugador?.id === action.payload.id) {
          state.selectedJugador = action.payload;
        }
      })
      // Delete jugador
      .addCase(deleteJugador.fulfilled, (state, action) => {
        state.jugadores = state.jugadores.filter(j => j.id !== action.payload);
        if (state.selectedJugador?.id === action.payload) {
          state.selectedJugador = null;
        }
      });
  },
});

export const { clearError, clearSelectedJugador } = jugadorSlice.actions;
export default jugadorSlice.reducer; 