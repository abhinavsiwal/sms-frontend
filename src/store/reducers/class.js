import { createSlice } from "@reduxjs/toolkit";

const initialState={
    classes:[],
}

export const classSlice = createSlice({
    name:"class",
    initialState,
    reducers:{
        setClass:(state,{payload})=>{
            state.classes = payload;
        }
    }
})

export const {setClass} = classSlice.actions;
export default classSlice.reducer;