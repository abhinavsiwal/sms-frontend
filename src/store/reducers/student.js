import { createSlice } from "@reduxjs/toolkit";

const initialState={
    studentEditing:false,
}

export const studentSlice = createSlice({
    name:"student",
    initialState,
    reducers:{
        setStudentEditing:(state,{payload})=>{
            state.studentEditing = payload;
        }
    }
})

export const {setStudentEditing} = studentSlice.actions;
export default studentSlice.reducer;