import {
    createFolder,
    createTemplate,
    deleteFolder,
    deleteTemplate,
    editFolder,
    editTemplate,
    getPersonalFolderByParentId,
    getPersonalRootFolders
} from "./actions";
import {createSlice} from "@reduxjs/toolkit";

const findAnd = require('find-and')

const initialState: any = {
    materialMy: [],
    materialGeneral: [],
    error: null,
    isLoading: false
}

export const personalMaterials = createSlice({
    name: 'folders',
    initialState,
    reducers: {
        clearPersonalMaterialsError(state) {
            state.error = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPersonalRootFolders.fulfilled, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    materialMy: action.payload
                }
            })
            .addCase(getPersonalFolderByParentId.fulfilled, (state, action) => {
                return {
                    ...state,
                    isLoading: false,
                    materialMy: findAnd.replaceObject(state.materialMy, {id: action.payload.id}, action.payload)
                }
            })
            .addCase(createFolder.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
            .addCase(editFolder.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
            .addCase(deleteFolder.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
            .addCase(createTemplate.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
            .addCase(editTemplate.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
            .addCase(deleteTemplate.fulfilled, (state) => {
                return {
                    ...state,
                    isLoading: false
                }
            })
    }
})
