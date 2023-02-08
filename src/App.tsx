import AutoSizer from "react-virtualized-auto-sizer"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {NodeComponentProps} from "react-vtree/dist/es/Tree";
import {FixedSizeNodeData, FixedSizeNodePublicState, FixedSizeTree as VTree, TreeWalkerValue} from 'react-vtree';
import {Dispatch, FC, MouseEvent, SetStateAction, useCallback, useState} from "react";
import styled from "styled-components";
import TooltipTemplate from "./TooltipTemplate";
import {useAppActions, useAppSelector} from "./hooks/redux";

const findAnd = require('find-and')

type TypeNode = 'folder' | 'lesson'

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
                                                                                        isOpen, style, setOpen, treeData
                                                                                    }) => {
    const {getPersonalFolderByParentId} = useAppActions()
    const {materialMy} = useAppSelector(state => state.personalMaterials)
    console.log('tree', treeData)
    const handleClick = (id: string) => {
        if (!findAnd.returnFound(materialMy, {id: id}).children) return getPersonalFolderByParentId(id)
        else return null
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
            paddingLeft: nestingLevel * 8 + (isLeaf ? 48 : 0)
        }}>
            {(!isLeaf && type === 'folder') && (
                <div>
                    <button type="button" onClick={async () => {
                        await handleClick(id);
                        await setOpen(!isOpen)
                    }}>{isOpen ? "-" : "+"}</button>
                </div>)}
            <TooltipTemplate content={<Typography>Но высококачественный прототип будущего проекта предоставляет
                широкие возможности для как самодостаточных, так и внешне зависимых концептуальных
                решений. Вот вам яркий пример современных тенденций — реализация намеченных
                плановых заданий напрямую зависит от экспериментов, поражающих по своей
                масштабности и грандиозности. Ясность нашей позиции очевидна: реализация намеченных
                плановых заданий является качественно новой ступенью глубокомысленных
                рассуждений</Typography>}>
                <Typography noWrap>{id} {title}</Typography>
            </TooltipTemplate>
            {type === 'folder' && <button onClick={async () => {
                // const response = await $instance.put(`folders/${id}`, {title: (Math.random() + 1).toString(36).substring(2)})

                // setState((prevState) => findAnd.changeProps(prevState, {id: id}, {title: Math.random().toString()}))
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
    const {getPersonalRootFolders} = useAppActions()
    const {materialMy} = useAppSelector(state => state.personalMaterials)

    const treeWalker = useCallback(function* treeWalker(): any {
        for (let i = 0; i < materialMy.length; i++) {
            yield getNodeData(materialMy[i], 0);
        }

        while (true) {
            const parent = yield;
            for (let i = 0; i < parent.node.children?.length; i++) {
                yield getNodeData(parent.node.children[i], parent.nestingLevel + 1);
            }
        }
    }, [materialMy]);

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

    const handleClick = () => {
        if (!materialMy.length) return getPersonalRootFolders()
        else return null
    }

    return (
        <div style={{height: '100%', width: '100%', display: 'flex'}}>
            <button onClick={async () => await handleClick()}>
                click
            </button>
            <AutoSizer disableWidth style={{height: 'inherit', flex: 1}}>
                {({height}: any) => (!!materialMy.length && <DenisDeb>
                    <VTree async
                           width="100%"
                           itemSize={64}
                           height={height}
                           className={'vtree'}
                           treeWalker={treeWalker}>{Node}</VTree>
                </DenisDeb>)}
            </AutoSizer>
        </div>
    )
}


const DenisDeb = styled('div')`
  .vtree {
    width: 300px !important;
    scrollbar-gutter: stable;

    &:hover {
      ::-webkit-scrollbar-thumb {
        background-color: #C0C0C0;
      }
    }

    ::-webkit-scrollbar {
      width: 8px;
      border-radius: 50%;
    }

    ::-webkit-scrollbar-thumb {
      border-radius: 1000px;
      background-color: transparent;
      background-clip: padding-box;
      border: 1px solid rgba(0, 0, 0, 0);
      transition: background-color .3s ease;
    }
  }
`
