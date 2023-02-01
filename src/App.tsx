import {temp} from "./temp";
import {FixedSizeTree as Tree} from 'react-vtree';
import AutoSizer from "react-virtualized-auto-sizer"
import {useCallback, useEffect, useRef, useState} from "react";

const findAnd = require('find-and')

const getNodeData = (node: any, nestingLevel: any) => ({
    data: {
        id: node.id,
        isLeaf: node.children?.length === 0,
        isOpenByDefault: false,
        name: node.name,
        nestingLevel,
    },
    nestingLevel,
    node,
});

const Node = ({data: {isLeaf, name, nestingLevel}, isOpen, style, setOpen}: any) => {
    return (<div
        style={{
            ...style,
            alignItems: "center",
            display: "flex",
            marginLeft: nestingLevel * 30 + (isLeaf ? 48 : 0)
        }}
    >
        {!isLeaf && (
            <div>
                <button
                    type="button"
                    onClick={() => setOpen(!isOpen)}
                >
                    {isOpen ? "-" : "+"}
                </button>
            </div>
        )}
        <div>{name}</div>
    </div>)
};
export default function App() {
    const tree = useRef<any>(null);
    const [state, setState] = useState<any>(temp)
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

    useEffect(() => {
        console.log(state)
        // tree.current?.recomputeTree({
        //     refreshNodes: true,
        //     useDefaultHeight: true,
        // });
    }, [state]);

    const handleClick = () => {
        setState((prev: any) => findAnd.changeProps(prev, {id: '21'}, {name: Math.random().toString()}))
    }

    return (
        <div style={{height: '100%'}}>
            <button onClick={handleClick}>click</button>
            <AutoSizer disableWidth>
                {({height}: any) => (
                    <Tree ref={tree}
                          width={600}
                          async={true}
                          itemSize={64}
                          height={height - 30}
                          treeWalker={treeWalker}>
                        {Node}
                    </Tree>
                )}
            </AutoSizer>
        </div>
    )
}
