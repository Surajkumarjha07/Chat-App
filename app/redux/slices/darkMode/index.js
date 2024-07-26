import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isDarkMode: false
}

export const DarkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode;
        }
    }
})

export const { toggleDarkMode } = DarkModeSlice.actions;
export default DarkModeSlice.reducer;