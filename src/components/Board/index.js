import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";


function Board() {
    const canvasRef = useRef();
    const { elements, boardMouseDownHandler, boardMouseMoveHandler, toolActionType, boardMouseUpHandler } = useContext(boardContext);
    const { toolboxState } = useContext(toolboxContext);

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }, [])

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.save();
        const roughCanvas = rough.canvas(canvas);

        elements.forEach((el) => {
            switch (el.type) {
                case TOOL_ITEMS.LINE:
                case TOOL_ITEMS.RECTANGLE:
                case TOOL_ITEMS.CIRCLE:
                case TOOL_ITEMS.ARROW:
                    {
                        roughCanvas.draw(el.roughEle);
                        break;
                    }
                case TOOL_ITEMS.BRUSH:
                    {
                        context.fillStyle = el.stroke;
                        context.fill(el.path);
                        context.restore();
                        break;
                    }
                default:
                    throw new Error("Type not recognised")
                    break;
            }
        })
        return () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

    }, [elements])
    const handleBoardMouseDown = (event) => {
        boardMouseDownHandler(event, toolboxState);
    }
    const handleMouseMove = (event) => {
        if (toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            boardMouseMoveHandler(event, toolboxState);
        }
    }
    const handleMouseUp = () => {
        boardMouseUpHandler();
    }
    return (
        <div className="App">
            <canvas ref={canvasRef}
                onMouseDown={handleBoardMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} />
        </div>
    );
}


export default Board;