<!-- Created By liuhuihao 2018/6/1 19:36  -->
<!-- 播放器Canvas组件 -->
<template>
    <canvas ref="canvas" id="canvas" width="300" height="200"></canvas>
</template>

<script>
    import store from 'store'

    export default {
        data () {
            return{
                analyser: store.getters.getAnalyser,
                lastArray:[],
                color: {
                    r: 100,
                    g: 150,
                    b: 200,
                    tagR: true,
                    tagG: true,
                    tagB: true
                }
            }
        },
        name: 'musicCanvas',
        methods: {
            /**
             * 创建 canvas 上下文
             */
            createCtx() {
                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext('2d');
                ctx.lineWidth = 3;
                ctx.strokeStyle = 'rgba(72, 226, 251, 0.8)';
                ctx.fillStyle = "rgba(72, 226, 251, 0.8)";
                return ctx;
            },

            /**
             * Canvas 动画
             */
            animateCanvas(ctx) {
                var r = this.color.r;
                var g = this.color.g;
                var b = this.color.b;
                //R
                if (r >200 || r<80){
                    this.color.tagR = !this.color.tagR;
                }
                if (this.color.tagR){
                    this.color.r++;
                } else{
                    this.color.r--;
                }
                //G
                if (g >200 || g<80){
                    this.color.tagG = !this.color.tagG;
                }
                if (this.color.tagG){
                    this.color.g++;
                } else{
                    this.color.g--;
                }
                //B
                if (b >200 || b<80){
                    this.color.tagB = !this.color.tagB;
                }
                if (this.color.tagB){
                    this.color.b++;
                } else{
                    this.color.b--;
                }
                var colorStr = (r*256*256+g*256+b).toString(16)
                for (var i=0; i<6-colorStr.length; i++){
                    colorStr = "0" + colorStr;
                }
                ctx.strokeStyle = "#"+colorStr;
                ctx.clearRect(0, 0, 300, 600);
                this.analyser.fftSize = 8192;
                const arrayLength = this.analyser.frequencyBinCount;
                const array = new Uint8Array(arrayLength);
                // ctx.beginPath();
                var _x = 3;
                var arr = [];
                this.analyser.getByteFrequencyData(array);
                for (var j=10; j<array.length;j++){
                    var value = -(array[j]*array[j]/200*Math.sqrt(j)) * 8 / 256;
                    if (value < -40) {
                        value = (value + 40) * 70 / 100 +150;
                    } else {
                        value = 0 + 150;
                    }

                    arr.push({x:(j-50)*_x ,y:value})
                    this.lastArray = arr;
                }
                    // this.drawInner(array, i, ctx);
                this.drawOuter(arr,ctx);
                // ctx.stroke();
                // ctx.fill();
                requestAnimationFrame(() => {
                    this.animateCanvas(ctx);
                });
            },

            /**
             * 绘制内圈 point
             */
            drawInner(array, i, ctx) {
                if (i < 136) {
                    var point = i % 9 > 4 ? (9 - i % 9) : (i % 9);
                    var value = (array[i]) * 120 / 256 * ((5 - point) / 5);
                    if (value > 70) {
                        value = ((value - 70) * 120 / 50);
                    } else {
                        value = 0;
                    }
                    ctx.moveTo(( Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300);
                    ctx.arc(( Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300, 0.6, 0, 2 * Math.PI);

                    ctx.moveTo((-Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300);
                    ctx.arc(( -Math.sin(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300), Math.cos(((i) * 4 / 3) / 180 * Math.PI) * (198 - value) + 300, 0.6, 0, 2 * Math.PI);
                }
            },

            /**
             * 绘制外圈 bar
             */
            drawOuter(array,ctx) {
                // console.log(array)
                // if (i > 130 && i < 271) {
                //     var value = (array[i]*array[i]/200*Math.sqrt(i)) * 8 / 256;
                //     if (value > 20) {
                //         value = (value - 20) * 70 / 100;
                //     } else {
                //         value = 0;
                //     }
                //     ctx.moveTo(( Math.sin((i * 4 / 3) / 180 * Math.PI) * 200 + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * 200 + 300);
                //     ctx.lineTo(( Math.sin((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300);
                //
                //     ctx.moveTo(( -Math.sin((i * 4 / 3) / 180 * Math.PI) * 200 + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * 200 + 300);
                //     ctx.lineTo(( -Math.sin((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300), Math.cos((i * 4 / 3) / 180 * Math.PI) * (200 + value) + 300);
                //
                // }

                ctx.lineWidth=1;
                ctx.beginPath();
                ctx.font="20px SimSun";
                for(var i=0;i<array.length;i++){
                    if(i==0){
                        ctx.moveTo(array[i].x,array[i].y);
                        ctx.moveTo(array[i].x,array[i].y);
                    }else{//注意是从1开始
                        var ctrlP=this.getCtrlPoint(array,i-1);
                        ctx.bezierCurveTo(ctrlP.pA.x, ctrlP.pA.y, ctrlP.pB.x,ctrlP.pB.y, array[i].x, array[i].y);
                        //ctx.fillText("("+point[i].x+","+point[i].y+")",point[i].x,point[i].y);
                    }
                }
                ctx.stroke();
            },
            getCtrlPoint(ps, i, a, b){
                if(!a||!b){
                    a=0.25;
                    b=0.25;
                }
                //处理两种极端情形
                if(i<1){
                    var pAx = ps[0].x + (ps[1].x-ps[0].x)*a;
                    var pAy = ps[0].y + (ps[1].y-ps[0].y)*a;
                }else{
                    var pAx = ps[i].x + (ps[i+1].x-ps[i-1].x)*a;
                    var pAy = ps[i].y + (ps[i+1].y-ps[i-1].y)*a;
                }
                if(i>ps.length-3){
                    var last=ps.length-1
                    var pBx = ps[last].x - (ps[last].x-ps[last-1].x)*b;
                    var pBy = ps[last].y - (ps[last].y-ps[last-1].y)*b;
                }else{
                    var pBx = ps[i+1].x - (ps[i+2].x-ps[i].x)*b;
                    var pBy = ps[i+1].y - (ps[i+2].y-ps[i].y)*b;
                }
                return {
                    pA:{x:pAx,y:pAy},
                    pB:{x:pBx,y:pBy}
                }
            }
        },
        mounted() {
            const ctx = this.createCtx();
            window.requestAnimationFrame(() => {
                this.animateCanvas(ctx);
            });
        }
    }
</script>

<style lang="stylus" scoped>
    canvas {
        position: absolute;
        bottom: -20%;
        left: 20px;
        /*top: 0px;*/
        pointer-events: none;
        user-select: none;
        z-index: -1;
    }
</style>
