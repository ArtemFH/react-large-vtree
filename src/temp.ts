export const temp: any[] = [
    {
        id: 'root',
        name: '1',
        children: [
            {
                name: '1.1',
                id: '11'
            }, {
                name: '2.1',
                id: '21',
                children: [...Array(20000)].map((value, index, array) => {
                    return {
                        name: index.toString(),
                        id: `${index + 100}`.toString(),
                    }
                })
            }
        ]
    },
    {
        id: '2',
        name: '2',
        children: [
            {
                name: '1.2',
                id: '12'
            }
        ]
    },
    {
        id: '3',
        name: '3',
        children: [
            {
                name: '1.3',
                id: '13'
            }
        ]
    },
    {
        id: '4',
        name: '4',
        children: [
            {
                name: '1.4',
                id: '14'
            }
        ]
    }, {
        id: '5',
        name: '5',
        children: [
            {
                name: '1.5',
                id: '15'
            }
        ]
    }, {
        id: '6',
        name: '6',
        children: [
            {
                name: '1.5',
                id: '16'
            }
        ]
    },
    // ...[...Array(count)].map((value, index, array) => {
    //     return {name: `${index + 8}`.toString(), id: `${index + 8}`.toString(), childrenId: '3'}
    // })
]
