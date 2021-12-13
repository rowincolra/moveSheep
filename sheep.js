export class Sheep {
    constructor(img, stageWidth){
        this.img = img;

        this.totalFrame = 8;
        this.curFrame = 0;

        this.imgWidth = 360;
        this.imgHeight = 300;

        this.sheepWidth = 180;
        this.sheepHeight = 150;

        this.sheepWidthHalf = this.sheepWidth / 2;
        this.x = stageWidth + this.sheepWidth;
        this.y = 0;
        this.speed = Math.random() * 2 + 1;

        this.fps = 24;
        //실제 타임스탬프의 비교값
        this.fpsTime = 1000 / this.fps;
    }

    //애니매에션 드로우 함수(숫자는 프레임)
    draw(ctx, t, dots){
        if(!this.time){
            this.time = t;
        }

        // 프레임 조절 코드
        const now = t - this.time;
        if(now > this.fpsTime){
            this.time = t;
            this.curFrame += 1;
            if(this.curFrame === this.totalFrame){
                this.curFrame = 0;
            } 
        }

        this.animate(ctx, dots);
    }

    animate(ctx, dots){
        this.x -= this.speed;
        //언덕을 따라 이동하는 양의 y값 정의
        const closest = this.getY(this.x, dots);
        this.y = closest.y;

        ctx.save();
        ctx.translate(this.x, this.y);
        //각도 
        ctx.rotate(closest.rotation);
        ctx.drawImage(
            this.img,
            this.imgWidth * this.curFrame,
            0,
            this.imgWidth,
            this.imgHeight,
            -this.sheepWidthHalf,
            -this.sheepHeight + 20,
            this.sheepWidth,
            this.sheepHeight
        );

        // 캔버스 회전을 위해 restore
        ctx.restore();
    }

    //어떤 곡선이 x값에 해당하는지
    getY(x, dots){
        for(let i = 1; i < dots.length; i++){
            if(x >= dots[i].x1 && x <= dots[i].x3){
                return this.getY2(x, dots[i]);
            }
        }
        return {
            y:0,
            rotation:0
        };
    }
    // 곡선을 어떻게 나눌것인지 (촘촘할수록 부드러운 움직임)
    getY2(x, dot){
        const total = 200;
        let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
        let prevX = pt.x;
        for(let i = 1; i < total; i++){
            const t = i / total;
            pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);

            if(x >= prevX && x <= pt.x){
                return pt;
            }
            prevX = pt.x;
        }
        return pt;
    }

    // 언덕을 따라가는 y값 코드 (모질라 검색해볼것)
    getQuadValue(p0, p1, p2, t){
        return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
    }
    getPointOnQuad(x1, y1, x2, y2, x3, y3, t){
        //각도를 구하는 함수
        const tx = this.quardTangent(x1, x2, x3, t);
        const ty = this.quardTangent(y1, y2, y3, t);
        const rotaion = -Math.atan2(tx, ty) + (90 * Math.PI / 180);
        return {
            x: this.getQuadValue(x1, x2, x3, t),
            y: this.getQuadValue(y1, y2, y3, t),
            rotation: rotaion,
        };
    }

    //이번에는 언덕의 기울기에 따른 양의 기울기를 만들어야 함
    quardTangent(a, b, c, t){
        return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
    }
}