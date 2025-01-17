import { createSlice } from "@reduxjs/toolkit";

type User = {
    _id: string;
    address: string;
    store: string;
    creditCard: string;
}

type TUserInitialState = {
    loading: boolean;
    isUserAuthed: boolean;
    previousPage: string;
    user: User | null;
    error: string | null;
}

const initialState: TUserInitialState = {
    loading: false,
    isUserAuthed: false,
    previousPage: '/',
    user: null,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isUserAuthed = true;
            state.error = null;
            state.user = action.payload;
            state.loading = false;
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        },
        setPreviosPage: (state, action) => {
            state.previousPage = action.payload;
        },
        setAddress: (state, action) => {
            if(state.user) state.user.address = action.payload;
        },
        setStore: (state, action) => {
            if(state.user) state.user.store = action.payload;
        },
        setCreditCard: (state, action) => {
            if(state.user) state.user.creditCard = action.payload;
        },
        logout: (state) => {
            state.loading = false;
            state.isUserAuthed = false;
            state.error = null;
            state.user = null;
        },
    }
})

export default userSlice.reducer;
export const userActions = userSlice.actions;