movesnake=function(){for(e=0;e<snakelength;e++){var a=oldx=oldy=oldz=newx=newy=newz=0;wrapenabled&&(0==snakex[head-e-1]&&snakex[head-e]==size-1&&(a=1,oldx=-1,newx=size,oldy=newy=snakey[head-e],oldz=newz=snakez[head-e]),snakex[head-e-1]==size-1&&0==snakex[head-e]&&(a=1,oldx=size,newx=-1,oldy=newy=snakey[head-e],oldz=newz=snakez[head-e]),0==snakey[head-e-1]&&snakey[head-e]==size-1&&(a=1,oldy=-1,newy=size,oldx=newx=snakex[head-e],oldz=newz=snakez[head-e]),snakey[head-e-1]==size-1&&0==snakey[head-e]&&
(a=1,oldy=size,newy=-1,oldx=newx=snakex[head-e],oldz=newz=snakez[head-e]),0==snakez[head-e-1]&&snakez[head-e]==size-1&&(a=1,oldz=-1,newz=size,oldx=newx=snakex[head-e],oldy=newy=snakey[head-e]),snakez[head-e-1]==size-1&&0==snakez[head-e]&&(a=1,oldz=size,newz=-1,oldx=newx=snakex[head-e],oldy=newy=snakey[head-e]));a?(top["snakecuberotate"+e].style.transform="rotateZ("+snakeangle[head-e]+"rad)",top["snakecubemove"+e].style.transform="translateX("+(oldx*sidesize+.5)+"vh)translateY("+(oldy*sidesize+.5)+
"vh)translateZ("+(oldz*sidesize+.5)+"vh)scale(.01)scaleZ(.01)",setTimeout("snakecubemove"+e+".style.transition='none'",150),setTimeout("snakecubemove"+e+".style.transform=`translateX(${"+newx+"*sidesize+.5}vh)translateY(${"+newy+"*sidesize+.5}vh)translateZ(${"+newz+"*sidesize+.5}vh)scale(.01)`",175),setTimeout("snakecubemove"+e+".style.transition='';snakecubemove"+e+".style.transform=`translateX(${snakex["+(head-e)+"]*sidesize+.5}vh)translateY(${snakey["+(head-e)+"]*sidesize+.5}vh)translateZ(${snakez["+
(head-e)+"]*sidesize+.5}vh)`",200)):(top["snakecubemove"+e].style.transform="translateX("+(snakex[head-e]*sidesize+.5)+"vh)translateY("+(snakey[head-e]*sidesize+.5)+"vh)translateZ("+(snakez[head-e]*sidesize+.9)+"vh)",top["snakecuberotate"+e].style.transform="rotateZ("+snakeangle[head-e]+"rad)");top["snakeshadow"+e].style.display=0==snakez[head-e]?"":"none";"editor"!=b.className&&"editor playing"!=b.className&&(null===currentpuzzle||localStorage["puzzle"+pagename+currentpuzzle]?(scene.style.transform=
"translateX("+-snakex[head]*sidesize+"vh)translateY("+-snakey[head]*sidesize+"vh)translateZ(-5vh)rotateX(45deg)",scene.style.transformOrigin=""+snakex[head]*sidesize+"vh "+snakey[head]*sidesize+"vh"):(scene.style.transform="translateX("+(-(puzzles[currentpuzzle][5]+puzzles[currentpuzzle][1]/2)*sidesize+15)+"vh)translateY("+(-(puzzles[currentpuzzle][6]+puzzles[currentpuzzle][1]/2)*sidesize+13)+"vh)translateZ("+(80-puzzles[currentpuzzle][0]*(sidesize+2))+"vh)rotateX(25deg)",scene.style.transformOrigin=
""+(puzzles[currentpuzzle][5]+puzzles[currentpuzzle][1]/2)*sidesize+"vh "+((puzzles[currentpuzzle][6]+puzzles[currentpuzzle][1]/2)*sidesize+13)+"vh"))}a=snakex[head];var f=snakey[head],e;for(e in doors)0<doors[e][3]&&snakelength>=doors[e][3]&&4>Math.hypot(a-doors[e][0],f-doors[e][1])&&(top["door"+e].className="door open",localStorage["door"+pagename+e]=1),"door open"==top["door"+e].className&&2>Math.hypot(a-doors[e][0],f-doors[e][1])&&(localStorage.page=pagename=doors[e][5],setTimeout(enterroom,1E3),
localStorage.snakex=doors[e][7],localStorage.snakey=doors[e][8],localStorage.snakez=0,localStorage.snakeangle=snakeangle[head]);if("editor"!=b.className&&"editor playing"!=b.className)for(p in checkgrid(),currentpuzzle=null,dg=[],puzzles)if(a>=puzzles[p][5]&&a<puzzles[p][5]+puzzles[p][0]&&f>=puzzles[p][6]&&f<puzzles[p][6]+puzzles[p][0]){currentpuzzle=+p;issolved=0;localStorage["puzzle"+pagename+p]&&(issolved=1);cellprefix=p;hasground=!!puzzles[p][4];haswall=!!puzzles[p][3];leftoffset=puzzles[p][5];
topoffset=puzzles[p][6];size=puzzles[p][0];for(e=0;e<size;e++)for(dg[e]=[],j=0;j<size;j++)dg[e][j]=+puzzles[p][4][e*puzzles[p][0]+j];checkgrid()}};
checkmove=function(a,f,e){stuck=0;if("editor playing"==b.className){if(-5>a||a>size+3||-2>f||f>size)stuck=1}else if(0>a||40<=a||0>f||20<=f)stuck=1;for(var g in trees)a>=trees[g][0]-1&&a<=trees[g][0]+1&&f==trees[g][1]&&(stuck=1);for(g in apples)localStorage["appleappeared"+pagename+g]&&a==apples[g][0]&&f==apples[g][1]&&(delete apples[g],top["apple"+g].remove(),top["appleshadow"+g].remove(),snakelength++,localStorage.snakelength=snakelength,localStorage["appleeaten"+pagename+g]=1);for(g in cubes)a==
cubes[g][0]&&f==cubes[g][1]&&(stuck=1);for(g in doors)"door open"==top["door"+g].className&&2>=Math.hypot(a-doors[g][0],f-doors[g][1])&&(stuck=0);for(g=snakelength-2;0<g;g--)snakex[head-g]==a&&snakey[head-g]==f&&snakez[head-g]==e&&(stuck=1)};
checkgrid=function(){if(!issolved&&null!==currentpuzzle){solved=1;for(i=0;i<size;i++)for(j=0;j<size;j++)top["g"+cellprefix+"-"+i+"-"+j]&&(top["g"+cellprefix+"-"+i+"-"+j].style.background=dg[i][j]?"black":"white"),top["w"+cellprefix+"-{i}-"+j]&&(top["w"+cellprefix+"-{i}-"+j].style.background=dw[i][j]?"black":"white");if(!(snakex[head]<leftoffset||snakex[head]>leftoffset+size-1||snakey[head]<topoffset||snakey[head]>topoffset+size-1||0>snakez[head]||snakez[head]>size-1)){for(i=0;i<snakelength;i++){top["g"+
cellprefix+"-"+(snakey[head-i]-topoffset)+"-"+(snakex[head-i]-leftoffset)]&&(top["g"+cellprefix+"-"+(snakey[head-i]-topoffset)+"-"+(snakex[head-i]-leftoffset)].style.background=dg[snakey[head-i]-topoffset][snakex[head-i]-leftoffset]?"green":"red");if(snakex[head-i]<leftoffset||snakex[head-i]>leftoffset+size-1||snakey[head-i]<topoffset||snakey[head-i]>topoffset+size-1||0>snakez[head-i]||snakez[head-i]>size-1)solved=0;hasground&&dg[snakey[head-i]-topoffset]&&!dg[snakey[head-i]-topoffset][snakex[head-
i]-leftoffset]&&(solved=0);haswall&&dw[size-1-snakez[head-i]]&&!dw[size-1-snakez[head-i]][snakex[head-i]-leftoffset]&&(solved=0)}for(i=0;i<size;i++)for(j=0;j<size;j++)hasground&&"black"==top["g"+cellprefix+"-"+i+"-"+j].style.backgroundColor&&(solved=0),haswall&&"black"==top["w"+cellprefix+"-"+i+"-"+j].style.backgroundColor&&(solved=0);if(solved){issolved=1;localStorage["puzzle"+pagename+currentpuzzle]=1;for(i=0;i<size;i++)for(j=0;j<size;j++)top["g"+cellprefix+"-"+i+"-"+j]&&(top["g"+cellprefix+"-"+
i+"-"+j].style.background=dg[i][j]?"green":"gold"),top["w"+cellprefix+"-{i}-"+j]&&(top["w"+cellprefix+"-{i}-"+j].style.background=dw[i][j]?"green":"gold");totalsolved++;localStorage.totalsolved=totalsolved}}}};
checkapple=function(){for(var a in apples)!localStorage["appleappeared"+pagename+a]&&(0<apples[a][3]&&apples[a][3]==snakelength||0<apples[a][4]&&apples[a][4]==totalsolved)&&(lock=1,setTimeout('scene.style.transform="translateX("+(-apples['+a+'][0]*sidesize)+"vh)translateY("+(-apples['+a+'][1]*sidesize)+"vh)translateZ(-5vh)rotateX(30deg)";\n\n        localStorage["appleappeared"+pagename+"'+a+'"] = 1;\n\n        scene.style.transformOrigin=""+(apples['+a+'][0]*sidesize)+"vh "+(apples['+a+'][1]*sidesize)+"vh";\n\n        // Show apple falling\n        top["apple"+'+
a+'].className = "emoji apple";\n        top["appleshadow"+'+a+'].className = "emojishadow appleshadow";',250),setTimeout("movesnake();lock=0",2E3))};
onkeydown=function(a){top["lurd************************l**r************l*d***u**u"[a.which-37]]=1;if(8==a.which||18==a.which)B=1;16==a.which&&(s=1);17==a.which&&(c=1);116!=a.keyCode&&82!=a.keyCode&&17!=a.keyCode&&123!=a.keyCode&&a.preventDefault();a=0;playing&&puzzling&&0<=snakex[head]&&snakex[head]<size&&0<=snakey[head]&&snakey[head]<size&&0<=snakez[head]&&snakez[head]<size&&(a=1);playing&&!lock&&(stuck=0,l?top.wrap&&wrap.checked&&a&&0==snakex[head]?(checkmove(size-1,snakey[head],snakez[head]),stuck||
(snakex.push(size-1),snakey.push(snakey[head]),snakez.push(snakez[head]),snakeangle.push(Math.PI/2),head++)):(checkmove(snakex[head]-1,snakey[head],snakez[head]),stuck||(snakex.push(snakex[head]-1),snakey.push(snakey[head]),snakez.push(snakez[head]),snakeangle.push(Math.PI/2),head++)):r?top.wrap&&wrap.checked&&a&&snakex[head]==size-1?(checkmove(0,snakey[head],snakez[head]),stuck||(snakex.push(0),snakey.push(snakey[head]),snakez.push(snakez[head]),snakeangle.push(-Math.PI/2),head++)):(checkmove(snakex[head]+
1,snakey[head],snakez[head]),stuck||(snakex.push(snakex[head]+1),snakey.push(snakey[head]),snakez.push(snakez[head]),snakeangle.push(-Math.PI/2),head++)):u?top.wrap&&wrap.checked&&a&&0==snakey[head]?(checkmove(snakex[head],size-1,snakez[head]),stuck||(snakex.push(snakex[head]),snakey.push(size-1),snakez.push(snakez[head]),snakeangle.push(Math.PI),head++)):(checkmove(snakex[head],snakey[head]-1,snakez[head]),stuck||(snakex.push(snakex[head]),snakey.push(snakey[head]-1),snakez.push(snakez[head]),snakeangle.push(Math.PI),
head++)):d?top.wrap&&wrap.checked&&a&&snakey[head]==size-1?(checkmove(snakex[head],0,snakez[head]),stuck||(snakex.push(snakex[head]),snakey.push(0),snakez.push(snakez[head]),snakeangle.push(0),head++)):(checkmove(snakex[head],snakey[head]+1,snakez[head]),stuck||(snakex.push(snakex[head]),snakey.push(snakey[head]+1),snakez.push(snakez[head]),snakeangle.push(0),head++)):top.wall&&wall.checked&&s?top.wrap&&wrap.checked&&a&&snakez[head]==size-1?(checkmove(snakex[head],snakey[head],0),stuck||(snakex.push(snakex[head]),
snakey.push(snakey[head]),snakez.push(0),snakeangle.push(snakeangle[head]),head++)):(checkmove(snakex[head],snakey[head],snakez[head]+1),stuck||(snakex.push(snakex[head]),snakey.push(snakey[head]),snakez.push(snakez[head]+1),snakeangle.push(snakeangle[head]),head++)):top.wall&&wall.checked&&c?top.wrap&&wrap.checked&&a&&0==snakez[head]?(checkmove(snakex[head],snakey[head],size-1),stuck||(snakex.push(snakex[head]),snakey.push(snakey[head]),snakez.push(size-1),snakeangle.push(snakeangle[head]),head++)):
0==snakez[head]?stuck=1:(checkmove(snakex[head],snakey[head],snakez[head]-1),stuck||(snakex.push(snakex[head]),snakey.push(snakey[head]),snakez.push(snakez[head]-1),snakeangle.push(snakeangle[head]),head++)):B&&head>snakelength&&(snakeangle.pop(),snakex.pop(),snakey.pop(),snakez.pop(),head--),!stuck&&(u||r||d||l||s||c||B)&&(movesnake(),"editor playing"==b.className&&checkgrid(),movesnake(),checkapple(),lock||(lock=1,setTimeout("lock=0",100))))};onkeyup=function(){u=r=d=l=s=c=B=0};sidesize=7;
snakex=[];snakey=[];snakez=[];snakeangle=[];head=0;snakelength=+localStorage.snakelength||5;localStorage.snakelength=snakelength;playing=1;lock=u=r=d=l=s=c=B=puzzling=0;trees=[];apples=[];doors=[];cubes=[];puzzles=[];currentpuzzle=null;cellprefix="e";dg=[];topoffset=leftoffset=wrapenabled=issolved=haswall=hasground=0;totalsolved=+localStorage.totalsolved||0;stuck=0;pagename="";rot=0;
move_scene=function(){scene.style.transform="translateX(-"+snakex[head]*sidesize+"vh)translateY(-"+snakey[head]*sidesize+"vh)translateZ(40vh)rotateX(40deg)rotateZ("+rot+"rad)"};inithtml=function(){document.body.outerHTML='<title>SNAKE</title>\n<body id=b class="'+pagename+'">\n<div id=perspective>\n  <div id=scene style="transform:translateX(-142vh)translateY(-72vh)rotateZ(90deg)translateZ(79vh);transform-origin:142vh 72vh">\n    <div id=objects></div>\n    <div id=puzzle></div>\n    <div id=snake></div>\n  </div>\n</div>\n<div style="position:fixed;bottom:5px;left:5px;width:200px">\n  <button onclick="rot+=Math.PI/4;move_scene()">\u21bb</button>\n  <button onclick="rot-=Math.PI/4;move_scene()">\u21ba</button>\n  <button onclick="localStorage.clear()">clear</button>'};
drawobjects=function(){objects.innerHTML="";puzzle.innerHTML="";for(var a in trees)objects.innerHTML+="<div id=tree"+a+' class="emoji tree" style="left:'+trees[a][0]*sidesize+"vh;top:"+trees[a][1]*sidesize+"vh;transform:translateZ("+(trees[a][2]*sidesize+2)+'vh)translateX(-8vh)translateY(-15vh)rotateX(-75deg)">\ud83c\udf33</div><div id=treeshadow'+a+' class="emojishadow treeshadow" style="left:'+trees[a][0]*sidesize+"vh;top:"+trees[a][1]*sidesize+"vh;transform:translateZ("+trees[a][2]*sidesize+'vh)translateX(-7vh)translateY(-14vh)rotateZ(144deg)scaleY(1.5)">\ud83c\udf33';
for(a in apples)emoji="",localStorage["appleeaten"+pagename+a]?delete apples[a]:objects.innerHTML+="<div id=apple"+a+' class="emoji apple '+("hub"==pagename&&0==a||localStorage["appleappeared"+pagename+a]?"":"hidden")+'" style="left:'+apples[a][0]*sidesize+"vh;top:"+apples[a][1]*sidesize+'vh">\ud83c\udf4e</div><div id=appleshadow'+a+' class="emojishadow appleshadow '+("hub"==pagename&&0==a||localStorage["appleappeared"+pagename+a]?"":"hidden")+'" style="left:'+apples[a][0]*sidesize+"vh;top:"+apples[a][1]*
sidesize+'vh">\ud83c\udf4e';for(a in doors)objects.innerHTML+="<div id=door"+a+' class="door'+(localStorage["door"+pagename+a]?" open":"")+'" style="left:'+(doors[a][0]+.5)*sidesize+"vh;top:"+(doors[a][1]+.5)*sidesize+"vh;transform:rotateZ("+doors[a][2]+"rad)translateZ("+doors[a][9]*sidesize+'vh)"><div class=realdoor '+(doors[a][6]?"":"hidden")+">"+(doors[a][3]||"")+"</div><div class=path>";for(a in cubes)objects.innerHTML+="<div id=cube"+a+' class="cube rock" style="left:'+cubes[a][0]*sidesize+"vh;top:"+
cubes[a][1]*sidesize+'vh;width:7vh;height:7vh">\n      <div class=front></div>\n      <div class=up style="background-position:'+(-300-cubes[a][0]*sidesize)+"vh "+(-140-cubes[a][1]*sidesize)+'vh"></div>\n      <div class=right></div>\n      <div class=left></div>\n      <div class=back></div>\n      <div class=down>';for(var f in puzzles){var e="";puzzle.innerHTML+='<div class="cube wrap visible" style="left:'+puzzles[f][5]*sidesize+"vh;top:"+puzzles[f][6]*sidesize+"vh;width:"+puzzles[f][0]*sidesize+
"vh;height:"+puzzles[f][0]*sidesize+'vh">\n      \x3c!--div class=left></div>\n      <div class=right></div--\x3e\n      <div id=down'+f+" class=down></div>\n      \x3c!--div id=back"+f+" class=back></div--\x3e\n      \x3c!--div class=up></div>\n      <div class=front--\x3e";if(localStorage["puzzle"+pagename+f])for(a=0;a<puzzles[f][0];a++)for(j=0;j<puzzles[f][0];j++)e+="<div class=cell id=g"+f+"-"+a+"-"+j+" style='width:"+sidesize+"vh;height:"+sidesize+"vh;background:"+("1"==puzzles[f][4][a*puzzles[f][0]+
j]?"green":"gold")+"'></div>";else for(a=0;a<puzzles[f][0];a++)for(j=0;j<puzzles[f][0];j++)e+="<div class=cell id=g"+f+"-"+a+"-"+j+" style='width:"+sidesize+"vh;height:"+sidesize+"vh;background:"+("1"==puzzles[f][4][a*puzzles[f][0]+j]?"#000":"#fff")+"'></div>";top["down"+f].innerHTML+=e}};
enterroom=function(){b.className=pagename;if("hub"==pagename){trees=[[13,9,0],[6,13,0],[35,8,0]];apples=[[11,11,0,0,0],[2,12,0,6,0],[38,10,0,7,0]];doors=[[41,10,Math.PI/2,8,0,"hub2",1,0,10,0],[20,-2,0,15,0,"hub16",1,0,0,0],[-2,11,-Math.PI/2,6,0,"hub16",1,0,0,1]];puzzles=[];cubes=[];for(i=9;15>i;i++)for(j=0;5>j;j++)2==j&&14==i||2==j&&13==i||3==j&&13==i||3==j&&12==i||2==j&&12==i||cubes.push([j,i]);drawobjects();localStorage.snakex?(scene.style.transition="transform .8s, transform-origin .8s linear",
resetsnake(),movesnake()):debug?(scene.style.transition="transform .8s linear, transform-origin .8s linear",resetsnake(),movesnake(),snakex.push(snakex[head]),snakey.push(snakey[head]),snakez.push(0),snakeangle.push(snakeangle[head]),head++,movesnake()):(lock=1,setTimeout('resetsnake();movesnake();snakecubemove0.style.transition="transform .5s"',2E3),setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()",4500),setTimeout("snakecubemove0.style.transition='';snakeshadow0.style.transition=snakecuberotate0.style.transition='transform .2s';snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+
-Math.PI/4+"rad)'",5E3),setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+Math.PI/4+"rad)'",5500),setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='';",6E3),setTimeout("scene.style.transition='transform .8s, transform-origin .8s linear';snakeshadow0.style.transition=snakecuberotate0.style.transition='';lock=0",9E3))}else"hub2"==pagename?(trees=[[35,8,0]],apples=[[33,9,0,0,6]],doors=[[-2,10,-Math.PI/2,8,0,"hub",0,39,11,0],[41,10,Math.PI/2,
9,0,"hub3",1,1,9,0],[22,21,Math.PI,14,0,"hub5",0,22,1,0]],puzzles=[[6,8,0,,"000000001000001110001110001000000000",2,3],[6,8,0,,"000000011000011000001100001100000000",14,3],[6,8,0,,"000000000100001100011000011100000000",26,3],[5,8,0,,"0000001110011100110000000",2,13],[6,8,0,,"000000011000011100010000011000000000",14,13],[6,8,0,,"000000000100001100001110001100000000",26,13]],drawobjects(),scene.style.transition="transform .8s, transform-origin .8s linear",resetsnake(),movesnake()):"hub3"==pagename?
(trees=[[35,8,0]],apples=[[33,9,0,0,12],[34,10,0,0,12]],doors=[[-2,9,-Math.PI/2,8,0,"hub2",0,39,10,0],[22,21,Math.PI,11,0,"hub4",1,22,1,0]],puzzles=[[6,9,0,,"000000000000001100001110011110000000",2,2],[7,9,0,,"0000000001100000110000010000001100000110000000000",14,2],[6,9,0,,"000000000000011000001110011110000000",26,2],[6,9,0,,"000000001110001110000110000010000000",2,11],[7,9,0,,"0000000000100000011000011100001100000010000000000",14,11],[6,9,0,,"000000011000011000001110000110000000",26,11]],cubes=
[],drawobjects(),scene.style.transition="transform .8s, transform-origin .8s linear",resetsnake(),movesnake()):"hub4"==pagename?(trees=[[35,8,0]],apples=[[33,9,0,0,18],[34,10,0,0,18]],doors=[[22,-2,0,8,0,"hub3",0,22,19,0],[-2,10,-Math.PI/2,13,0,"hub5",1,39,10,0]],puzzles=[[6,11,0,,"000000011110011010011110000000000000",2,2],[7,11,0,,"0000000001110000111000001100000110000010000000000",14,2],[6,11,0,,"000000011000011110001010001110000000",26,2],[6,11,0,,"000000011100001110001110001100000000",2,11],
[6,11,0,,"000000001110001110001110001010000000",14,11],[6,11,0,,"000000011110011110001100001000000000",26,11]],cubes=[],drawobjects(),scene.style.transition="transform .8s, transform-origin .8s linear",resetsnake(),movesnake()):"hub5"==pagename&&(trees=[[35,8,0]],apples=[[34,11,0,0,24]],doors=[[41,10,Math.PI/2,8,0,"hub4",0,1,10,0],[22,-2,0,14,0,"hub2",1,22,19,0]],puzzles=[[7,13,0,,"0000000000000001111000111100001111000100000000000",2,2],[7,13,0,,"0000000001110000101000011100001110000110000000000",
14,2],[6,13,0,,"000000001110011110011010001110000000",26,2],[7,13,0,,"0000000001100000111000011100001110000110000000000",2,11],[7,13,0,,"0000000000000001111100101010011111000000000000000",14,11],[7,13,0,,"0000000000000000001100001110001111001111000000000",26,11]],cubes=[],drawobjects(),scene.style.transition="transform .8s, transform-origin .8s linear",resetsnake(),movesnake())};
resetsnake=function(a){snake.innerHTML="";a||(snakex=[],snakey=[],snakez=[],snakeangle=[]);"editor"==b.className&&(sidesize=32/size);head=snakelength-1;if(!a)if("editor"==b.className)for(i=0;i<snakelength;i++)snakex[head-i]=-i-1,snakey[head-i]=~~(size/2),snakez[head-i]=0,snakeangle[head-i]=-Math.PI/2;else if(localStorage.snakex){a=+localStorage.snakex;var f=+localStorage.snakey,e=+localStorage.snakez;if(2>a)for(i=0;i<snakelength;i++)snakex[head-i]=a-i,snakey[head-i]=f,snakez[head-i]=e,snakeangle[head-
i]=-Math.PI/2;else if(28<a)for(i=0;i<snakelength;i++)snakex[head-i]=a+i,snakey[head-i]=f,snakez[head-i]=e,snakeangle[head-i]=Math.PI/2;else if(2>f)for(i=0;i<snakelength;i++)snakex[head-i]=a,snakey[head-i]=f-i,snakez[head-i]=e,snakeangle[head-i]=0;else if(18<f)for(i=0;i<snakelength;i++)snakex[head-i]=a,snakey[head-i]=f+i,snakez[head-i]=e,snakeangle[head-i]=0;else for(i=0;i<snakelength;i++)snakex[head-i]=10,snakey[head-i]=10,snakez[head-i]=-i,snakeangle[head-i]=Math.PI}else if("hub"==b.className)for(i=
0;i<snakelength;i++)snakex[head-i]=20,snakey[head-i]=10,snakez[head-i]=-i-1,snakeangle[head-i]=0;for(i=0;i<Math.max(snakelength,16);i++)snake.innerHTML+="<div id=snakecubemove"+i+' class=snakecubemove style="transform:translateX(50vh)translateY(50vh)translateZ(-10vh);width:'+(sidesize-1)+"vh;height:"+(sidesize-1)+'vh"><div class=snakeshadow id=snakeshadow'+i+"></div><div id=snakecuberotate"+i+' class=snakecuberotate><div class="cube snake" id=snakecube'+i+">"+(1>i?"<div class=tongue>Y</div>":"")+
"<div class=front>"+(1>i?"\u203f":"")+'</div><div class=up style="font-size:'+.5*sidesize+"vh;line-height:"+.8*sidesize+'vh">'+(1>i?"\ud83d\udc40":"")+"</div><div class=right></div><div class=left></div><div class=back></div><div class=down>"};
onload=function(){currentpuzzle=0;gridsize.value=snakesize.value=snakelength=5;ground.checked=!0;hasground=1;wall.checked=!1;wrap.checked=!1;ground.onclick=function(){ground.checked?hasground=1:(hasground=0,haswall=1,wall.checked=!0)};wall.onclick=function(){wall.checked?haswall=1:(haswall=0,hasground=1,ground.checked=!0)};wrap.onclick=function(){wrapenabled=wrap.checked};dw=[];dg=[];snakesize.onchange=snakesize.oninput=function(){snakeval.innerHTML=snakelength=+snakesize.value;resetsnake();movesnake()};
size=5;reset.onclick=gridsize.onchange=gridsize.oninput=resizegrid=function(){gridval.innerHTML=size=+gridsize.value;var a=100/size;down.innerHTML="";ghtml=whtml=back.innerHTML="";dw=[];dg=[];for(i=0;i<size;i++)for(dw[i]=[],dg[i]=[],j=0;j<size;j++)dw[i][j]=0,dg[i][j]=0;for(i=0;i<size;i++)for(j=0;j<size;j++)whtml+="<div class=cell id=w"+cellprefix+"-"+i+"-"+j+" style='width:"+a+"%;padding-top:"+a+"%' onmousedown='paint("+i+","+j+",this,0)' onmousemove='paint("+i+","+j+",this,0,1)'></div>",ghtml+="<div class=cell id=g"+
cellprefix+"-"+i+"-"+j+" style='width:"+a+"%;padding-top:"+a+"%' onmousedown='paint("+i+","+j+",this,1)' onmousemove='paint("+i+","+j+",this,1,1)'></div>";down.innerHTML+=ghtml;back.innerHTML+=whtml;resetsnake();movesnake()};resizegrid();paint=function(a,f,e,g,h){playing||(g=g?dg:dw,h&&mousedown&&(g[a][f]=1),h||(g[a][f]^=1),e.style.background=g[a][f]?"#000":"#fff")};print=function(a){var f="";for(i in a)for(j in a[i])f+=a[i][j];return f};share.onclick=function(){var a=[];a.push(size);a.push(snakesize.value);
a.push(wrap.checked?1:0);a.push(wall.checked?print(dw):"");a.push(ground.checked?print(dg):"");prompt("Share this link:",location+"#"+a)};mousedown=0;onmousedown=function(){mousedown=1};onmouseup=function(){mousedown=0};ondragstart=function(a){a.preventDefault()};playing=puzzling=0;test.onclick=function(){playing=puzzling=1;b.className="editor playing"};quit.onclick=function(){playing?(playing=puzzling=0,b.className="editor",resetsnake(),movesnake(),checkgrid()):location="index.html"};move_scene=
function(){scene.style.transform="rotateX(38deg)translateX(-18vh)rotateZ("+rot+"rad)"};move_scene()};nload=function(){pagename=localStorage.page||"hub";inithtml();debug=0;localStorage.appleappearedhub0=1;enterroom()};