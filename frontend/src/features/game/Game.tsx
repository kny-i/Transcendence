import React, { useRef, useEffect } from "react";
import {isNumberObject} from "util/types";

// const Game = () => {
//     const canvasRef = useRef<HTMLCanvasElement>(null);
//
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas == null) {
//             return ;
//         }
//         const ctx = canvas.getContext("2d");
//         if (ctx == null) {
//             return ;
//         }
//         let x = canvas.width / 2;
//         let y = canvas.height - 30;
//         let dx = 2;
//         let dy = -2;
//         const ballRadius = 10;
//
//         const drawBall = () => {
//             ctx.beginPath();
//             ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
//             ctx.fillStyle = "#0095DD";
//             ctx.fill();
//             ctx.closePath();
//         };
//
//         const draw = () => {
//             ctx.clearRect(0, 0, canvas.width, canvas.height);
//             drawBall();
//
//             if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
//                 dx = -dx;
//             }
//             if (y + dy > canvas.height - ballRadius || y + dy < ballRadius) {
//                 dy = -dy;
//             }
//
//             x += dx;
//             y += dy;
//         };
//
//         const interval = setInterval(draw, 10);
//     }, []);
//
//     return <canvas ref={canvasRef} width={400} height={400} />;
// };


function pong() {

}

let context: CanvasRenderingContext2D | null;
let canvas:  HTMLCanvasElement | null;

function draeStaticObjsct() {
    // create a field of game
    context?.beginPath();
    context?.strokeRect(5, 5, 505, 305);
    context?.stroke();

    // center line
    context?.beginPath();
    context?.moveTo(255, 5);
    context?.lineTo(255, 305);
    context?.stroke();
}




function drawDynamicOnjsct() {


    ball.draw();


    // for (;;) {
    //     const lpadx = 5;
    //     const lpady = 5;
    //
    //     canvasの位置情報を取得
        // const canvasRect = canvas.getBoundingClientRect();
//
// mousemoveイベントのハンドラを登録
        // canvas.addEventListener('mousemove', (event) => {
        //     マウス位置を計算
            // const mouseX = event.clientX - canvasRect.left;
            // const mouseY = event.clientY - canvasRect.top;
            //
            // デバッグ用にコンソールにログを出力
            // console.log(`Mouse position: (${mouseX}, ${mouseY})`);
        // });
    // }
}


function randomInt(min:number, max:number): number{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const angle =  randomInt(0, 360) * (Math.PI / 180);

const ball = {
    x: 255,
    y: 155,
    vx: Math.cos(angle),
    vy: Math.sign(angle),
    radius: 25,
    color: "red",
    draw() {
        context?.beginPath();
        context?.arc(this.x, this.y, this.radius, 0, Math.PI * 2 );
        context?.closePath();
        context?.fill();
    }


}



function draw() {

    context?.clearRect(5, 5, 500, 300);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;


}

const Canvas = () => {


    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    useEffect(() => {
        canvas = canvasRef.current;
        if (!canvas) {
            return ;
        }
        context = canvas.getContext('2d');
        if (!context) {
            return ;
        }



            draeStaticObjsct();
            drawDynamicOnjsct();



    }, []);


    return <canvas ref={canvasRef} height="1000" width="1000"/>
}

export default Canvas;
