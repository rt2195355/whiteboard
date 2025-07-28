import { useEffect, useRef } from "react";
import rough from "roughjs";


function Board() {
    const canvasRef = useRef();
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const roughCanvas = rough.canvas(canvas);
        const generator = roughCanvas.generator;
        let rect1 = generator.rectangle(100, 100, 200, 200, { fill: "red", stroke: "purple" });
        roughCanvas.draw(rect1);

    }, [])
    return (
        <div className="App">
            <canvas ref={canvasRef} />
        </div>
    );
}


export default Board;