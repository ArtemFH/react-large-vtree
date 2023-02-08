import {RootState} from "../store/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "@reduxjs/toolkit";
import * as PersonalMaterialsActionsCreator from "../store/personalMaterials/actions"
import {personalMaterials} from "../store/personalMaterials/reducer";

export const useAppActions = () => {
    const dispatch = useDispatch();
    return bindActionCreators({
        ...PersonalMaterialsActionsCreator, ...personalMaterials.actions,
    }, dispatch)
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
