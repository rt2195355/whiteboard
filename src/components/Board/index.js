import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES } from "../../constants";


function Board() {
    const canvasRef = useRef();
    const { elements, boardMouseDownHandler, boardMouseMoveHandler, toolActionType, boardMouseUpHandler } = useContext(boardContext);
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
            roughCanvas.draw(el.roughEle);
        })
        return () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

    }, [elements])
    const handleBoardMouseDown = (event) => {
        boardMouseDownHandler(event);
    }
    const handleMouseMove = (event) => {
        if (toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            boardMouseMoveHandler(event);
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