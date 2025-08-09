import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Jugador {
  _id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  goles: number;
  nombreCompleto: string;
  id: string;
}

export interface TorneoInfo {
  _id: string;
  nombre: string;
}

export interface Equipo {
  _id: string;
  id: string;
  nombre: string;
  jugadores: Jugador[];
  torneoId: TorneoInfo;
  puntos: number;
  golesAFavor: number;
  golesEnContra: number;
  diferenciaGoles: number;
  escudo?: string;
  zonaId?: string;
  color?: string;
  fundacion?: string;
  ciudad?: string;
  estadio?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface EquipoState {
  equipos: Equipo[];
  selectedEquipo: Equipo | null;
  torneoEquipos: Equipo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: EquipoState = {
  equipos: [],
  selectedEquipo: null,
  torneoEquipos: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchEquipos = createAsyncThunk(
  'equipos/fetchEquipos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/equipos');
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar equipos');
    }
  }
);

export const fetchEquipoById = createAsyncThunk(
  'equipos/fetchEquipoById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/equipos/${id}`);
      return response.data.data || response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar equipo');
    }
  }
);

export const fetchEquiposByTorneo = createAsyncThunk(
  'equipos/fetchEquiposByTorneo',
  async (torneoId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/torneos/${torneoId}/equipos`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar equipos del torneo');
    }
  }
);

export const createEquipo = createAsyncThunk(
  'equipos/createEquipo',
  async (equipoData: Omit<Equipo, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/equipos', equipoData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear equipo');
    }
  }
);

export const updateEquipo = createAsyncThunk(
  'equipos/updateEquipo',
  async ({ id, ...equipoData }: { id: string } & Partial<Pick<Equipo, 'nombre' | 'color'> & { torneoId?: string }>, { rejectWithValue }) => {
    try {
      console.log('Sending PUT request to:', `/equipos/${id}`);
      console.log('Request data:', equipoData);
      
      const response = await axios.put(`/equipos/${id}`, equipoData);
      console.log('Response:', response.data);
      
      return response.data.data || response.data;
    } catch (error: any) {
      console.error('Error in updateEquipo:', error);
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar equipo');
    }
  }
);

export const deleteEquipo = createAsyncThunk(
  'equipos/deleteEquipo',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/equipos/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar equipo');
    }
  }
);

const equipoSlice = createSlice({
  name: 'equipos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEquipo: (state) => {
      state.selectedEquipo = null;
    },
    clearTorneoEquipos: (state) => {
      state.torneoEquipos = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch equipos
      .addCase(fetchEquipos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEquipos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.equipos = action.payload;
      })
      .addCase(fetchEquipos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch equipo by id
      .addCase(fetchEquipoById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEquipoById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEquipo = action.payload;
      })
      .addCase(fetchEquipoById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch equipos by torneo
      .addCase(fetchEquiposByTorneo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEquiposByTorneo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.torneoEquipos = action.payload;
      })
      .addCase(fetchEquiposByTorneo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create equipo
      .addCase(createEquipo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEquipo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.equipos.push(action.payload);
      })
      .addCase(createEquipo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update equipo
      .addCase(updateEquipo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEquipo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.equipos.findIndex(e => e._id === action.payload._id);
        if (index !== -1) {
          state.equipos[index] = action.payload;
        }
        if (state.selectedEquipo?._id === action.payload._id) {
          state.selectedEquipo = action.payload;
        }
      })
      .addCase(updateEquipo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete equipo
      .addCase(deleteEquipo.fulfilled, (state, action) => {
        state.equipos = state.equipos.filter(e => e.id !== action.payload);
        state.torneoEquipos = state.torneoEquipos.filter(e => e.id !== action.payload);
        if (state.selectedEquipo?.id === action.payload) {
          state.selectedEquipo = null;
        }
      });
  },
});

export const { clearError, clearSelectedEquipo, clearTorneoEquipos } = equipoSlice.actions;
export default equipoSlice.reducer; 