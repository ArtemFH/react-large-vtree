import {combineReducers, configureStore} from '@reduxjs/toolkit'
import {personalMaterials} from './personalMaterials/reducer';

const rootReducer = combineReducers({
    personalMaterials: personalMaterials.reducer
})

export const store = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>
export const storeInstance = store()
