import axios from "axios";
import AutoSizer from "react-virtualized-auto-sizer"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {NodeComponentProps} from "react-vtree/dist/es/Tree";
import {FixedSizeNodeData, FixedSizeNodePublicState, FixedSizeTree as VTree, TreeWalkerValue} from 'react-vtree';
import {createContext, Dispatch, FC, MouseEvent, SetStateAction, useCallback, useContext, useState} from "react";
import styled from "styled-components";
import TooltipTemplate from "./TooltipTemplate";

const findAnd = require('find-and')

type TypeNode = 'folder' | 'lesson'

export const $instance = axios.create({
    baseURL: process.env.REACT_APP_API_HOST,
    headers: {'Authorization': `Bearer ${process.env.REACT_APP_TOKEN}`}
})

type TreeNode = Readonly<{
    id: string;
    title: string;
    type: TypeNode;
    position?: number;
    children?: TreeNode[];
}>;

type TreeData = FixedSizeNodeData & Readonly<{
    title: string;
    type: TypeNode;
    isLeaf: boolean;
    nestingLevel: number;
}>;

export type NodeMeta = Readonly<{
    node: TreeNode;
    nestingLevel: number;
}>;

export type TreeContextProps<Type> = {
    state: Type[],
    setState: Dispatch<SetStateAction<Type[]>>
}

const TreeContext = createContext<TreeContextProps<TreeNode>>({
    state: [],
    setState: () => undefined
})

const getNodeData = (node: TreeNode, nestingLevel: number): TreeWalkerValue<TreeData, NodeMeta> => ({
    data: {
        id: node.id,
        nestingLevel,
        type: node.type,
        title: node.title,
        isOpenByDefault: false,
        isLeaf: node.children?.length === 0,
    },
    node,
    nestingLevel,
});

