import { useContext } from "react";
import { COLORS } from "../../constants"
import classes from "./index.module.css"
import cx from "classnames";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";



const Toolbox = () => {
    const { activeToolItem } = useContext(boardContext);
    const { toolboxState, changeStrokeHandler } = useContext(toolboxContext);
    const strokeColor = toolboxState[activeToolItem]?.stroke;
    return (
        <div className={classes.container}>
            <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>Stroke</div>
                <div className={classes.colorsContainer}>
                    {Object.keys(COLORS).map((k) => {

                        return <div
                            key={k}
                            className={cx(classes.colorBox, { [classes.activeColorBox]: strokeColor === COLORS[k] })}
                            style={{ backgroundColor: COLORS[k] }}
                            onClick={() => changeStrokeHandler(activeToolItem, COLORS[k])}
                        ></div>
                    })}
                </div>
            </div>
        </div >
    )
}

export default Toolbox
