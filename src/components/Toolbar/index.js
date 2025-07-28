import React, { useState } from 'react'
import classes from "./index.module.css";
import cx from "classnames"
import { LuRectangleHorizontal } from 'react-icons/lu';
import { FaSlash } from 'react-icons/fa';

const Toolbar = () => {
    const [activeToolItem, setActiveToolItem] = useState('LINE');
    return (
        <div className={classes.container}>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem == 'LINE' })} onClick={() => {
                setActiveToolItem("LINE");
            }}>
                <FaSlash />
            </div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem == 'RECT' })} onClick={
                () => {
                    setActiveToolItem("RECT");
                }
            }>
                <LuRectangleHorizontal />
            </div>
        </div>
    )
}

export default Toolbar;
