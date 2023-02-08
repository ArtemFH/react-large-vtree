import {createAsyncThunk} from "@reduxjs/toolkit";
import materialApi from "../../api/requests/personalMaterials"
import {ITypeMaterial} from "../ITree";

export const getPersonalRootFolders = createAsyncThunk('get/rootFolder', async (_, {rejectWithValue}) => {
    try {
        const response = await materialApi.getPersonalRootFolders();
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const getPersonalFolderByParentId = createAsyncThunk('get/folderById', async (id: string, {rejectWithValue}) => {
    try {
        const response = await materialApi.getPersonalFolderByParentId(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const createFolder = createAsyncThunk('post/folder', async (data: { title: string, parentId: string }, {rejectWithValue}) => {
    try {
        const response = await materialApi.createFolder(data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const editFolder = createAsyncThunk('put/folder', async (data: { title: string, id: string }, {rejectWithValue}) => {
    try {
        const response = await materialApi.editFolder(data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteFolder = createAsyncThunk('delete/folder', async (id: string, {rejectWithValue}) => {
    try {
        const response = await materialApi.deleteFolder(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const createTemplate = createAsyncThunk('post/template', async (data: { title: string, copyId: string, parentId: string } & ITypeMaterial, {rejectWithValue}) => {
    try {
        const response = await materialApi.createTemplate(data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const editTemplate = createAsyncThunk('put/template', async (data: { title: string, id: string }, {rejectWithValue}) => {
    try {
        const response = await materialApi.editTemplate(data);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})

export const deleteTemplate = createAsyncThunk('delete/template', async (id: string, {rejectWithValue}) => {
    try {
        const response = await materialApi.deleteTemplate(id);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response.data)
    }
})
