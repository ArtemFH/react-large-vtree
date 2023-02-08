interface IFolder {
    access?: number
}

interface ITemplate {
}

export interface ITypeMaterial {
    type: 'folder' | 'lesson' | 'classwork' | 'homework' | 'test' | 'block_text' | 'block_image' | 'block_video' | 'block_audio' | 'exercise'
}

export interface IMaterial extends IFolder, ITemplate, ITypeMaterial, PastingTemplateIntegrates {
    id: string,
    title: string,
    createdAt: string,
    updatedAt: string,
    creatorId: string,
    parentId: string | null,
    children?: IMaterial[]
}

export interface IMenuType {
    type: Array<'folder' | 'lesson' | 'classwork' | 'homework' | 'test' | 'block_text' | 'block_image' | 'block_video' | 'block_audio' | 'exercise'>
    nest: IMenu[]
}

interface IMenu {
    label: string,
    class?: string,
    modal?: JSX.Element,
    nest?: IMenu[],
    close?: Function
}

export interface RootTree {
    title: string,
    general?: boolean
}

export interface ItemTree {
    item: IMaterial,
    index: number,
    general?: boolean,
    setPrevent?: Function
}

export interface CreateTemplateIntegrates {
    nest?: IMaterial,
    templateCreate?: boolean
}

export interface PastingTemplateIntegrates {
    copyId?: string
}
