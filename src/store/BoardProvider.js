import boardContext from './board-context'
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants"
import { useReducer } from 'react'

import { createElement, getSvgPathFromStroke, isPointNearElement } from '../utils/element';
import getStroke from 'perfect-freehand';

const boardReducer = (state, action) => {
    switch (action.type) {
        case BOARD_ACTIONS.CHANGE_TOOL: return {
            ...state,
            activeToolItem: action.payload.tool
        };
        case BOARD_ACTIONS.DRAW_DOWN:
            const { clientX, clientY, stroke, fill, size } = action.payload;
            const newElement = createElement(
                state.elements.length,
                clientX,
                clientY,
                clientX,
                clientY,
                { type: state.activeToolItem, stroke, fill, size })
            const prevEls = state.elements;
            return {
                ...state,
                toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
                elements: [...prevEls, newElement]
            }
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
            {
                return {
                    ...state,
                    toolActionType: action.payload.actionType
                }
            }
        case BOARD_ACTIONS.DRAW_MOVE:
            {
                const { clientX, clientY } = action.payload;
                const newEls = [...state.elements]
                const index = state.elements.length - 1;
                const { x1, y1, stroke, fill, size, type } = newEls[index];

                switch (type) {
                    case TOOL_ITEMS.LINE:
                    case TOOL_ITEMS.RECTANGLE:
                    case TOOL_ITEMS.CIRCLE:
                    case TOOL_ITEMS.ARROW:
                        {
                            const newElement = createElement(index, x1, y1, clientX, clientY, {
                                type: state.activeToolItem,
                                stroke,
                                fill,
                                size
                            });

                            newEls[index] = newElement;
                            return {
                                ...state,
                                elements: newEls,
                            }
                        }
                    case TOOL_ITEMS.BRUSH:
                        {
                            newEls[index].points = [...newEls[index].points, { x: clientX, y: clientY }]
                            newEls[index].path = new Path2D(getSvgPathFromStroke(getStroke(newEls[index].points)));

                            return {
                                ...state,
                                elements: newEls
                            }
                        }
                    default:
                        break;
                }
                break;

            }
        case BOARD_ACTIONS.ERASE:
            {
                const { clientX, clientY } = action.payload;
                let newElements = [...state.elements];
                newElements = newElements.filter((element) => {
                    return !isPointNearElement(element, clientX, clientY);
                })
                return {
                    ...state,
                    elements: newElements
                }

            }
        case BOARD_ACTIONS.CHANGE_TEXT:
            {
                const index = state.elements.length - 1;
                const newElements = [...state.elements];
                newElements[index].text = action.payload.text;
                return {
                    ...state,
                    toolActionType: TOOL_ACTION_TYPES.NONE,
                    elements: newElements
                }
            }
        default:
            return state;
    }
}

const initialBoardState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    toolActionType: TOOL_ACTION_TYPES.NONE,
    elements: []
}

const BoardProvider = ({ children }) => {
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, initialBoardState);

    const changeToolHandler = (tool) => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TOOL,
            payload: {
                tool
            }
        })
    }
    const boardMouseDownHandler = (event, toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        const { clientX, clientY } = event;
        if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload: {
                    actionType: TOOL_ACTION_TYPES.ERASING,
                },
            });
            return;
        }
        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload: {
                clientX,
                clientY,
                stroke: toolboxState[boardState.activeToolItem]?.stroke,
                fill: toolboxState[boardState.activeToolItem]?.fill,
                size: toolboxState[boardState.activeToolItem]?.size,
            },
        });

    }

    const boardMouseMoveHandler = (event, toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        const { clientX, clientY } = event;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_MOVE,
                payload: {
                    clientX, clientY,
                    stroke: toolboxState[boardState.activeToolItem]?.stroke,
                    fill: toolboxState[boardState.activeToolItem]?.fill
                }
            })
        }
        else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.ERASE,
                payload: {
                    clientX,
                    clientY
                }
            })
        }
    }
    const boardMouseUpHandler = () => {

        if (boardState.toolActionType !== TOOL_ACTION_TYPES.WRITING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload: {
                    actionType: TOOL_ACTION_TYPES.NONE
                }
            });
        }
    }
    const textAreaBlurHandler = (text, toolboxState) => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TEXT,
            payload: {
                text
            }
        })
    }
    const boardContextValue = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        changeToolHandler,
        toolActionType: boardState.toolActionType,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
    }

    return (
        <boardContext.Provider value={boardContextValue}>
            {children}
        </boardContext.Provider >
    )
}

export default BoardProvider
