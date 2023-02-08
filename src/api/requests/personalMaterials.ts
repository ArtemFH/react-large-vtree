import {$instance} from "../api";
import {ITypeMaterial} from "../../store/ITree";

const getPersonalRootFolders = async () => {
    return await $instance.get('folders')
}

const getPersonalFolderByParentId = async (id: string) => {
    return await $instance.get(`folders/${id}`)
}

const createFolder = async (data: { title: string, parentId?: string }) => {
    return await $instance.post('folders', data)
}

const editFolder = async (data: { title: string, id: string }) => {
    return await $instance.put(`folders/${data.id}`, data)
}

const deleteFolder = async (id: string) => {
    return await $instance.delete(`folders/${id}`)
}

const createTemplate = async (data: { title: string, parentId: string, copyId: string } & ITypeMaterial) => {
    return await $instance.post('material-templates', data)
}

const editTemplate = async (data: { title: string, id: string }) => {
    return await $instance.put(`material-templates/${data.id}`, data)
}

const deleteTemplate = async (id: string) => {
    return await $instance.delete(`material-templates/${id}`)
}

const exported = {
    getPersonalRootFolders,
    getPersonalFolderByParentId,
    createFolder,
    editFolder,
    deleteFolder,
    createTemplate,
    editTemplate,
    deleteTemplate
}

export default exported
