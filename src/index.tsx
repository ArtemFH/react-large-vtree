import HeadTree from "./App";
import {Provider} from "react-redux";
import ReactDOM from "react-dom/client";
import {storeInstance} from "./store/store";

ReactDOM.createRoot(document.getElementById('root') as HTMLDivElement).render(
    <Provider store={storeInstance}>
        <HeadTree/>
    </Provider>
);
