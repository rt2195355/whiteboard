import { createContext } from "react";


const boardContext = createContext({
    activeToolItem: "",
    elements: [],
    toolActionType: "",
    boardMouseDownHandler: () => { },
    changeToolHandler: () => { },
    boardMouseMoveHandler: () => { },
    boardMouseUpHandler: () => { }
});


export default boardContext;