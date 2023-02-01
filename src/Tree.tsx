import React, {FC, memo, useState} from 'react';

interface State {
    show: boolean
}

const margin = 40

type AppProps = any

const Tree: FC<AppProps> = ({item}) => {
    const [state, setState] = useState<State>({show: false})

    const toggleView = () => {
        setState({show: !state?.show})
    }

    const tree = item?.children?.map((node: { children: string | any[]; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, key: React.Key | null | undefined) => {
        if (!node.children?.length) return <div key={key} className="Tree" style={{
            // marginLeft: String((level + 1) * margin) + "px"
        }}>{node.name}</div>
        return <Tree key={key} item={node}/>
    })
    const sign = state.show ? " \u2212 " : " + "

    const handleClick = () => {
        console.log(item)
        // item[0].name = Math.random().toString()
    }

    return (
        <>
            <div className="Tree" onClick={toggleView}>
                <span className="Sign">{sign}</span>
                {item?.name}
            </div>
            <button onClick={handleClick}>click</button>
            {state.show && tree}
        </>
    )
}

export default memo(Tree);
