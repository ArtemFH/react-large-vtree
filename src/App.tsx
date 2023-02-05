import axios from "axios";
import {FixedSizeNodeData, FixedSizeNodePublicState, FixedSizeTree as VTree, TreeWalkerValue} from 'react-vtree';
import AutoSizer from "react-virtualized-auto-sizer"
import {createContext, Dispatch, FC, SetStateAction, useCallback, useContext, useState} from "react";
import {NodeComponentProps} from "react-vtree/dist/es/Tree";
import {IconButton, Menu, MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const findAnd = require('find-and')

type TypeNode = 'folder' | 'lesson'

export const $instance = axios.create({
    baseURL: process.env.REACT_APP_API_HOST
})

type TreeNode = Readonly<{
    id: string;
    title: string;
    type: TypeNode;
    children: TreeNode[];
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
        const response = await $instance.get(`folders/${id}`, {
            headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NTM5NWE2LWQyZDgtNDdmMC1hYjRlLTFhNTU2ODk5MDVjZiIsImVtYWlsIjoiaXZhbkBtYWlsLnJ1IiwidXNlclJvbGUiOiJ0ZWFjaGVyIiwiYnJvd3NlclVzZXIiOiJQb3N0bWFuUnVudGltZS83LjMwLjEiLCJpYXQiOjE2NzU0MDUxOTEsImV4cCI6MTY3NTQ5MTU5MX0.wrWEeNNzXcmeB9dC1ZSVHoSsWDlB1fBSpC89i5229UM`}
        })

        setState((prevState) => findAnd.appendProps(prevState, {id: id}, response.data))
    }
    const [anchorTemplate, setAnchorTemplate] = useState<null | HTMLElement>(null);

    const handleClickTemplate = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorTemplate(event.currentTarget);
    };
    const handleCloseTemplate = () => {
        setAnchorTemplate(null);
    };


    return (<div style={{
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
        <div>{id} {title}</div>
        {type === 'folder' && <button onClick={async () => {
            const response = await $instance.put(`folders/${id}`, {title: (Math.random() + 1).toString(36).substring(2)}, {
                headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NTM5NWE2LWQyZDgtNDdmMC1hYjRlLTFhNTU2ODk5MDVjZiIsImVtYWlsIjoiaXZhbkBtYWlsLnJ1IiwidXNlclJvbGUiOiJ0ZWFjaGVyIiwiYnJvd3NlclVzZXIiOiJQb3N0bWFuUnVudGltZS83LjMwLjEiLCJpYXQiOjE2NzU0MDUxOTEsImV4cCI6MTY3NTQ5MTU5MX0.wrWEeNNzXcmeB9dC1ZSVHoSsWDlB1fBSpC89i5229UM`}
            })

            setState((prevState) => findAnd.changeProps(prevState, {id: id}, {title: response.data.title}))
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

    const handleClick = async () => {
        const response = await $instance.get('folders', {
            headers: {'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc3NTM5NWE2LWQyZDgtNDdmMC1hYjRlLTFhNTU2ODk5MDVjZiIsImVtYWlsIjoiaXZhbkBtYWlsLnJ1IiwidXNlclJvbGUiOiJ0ZWFjaGVyIiwiYnJvd3NlclVzZXIiOiJQb3N0bWFuUnVudGltZS83LjMwLjEiLCJpYXQiOjE2NzU0MDUxOTEsImV4cCI6MTY3NTQ5MTU5MX0.wrWEeNNzXcmeB9dC1ZSVHoSsWDlB1fBSpC89i5229UM`}
        })

        return setState(response.data.concat([...Array(100)].map(() => {
            return {id: Math.random().toString()}
        })))
    }

    return (
        <div style={{height: '100%', width: '100%', display: 'flex'}}>
            <button onClick={handleClick}>click</button>
            <TreeContext.Provider value={{state, setState}}>
                <AutoSizer disableWidth style={{height: 'inherit', flex: 1}}>
                    {({height}: any) => (!!state.length && <VTree async
                                                                  width="100%"
                                                                  itemSize={64}
                                                                  height={height}
                                                                  treeWalker={treeWalker}>{Node}</VTree>)}
                </AutoSizer>
            </TreeContext.Provider>
        </div>
    )
}
