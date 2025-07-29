import { createContext } from "react";


const toolboxContext = createContext({
    toolboxState: {},
    changeStrokeHandler: () => { }

});


export default toolboxContext;