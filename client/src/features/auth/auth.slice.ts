import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useAppSelector } from '../../app/hooks';
import { Tokens } from './auth.model';

const user = localStorage.getItem('user');

const initialState = { user: user ? (JSON.parse(user) as Tokens) : undefined };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addCurrentUser: (state, action: PayloadAction<Tokens>) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    removeCurrentUser: (state) => {
      delete state.user;
      localStorage.removeItem('user');
    },
  },
});

export default authSlice.reducer;

export const { addCurrentUser, removeCurrentUser } = authSlice.actions;

export const getCurrentUser = () => useAppSelector((state) => state.auth.user);