const Node: FC<NodeComponentProps<TreeData, FixedSizeNodePublicState<TreeData>>> = ({
                                                                                        data: {
                                                                                            isLeaf,
                                                                                            title,
                                                                                            id,
                                                                                            type,
                                                                                            nestingLevel
                                                                                        },
                                                                                        isOpen, style, setOpen
                                                                                    }) => {
    const {state, setState} = useContext<TreeContextProps<TreeNode>>(TreeContext)

    const handleClick = async (id: string) => {
        const response = await $instance.get(`folders/${id}`)

        setState((prevState) => findAnd.appendProps(prevState, {id: id}, response.data))
    }
    const [anchorTemplate, setAnchorTemplate] = useState<null | HTMLElement>(null);

    const handleClickTemplate = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorTemplate(event.currentTarget);
    };
    const handleCloseTemplate = () => {
        setAnchorTemplate(null);
    };


    return (
        <div style={{
            ...style,
            alignItems: "center",
            display: "flex",
            boxSizing: 'border-box',
            paddingLeft: nestingLevel * 30 + (isLeaf ? 48 : 0)
        }}>
            {(!isLeaf && type === 'folder') && (
                <div>
                    <button type="button" onClick={() => {
                        handleClick(id);
                        setOpen(!isOpen)
                    }}>{isOpen ? "-" : "+"}</button>
                </div>)}
            <TooltipTemplate content={<Typography>Но высококачественный прототип будущего проекта предоставляет
                широкие возможности для как самодостаточных, так и внешне зависимых концептуальных
                решений. Вот вам яркий пример современных тенденций — реализация намеченных
                плановых заданий напрямую зависит от экспериментов, поражающих по своей
                масштабности и грандиозности. Ясность нашей позиции очевидна: реализация намеченных
                плановых заданий является качественно новой ступенью глубокомысленных
                рассуждений</Typography>}>
                <div>{id} {title}</div>
            </TooltipTemplate>
            {type === 'folder' && <button onClick={async () => {
                // const response = await $instance.put(`folders/${id}`, {title: (Math.random() + 1).toString(36).substring(2)})

                setState((prevState) => findAnd.changeProps(prevState, {id: id}, {title: Math.random().toString()}))
            }}>rename</button>}
            <div>
                <IconButton disableFocusRipple
                            aria-haspopup='menu'
                            sx={{color: '#8C63A9'}}
                            aria-controls={id}
                            onClickCapture={handleClickTemplate}>
                    <MoreVertIcon sx={{color: '#0000008A'}}/>
                </IconButton>
                <Menu keepMounted
                      id={id + 1}
                      onClose={handleCloseTemplate}
                      anchorEl={anchorTemplate} open={!!anchorTemplate}
                      sx={{'&>.MuiMenu-paper': {width: '350px'}}}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                      transformOrigin={{vertical: 8, horizontal: 'left'}}
                      MenuListProps={{onMouseLeave: handleCloseTemplate}}
                ><MenuItem onClickCapture={() => {
                    handleCloseTemplate();
                }} sx={{height: '46px', padding: 0}}>
                </MenuItem>
                </Menu>
            </div>
        </div>)
};
export default function App() {
    const [state, setState] = useState<TreeNode[]>([])
    const treeWalker = useCallback(function* treeWalker(): any {
        for (let i = 0; i < state.length; i++) {
            yield getNodeData(state[i], 0);
        }

        while (true) {
            const parent = yield;
            for (let i = 0; i < parent.node.children?.length; i++) {
                yield getNodeData(parent.node.children[i], parent.nestingLevel + 1);
            }
        }
    }, [state]);

    // const handleClick = () => {
    //     setState((prev: any) => {
    //         const temp = findAnd.changeProps(prev, {id: '10099'}, {name: Math.random().toString()})
    //         return findAnd.insertObjectAfter(temp, {id: '21'}, {id: Math.random().toString(), name: 'хуй влада'})
    //     })
    // }

    // useEffect(() => {
    //     console.clear()
    //     console.log(JSON.stringify(state, undefined, 4))
    // }, [state])

    const handleSort = () => {
        setState((prevState) => findAnd.changeProps(prevState, {id: '1'}, {
            children: [
                {
                    id: '11',
                    title: '1',
                    position: 1,
                    type: "folder"
                }, {
                    id: '12',
                    title: '2',
                    position: 2,
                    type: "folder"
                }, {
                    id: '13',
                    title: '3',
                    position: 3,
                    type: "folder"
                }
            ]
        }))
    }

    const handleClick = async () => {
        const response = await $instance.get('folders')
        const data: TreeNode[] = [
            {
                id: '1',
                type: "folder",
                title: Math.random().toString(),
                children: [
                    {
                        id: '11',
                        title: '1',
                        position: 1,
                        type: "folder"
                    }, {
                        id: '13',
                        title: '3',
                        position: 3,
                        type: "folder"
                    }, {
                        id: '12',
                        title: '2',
                        position: 2,
                        type: "folder"
                    }
                ]
            }, {
                id: '2',
                type: "folder",
                title: Math.random().toString()
            }]
        const temp: TreeNode[] = [...Array(10)].map(() => {
            return {id: Math.random().toString(), title: Math.random().toString(), type: 'folder'}
        })

        setState(data.concat(temp))

        // return setState(response.data.concat([...Array(100)].map(() => {
        //     return {id: Math.random().toString()}
        // })))
    }

    return (
        <div style={{height: '100%', width: '100%', display: 'flex'}}>
            <button onClick={handleClick}>click</button>
            <button onClick={handleSort}>sort</button>
            <TreeContext.Provider value={{state, setState}}>
                <AutoSizer disableWidth style={{height: 'inherit', flex: 1}}>
                    {({height}: any) => (!!state.length && <DenisDeb>
                        <VTree async
                               width="100%"
                               itemSize={64}
                               height={height}
                               className={'vtree'}
                               treeWalker={treeWalker}>{Node}</VTree>
                    </DenisDeb>)}
                </AutoSizer>
            </TreeContext.Provider>
        </div>
    )
}


const DenisDeb = styled('div')`
  .vtree {
    width: 500px !important;
    scrollbar-gutter: stable;

    ::-webkit-scrollbar {
      width: 8px;
      border-radius: 50%;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 1000px;
      background-color: #C0C0C0;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0);
    }
  }
`
