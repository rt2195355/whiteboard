import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import classes from "./index.module.css";

function Board() {
    const canvasRef = useRef();
    const textAreaRef = useRef();
    const { elements, boardMouseDownHandler, boardMouseMoveHandler, boardMouseUpHandler, toolActionType, textAreaBlurHandler } = useContext(boardContext);
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
                case TOOL_ITEMS.TEXT:
                    {
                        context.textBaseline = "top";
                        context.font = `${el.size}px Caveat`;
                        context.fillStyle = el.stroke;
                        context.fillText(el.text, el.x1, el.y1);
                        context.restore();
                        break;
                    }
                default:
                    throw new Error("Type not recognised")
            }
        })
        return () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

    }, [elements])


    useEffect(() => {
        const textArea = textAreaRef.current;
        if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
            setTimeout(() => {
                textArea.focus();
            }, 0);
        }
    },
        [toolActionType])
    const handleBoardMouseDown = (event) => {
        boardMouseDownHandler(event, toolboxState);
    }
    const handleMouseMove = (event) => {

        boardMouseMoveHandler(event, toolboxState);
    }
    const handleMouseUp = () => {
        boardMouseUpHandler();
    }

    return (
        <>
            {toolActionType === TOOL_ACTION_TYPES.WRITING && (
                <textarea
                    type="text"
                    ref={textAreaRef}
                    className={classes.textElementBox}
                    style={{
                        top: elements[elements.length - 1].y1,
                        left: elements[elements.length - 1].x1,
                        fontSize: `${elements[elements.length - 1]?.size}px`,
                        color: elements[elements.length - 1]?.stroke,
                    }}
                    onBlur={(event) => textAreaBlurHandler(event.target.value)}
                />
            )}
            <canvas ref={canvasRef}
                id="canvas"
                onMouseDown={handleBoardMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp} />
        </>

    );
}


export default Board;