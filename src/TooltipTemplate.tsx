import React, {cloneElement, FC} from 'react';
import {Tooltip} from "@mui/material";

const TooltipTemplate: FC<{ content: JSX.Element, children: JSX.Element }> = ({
                                                                                  content,
                                                                                  children
                                                                              }) => {
    const clonedElement = cloneElement(children)

    return (
        <Tooltip arrow
                 placement="right"
                 leaveDelay={250}
                 enterDelay={500}
                 enterNextDelay={500}
            // PopperProps={{
            //     modifiers: [
            //         {
            //             name: 'preventOverflow',
            //             enabled: true,
            //             options: {
            //                 padding: 74
            //             }
            //         }, {
            //             name: "offset",
            //             options: {
            //                 offset: [0, 60],
            //             },
            //         }
            //     ]
            // }}
                 componentsProps={{
                     // popper: {
                     //     sx: {
                     //         left: `${width}px !important`
                     //     }
                     // },
                     tooltip: {
                         sx: {
                             color: 'black',
                             display: 'flex',
                             maxWidth: '300px',
                             alignItems: 'center',
                             margin: '0 14px 0 14px',
                             backgroundColor: '#FFFFFF',
                             border: '1px solid #8C63A9',
                             maxHeight: 'calc(100vh - 90px)'
                         }
                     }, arrow: {sx: {"&:before": {border: "1px solid #8C63A9"}, color: '#FFFFFF'}}
                 }} title={content}>
            {clonedElement}
        </Tooltip>
    );
};
export default TooltipTemplate;
