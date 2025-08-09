import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export interface Jugador {
  _id: string;
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  id: string;
}

export interface Gol {
  jugadorId: Jugador;
  minuto: number;
  equipo: 'local' | 'visitante';
}

export interface Equipo {
  _id: string;
  nombre: string;
  diferenciaGoles?: number | null;
  id: string;
}

export interface Zona {
  _id: string;
  nombre: string;
}

export interface TorneoInfo {
  _id: string;
  nombre: string;
}

export interface Partido {
  _id: string;
  id: string;
  torneoId: TorneoInfo;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  golesLocal: number;
  golesVisitante: number;
  fecha: string;
  cancha: string;
  horario: string;
  fase: string;
  estado: 'programado' | 'en_curso' | 'jugado' | 'suspendido';
  goles: Gol[];
  golesLocalDetalle: Gol[];
  golesVisitanteDetalle: Gol[];
  zonaId?: Zona;
  tieneResultado: boolean;
  ganador?: Equipo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PartidoState {
  partidos: Partido[];
  partidosOrdenados: Partido[];
  partidosByTorneo: Partido[];
  selectedPartido: Partido | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PartidoState = {
  partidos: [],
  partidosOrdenados: [],
  partidosByTorneo: [],
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

export const fetchPartidosByTorneo = createAsyncThunk(
  'partidos/fetchPartidosByTorneo',
  async (torneoId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/partidos/torneo/${torneoId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar partidos del torneo');
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
      // Fetch partidos by torneo
      .addCase(fetchPartidosByTorneo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPartidosByTorneo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.partidosByTorneo = action.payload.data || [];
      })
      .addCase(fetchPartidosByTorneo.rejected, (state, action) => {
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