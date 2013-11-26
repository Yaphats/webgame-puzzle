/**
  * puzzle.js
  * 一个HTML5拼图游戏
  * author: Yaphats
  * version: 1.0
  * source: http://ih77.com/webgame/js/puzzle.js
  */
;(function(document,window){
var Puzzle = window.Puzzle = function(canvasId,latticeId){
    var canvas = document.querySelector('#puzzle');
    var latticeObj = document.querySelector('#scale');
    var timeCountObj = document.querySelector('#timeCount');
    var stepCount = document.querySelector('#stepCount');
    var startBtn = document.querySelector('#startBtn');
    var ctx = canvas.getContext("2d"),
        canvasWidth = canvas.width,             //整张大片的大小
        latticeNum = 'dataset' in canvas ? canvas.dataset.num : canvas.getAttribute('data-num'),        //拼图块行数(dataset兼容性)
        latticeSize = canvasWidth / latticeNum, //一个图块的大小
        complete = false;                       //是否完成
    var touchLoc = {x:0,y:0},                   //点击位置
        emptyLoc = {x:0,y:0},                   //空位置
        tempLoc = {x:0,y:0},                    //初始化时 临时移动位置
        prevLoc = {};                         //上一次空图块位置
        imgLattice = {},                        //拼图图块
        img = {},
        step = 0;                               //步数

    //设置canvas 画布的长宽
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //加载源图
    var loadImg = function(){
        img = new Image();
        img.src = 'image/puzzle.jpg';
        img.addEventListener('load',drawLattice,false);
    };

    var autoPlay = function(){
      var ran1 = Math.random() > 0.5 ;
      var offsetNum = 1;
      var tempObj = {x:tempLoc.x,y:tempLoc.y};

      //随机出移动方向 大于0.5横向移动  小于0.5纵向移动
      if(ran1){
        tempObj.y = emptyLoc.y;  //横向移动,y不变
        if(tempLoc.x ==0 ){}     
        else if(tempObj.x == latticeNum - 1 || Math.random() > 0.5){ //随机值大于0.5或达到最大值的时候-1
          offsetNum = -1;
        }
        tempObj.x = emptyLoc.x + offsetNum;  //0的时候 或随机值小于0.5的时候+1

      }else{
        tempObj.x = emptyLoc.x;
        if(tempObj.y ==0 ){}
        else if(tempObj.y == latticeNum - 1 || Math.random() > 0.5){
          offsetNum = -1;
        }
        tempObj.y = emptyLoc.y + offsetNum;
      }

      //目标位置 不能是上次移动的位置(防止后退)
      if(prevLoc != null && prevLoc.x == tempObj.x && prevLoc.y == tempObj.y){
        autoPlay();
        return ;
      }
      tempLoc.x = tempObj.x;
      tempLoc.y = tempObj.y;
      prevLoc.x = emptyLoc.x;
      prevLoc.y = emptyLoc.y;
      slideLattice(emptyLoc, tempLoc);
      drawLattice();
  }
  //点击事件
  btn.addEventListener('click',autoPlay);

  //获取当前触摸点的坐标
  canvas.addEventListener('mousemove'/*touchstart*/,function(e){
      touchLoc.x = Math.floor((e.pageX/*e.touches[0].pageX*/ - this.offsetLeft) / latticeSize);
      touchLoc.y = Math.floor((e.pageY/*e.touches[0].pageY*/ - this.offsetTop) / latticeSize);

  });
 
 startBtn.addEventListener('click', function(){
      canvas.addEventListener('click',canvasClickFunc,false);//点击移动
      var countNumObj = document.querySelector('#countNum');
      var countNum = countNumObj.innerText;
      var intVal = setInterval(function(){
          countNum--;
          countNumObj.innerText = countNum;
          if(countNum == 0){
            clearInterval(intVal);
            [].forEach.call(document.querySelectorAll('.bg'), function (el) {
                  el.style.display = 'none';
                  timeCountFunc();
            });
          }

      }, 1000);
   });
  var canvasClickFunc = function() {
        if (distance(touchLoc.x, touchLoc.y, emptyLoc.x, emptyLoc.y) == 1) {
            slideLattice(emptyLoc, touchLoc);
            drawLattice();
            stepCount.innerText = ++step;
        }
        if (complete) {
            canvas.removeEventListener('click',canvasClickFunc,false)
            setTimeout(function() {scroller4.show();}, 500);
        }
    };
  //初始化图片
  var puzzleInit = function() {
      imgLattice = [];
      for (var i = 0; i < latticeNum; ++i) {
        imgLattice[i] = [];
        for (var j = 0; j < latticeNum; ++j) {
          imgLattice[i][j] = {};
          imgLattice[i][j].x = (latticeNum - 1) - i;
          imgLattice[i][j].y = (latticeNum - 1) - j;
        }
      }
      //清空页面数据
      timeCountObj.innerText = 0;
      stepCount.innerText = 0;
  }
  var upset = function(){
        var $flag = 0;
        var intnterId = setInterval(function(){
            if($flag >= 18){
               clearInterval(intnterId);
            }
            document.querySelector('#btn').click();
            $flag++;
          }, 200);

     };
  var timeCountFunc = function(){
        var time = 0;
        var text;
        var timeCountVal = setInterval(func,1000);
        function func(){
            time++;
            if(time/60 >= 1){
                text = Math.floor(time/60) + " 分钟 " + time % 60 + " 秒";
            }else{
                text = time % 60 + " 秒";
            }
            timeCountObj.innerText = text;
            if(complete){
              clearInterval(timeCountVal);
            }
        }
     }


  //绘制图片
  var drawLattice = function() {
    ctx.clearRect ( 0 , 0 , canvasWidth , canvasWidth );
    for (var i = 0; i < latticeNum; ++i) {
      for (var j = 0; j < latticeNum; ++j) {
        var x = imgLattice[i][j].x;
        var y = imgLattice[i][j].y;
        if(i != emptyLoc.x || j != emptyLoc.y || complete == true) {
          console.log(x * latticeSize, y * latticeSize, latticeSize, latticeSize,
              i * latticeSize, j * latticeSize, latticeSize, latticeSize);
          ctx.drawImage(img, x * latticeSize, y * latticeSize, latticeSize, latticeSize,
              i * latticeSize, j * latticeSize, latticeSize, latticeSize);
        }
      }
    }
  }

  var distance = function(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }
  var slideLattice = function(toLoc, fromLoc) {
    if (!complete) {
      imgLattice[toLoc.x][toLoc.y].x = imgLattice[fromLoc.x][fromLoc.y].x;
      imgLattice[toLoc.x][toLoc.y].y = imgLattice[fromLoc.x][fromLoc.y].y;
      imgLattice[fromLoc.x][fromLoc.y].x = latticeNum - 1;
      imgLattice[fromLoc.x][fromLoc.y].y = latticeNum - 1;
      toLoc.x = fromLoc.x;
      toLoc.y = fromLoc.y;
      checkComplete();
    }
  }


  var checkComplete = function() {
    var flag = true;
    for (var i = 0; i < latticeNum; ++i) {
      for (var j = 0; j < latticeNum; ++j) {
        if (imgLattice[i][j].x != i || imgLattice[i][j].y != j) {
          flag = false;
        }
      }
    }
    complete = flag;
  }
  loadImg();
  puzzleInit();

}
})(document,window);
