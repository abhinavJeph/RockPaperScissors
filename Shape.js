class Shape{
    constructor(x,y, angle, image, id){
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height,
        this.angle = angle,
        this.image = image,
        this.id = id,
        this.velocity = {
            x: speed*Math.cos(this.angle),
            y: speed*Math.sin(this.angle)
        }   
        this.updateCount = 0;
        this.maxUpdate = parseInt(randomizeController[0] + randomizeController[1]*Math.random());
    }

    draw(){
        // console.log(this);
        // tool.moveTo(this.x, this.y);
        // tool.rotate(this.angle);

        tool.setTransform(1, 0, 0, 1, this.x, this.y);
        tool.rotate(this.angle + Math.PI/2);        
        tool.drawImage(this.image ,-this.width/2, -this.height/2, this.width, this.height)
        tool.rotate(-1*(this.angle + Math.PI/2))
        tool.setTransform(1, 0, 0, 1, 0, 0);

        // tool.rotate(-1*this.angle);
        // tool.moveTo(0, 0);
    }

    update(){
        boundaryCollide(this);
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        this.draw(this.image)

        if(this.updateCount >= this.maxUpdate) {
            this.angle = getRandomAngle();
            this.velocity = {
                x: speed*Math.cos(this.angle),
                y: speed*Math.sin(this.angle)
            } 
            this.maxUpdate = parseInt(randomizeController[0] + randomizeController[1]*Math.random())
            this.updateCount = 0; 
        }

        this.updateCount++;  
    }

    collide(entity){
        let l1 = this.x
        let r1 = l1 + this.width
        let t1 = this.y
        let b1 = t1 + this.height

        let l2 = entity.x
        let r2 = l2 + entity.width
        let t2 = entity.y
        let b2 = t2 + entity.height

        if(l1<r2 && r1>l2 && b1>t2 && t1<b2){
            return true
        }
        else return false
    }
}