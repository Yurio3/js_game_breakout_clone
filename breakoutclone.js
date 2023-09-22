window.onload = function(){
    var oDiv = document.getElementById("div1");
    var oBall = document.getElementById("ball");
    var oBat = document.getElementById("bat");
    var oBrick = document.getElementById("brick");
    var aBricks = oBrick.getElementsByTagName("div");
    let difficulty = parseInt(localStorage.getItem("difficulty"), 10);
    // Example: Retrieving metrics from local storage
    let lossCount = parseInt(localStorage.getItem("lossCount")) || 0;
    // Example: Retrieving the maximum loss count from local storage
    let maxLossCount = parseInt(localStorage.getItem("maxLossCount")) || 0;


    // Example: Storing metrics in local storage
    localStorage.setItem("lossCount", lossCount);






    if (isNaN(difficulty) || difficulty < 1 || difficulty > 3) {
        difficulty = 1;
    }

    let knockCount = createBasedOnDifficulty(difficulty)


    oBall.style.left = '290px'; // Set the initial horizontal position
    oBall.style.bottom = '60px';

    dragX(oBat);


    //让小球可以水平方向运动，随机一个水平方向的速度
    var speedX = parseInt( Math.random() * 4) + 3;
    //随机一个垂直方向的速度
    var speedY = -(parseInt( Math.random() * 3) + 5);

    var initialSpeedX = parseInt(Math.random() * 4) + 3;
    var initialSpeedY = -(parseInt(Math.random() * 3) + 5);
    //设置函数间隔函数 30毫秒一次
    setInterval(function(){
        console.log(knockCount)
        if(knockCount === 0){
            difficulty++;
            if(difficulty > 3){
                gameWin();
            }
            knockCount = createBasedOnDifficulty(difficulty);
            localStorage.setItem("difficulty", difficulty);
        }
        // 在这里设置小球的初始位置！
        oBall.style.top = oBall.offsetTop + speedY +'px';
        oBall.style.left = oBall.offsetLeft + speedX +'px';

        //但是这样小球会出界，于是我们让球在撞到边界的时候返回来运动
        if(oBall.offsetLeft >= 580 || oBall.offsetLeft <= 0){
            oBall.style.left  = oBall.offsetLeft >= 580 ? 579 : 1 + 'px'
            speedX *= -1;
        }
        if( oBall.offsetTop <= 0){
            oBall.style.top = 1+'px'
            speedY *= -1;
        }
        //游戏结束
        if( oBall.offsetTop >= 580 ){
            oBall.offsetTop = 579
            gameOver();
        }

        function resetGame() {
            speedX = initialSpeedX;
            speedY = initialSpeedY;

            oBall.style.top = oBall.offsetTop + speedY +'px';
            oBall.style.left = oBall.offsetLeft + speedX +'px';
            localStorage.setItem("difficulty", 1);


        }

        function gameOver() {

            alert("Game Over!")
            lossCount++;

            if (lossCount > maxLossCount) {
                maxLossCount = lossCount;
                localStorage.setItem("maxLossCount", maxLossCount);
            }

            resetGame();


        }

        function gameWin() {
            alert("You Win!")
            document.getElementById("gameOverScreen").style.display = "block";
            resetGame();
        }


        // Example: Display metrics in the HTML
        document.getElementById("lossCountDisplay").textContent = lossCount;
        document.getElementById("maxLossCountDisplay").textContent = maxLossCount;
        // Example: Display the current difficulty level in the HTML
        document.getElementById("difficultyLevelDisplay").textContent = difficulty;


        //进行碰撞检测
        //1、小球和拍子的碰撞检测
        if(konck(oBall, oBat)){
            oBall.style.top  = 549 + 'px'
            speedY *= -1;
        }
        //2、小球和砖块发生碰撞
        for(var i = 0; i < aBricks.length; i++){
            if(konck(aBricks[i],oBall)){
                speedY *= -1;
                //砖块消失
                oBrick.removeChild(aBricks[i]);
                knockCount--
                break;
            }
        }



    },30);

}

function dragX(node){
    node.onmousedown = function(ev){
        var e = ev || window.event;
        var offsetX = e.clientX - node.offsetLeft;

        document.onmousemove = function(ev){
            var e = ev || window.event;
            var l = e.clientX - offsetX;
            //限制出界
            if( l <= 0 ){
                l = 0;
            }
            if( l >= 500){
                l = 500;
            }
            node.style.left = l + 'px';
        }
        document.onmouseup = function(){
            document.onmousemove = null;
        }

    }
}


//创建砖块 n:砖块数量
// 文档流的转换：
// 相对定位 转 绝对定位

function createBrick(n){
    console.log("createing bricks " + n)
    var oBrick = document.getElementById("brick");
    for(var i = 0; i < n; i++){
        var node = document.createElement("div");
        node.style.backgroundColor = randomColor();
        oBrick.appendChild(node);
    }

    var aBricks = oBrick.getElementsByTagName("div");
    for(var i = 0; i < aBricks.length; i++){
        aBricks[i].style.left = aBricks[i].offsetLeft + 'px';
        aBricks[i].style.top = aBricks[i].offsetTop + 'px';
    }
    for(var i = 0; i < aBricks.length; i++){
        aBricks[i].style.position = 'absolute';
    }



}
function createBasedOnDifficulty(difficulty){
    switch (difficulty){
        case 1:
            createBrick(10)
            return 3
        case 2:
            createBrick(15)
            return 6
        case 3:
            createBrick(20)
            return 9
        default:
            alert("Invalid Difficulty Level!!!")
    }
}
function randomColor(){
    var str = "rgba(" + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256) + "," + parseInt(Math.random() * 256)
    return str;
}


//碰撞函数：思路找绝对碰不上的
function konck(node1,node2){
    var l1 = node1.offsetLeft;
    var r1 = node1.offsetLeft + node1.offsetWidth;
    var t1 = node1.offsetTop;
    var b1 = node1.offsetTop + node1.offsetHeight;

    var l2 = node2.offsetLeft;
    var r2 = node2.offsetLeft + node2.offsetWidth;
    var t2 = node2.offsetTop;
    var b2 = node2.offsetTop + node2.offsetHeight;

    if(l2 > r1 || r2 < l1 || t2 > b1 || b2 < t1) {
        return false;
    }else{
        return true;
    }

}
