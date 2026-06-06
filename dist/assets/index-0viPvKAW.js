(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(a){if(a.ep)return;a.ep=!0;const s=n(a);fetch(a.href,s)}})();function Me(e,t,n,i,a,s,o){const d=n-e,S=i-t,u=Math.sqrt(d*d+S*S);if(u<5)return{x:e,y:t,moving:!1};const y=1.5;let m=d/u*y,p=S/u*y;const r=e+m,l=t+p;if(a)for(const Y of a){const q=s*Y.x,D=o*Y.y,ie=Y.width*32,ne=Y.height*32;if(r>q&&r<q+ie&&l>D&&l<D+ne){e<q?m=-y:e>q+ie&&(m=y),t<D?p=-y:t>D+ne&&(p=y);break}}const g=50,L=Math.max(g,Math.min(s-g,e+m)),G=Math.max(g,Math.min(o-g,t+p));return{x:L,y:G,moving:!0,direction:Math.atan2(p,m)}}class Ne{constructor(t,n){this.x=t,this.y=n,this.targetX=t,this.targetY=n,this.speed=1,this.path=[],this.pathIndex=0}setTarget(t,n){this.targetX=t,this.targetY=n}update(t,n,i){const a=Me(this.x,this.y,this.targetX,this.targetY,t,n,i);return this.x=a.x,this.y=a.y,a}isMoving(){const t=this.targetX-this.x,n=this.targetY-this.y;return Math.sqrt(t*t+n*n)>10}getDirection(){const t=this.targetX-this.x,n=this.targetY-this.y;return Math.atan2(n,t)}recalculatePath(){}}function _e(e){const t=document.createElement("canvas");t.width=window.innerWidth,t.height=window.innerHeight,e.appendChild(t);const n=t.getContext("2d");n.imageSmoothingEnabled=!0,n.imageSmoothingQuality="high";function i(){t.width=window.innerWidth,t.height=window.innerHeight,n.imageSmoothingEnabled=!0,n.imageSmoothingQuality="high"}return window.addEventListener("resize",i),{canvas:t,ctx:n,resize:i}}const v=new Map,h=32;function _(e,t){const n=document.createElement("canvas");n.width=e,n.height=t;const i=n.getContext("2d");return i.imageSmoothingEnabled=!0,i.imageSmoothingQuality="high",{canvas:n,ctx:i}}function Te(e,t,n,i,a,s,o,d=!0){const S=d?e.createLinearGradient(t,n,t,n+a):e.createLinearGradient(t,n,t+i,n);S.addColorStop(0,s),S.addColorStop(1,o),e.fillStyle=S,e.fillRect(t,n,i,a)}function Pe(e){const t="grass_"+e;if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(h,h),a=i.createRadialGradient(16,16,0,16,16,24);a.addColorStop(0,"#6aaa40"),a.addColorStop(.6,"#5a9a30"),a.addColorStop(1,"#4a8a25"),i.fillStyle=a,i.fillRect(0,0,h,h),i.fillStyle="#4a8a26";for(let s=0;s<25;s++){const o=(e*100+s*127)%h,d=(e*200+s*251)%h;i.beginPath(),i.moveTo(o,d+5),i.lineTo(o+1,d),i.lineTo(o+2,d+5),i.fill()}i.fillStyle="#7aba50";for(let s=0;s<12;s++){const o=(e*150+s*173)%(h-4)+2,d=(e*250+s*311)%(h-6)+3;i.fillRect(o,d,2,3),i.fillStyle="#8aca60",i.fillRect(o,d,1,2),i.fillStyle="#7aba50"}i.fillStyle="rgba(90, 60, 30, 0.3)";for(let s=0;s<6;s++){const o=(e*300+s*97)%h,d=(e*400+s*131)%h;i.beginPath(),i.ellipse(o,d,2,1.5,0,0,Math.PI*2),i.fill()}e%5===0&&(i.fillStyle="#ff69b4",i.beginPath(),i.arc(14,14,4,0,Math.PI*2),i.fill(),i.fillStyle="#ff1493",i.beginPath(),i.arc(14,14,2,0,Math.PI*2),i.fill(),i.fillStyle="#ffb6c1",i.beginPath(),i.arc(13,13,1,0,Math.PI*2),i.fill()),i.fillStyle="#8a8a7a";for(let s=0;s<3;s++){const o=(e*200+s*67)%h,d=(e*300+s*89)%h;i.beginPath(),i.ellipse(o,d,1.5,1,0,0,Math.PI*2),i.fill()}return v.set(t,n),n}function Le(e){const t="dirt_"+e;if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(h,h),a=i.createRadialGradient(16,16,0,16,16,24);a.addColorStop(0,"#d4b080"),a.addColorStop(.5,"#c4a06a"),a.addColorStop(1,"#a08050"),i.fillStyle=a,i.fillRect(0,0,h,h),i.fillStyle="#b49060";for(let s=0;s<15;s++){const o=(e*100+s*137)%h,d=(e*200+s*271)%h;i.fillRect(o,d,3,2),i.fillStyle="#a48050",i.fillRect(o+1,d,1,1),i.fillStyle="#b49060"}i.fillStyle="#e4c090";for(let s=0;s<8;s++){const o=(e*150+s*193)%h,d=(e*250+s*331)%h;i.fillRect(o,d,2,1)}i.fillStyle="#9a8a70";for(let s=0;s<4;s++){const o=(e*250+s*73)%h,d=(e*350+s*97)%h;i.beginPath(),i.ellipse(o,d,2,1.5,0,0,Math.PI*2),i.fill()}return v.set(t,n),n}function $e(e,t){const n="water_"+Math.floor(e/200)+"_"+t;if(v.has(n))return v.get(n);const{canvas:i,ctx:a}=_(h,h),s=a.createLinearGradient(0,0,0,h);s.addColorStop(0,"#6a9cd0"),s.addColorStop(.5,"#5a8cc0"),s.addColorStop(1,"#4a7cb0"),a.fillStyle=s,a.fillRect(0,0,h,h);const o=(e+t*100)%600/600;a.fillStyle="rgba(120, 180, 240, 0.4)";for(let d=0;d<h;d+=4){const S=Math.sin((d+o*h)*.5)*4;a.beginPath(),a.ellipse(S+8,d+2,7,2.5,0,0,Math.PI*2),a.fill(),a.beginPath(),a.ellipse(S+22,d+3,6,2,0,0,Math.PI*2),a.fill()}return a.fillStyle="rgba(180, 220, 255, 0.6)",a.fillRect(6,8,3,2),a.fillRect(20,14,2,2),a.fillRect(12,22,2,2),a.fillRect(25,6,2,1),a.fillStyle="rgba(30, 60, 100, 0.2)",a.fillRect(0,h-4,h,4),v.set(n,i),i}function Ae(){const e="road";if(v.has(e))return v.get(e);const{canvas:t,ctx:n}=_(h,h),i=n.createLinearGradient(0,0,0,h);i.addColorStop(0,"#a89a8a"),i.addColorStop(.5,"#9a8a7a"),i.addColorStop(1,"#8a7a6a"),n.fillStyle=i,n.fillRect(0,0,h,h),n.fillStyle="rgba(0, 0, 0, 0.08)";for(let a=0;a<10;a++){const s=(a*7+2)%h,o=(a*11+5)%h;n.fillRect(s,o,3,2)}n.fillStyle="rgba(255, 255, 255, 0.15)",n.fillRect(0,0,h,1),n.fillStyle="rgba(0, 0, 0, 0.15)",n.fillRect(0,h-2,h,2),n.fillStyle="#e8e4d8",n.fillRect(15,0,2,h),n.fillStyle="#f8f4e8",n.fillRect(15,0,1,h),n.fillStyle="rgba(255, 255, 255, 0.1)";for(let a=0;a<4;a++)n.fillRect(15,a*8+2,2,4);return v.set(e,t),t}function Ge(e,t){const n="building_detailed_"+e+"_"+Math.floor(t/2e3);if(v.has(n))return v.get(n);const{canvas:i,ctx:a}=_(h*4,h*4),s=a.createLinearGradient(0,0,h*4,0);s.addColorStop(0,"#a8a8a8"),s.addColorStop(.3,"#9a9a9a"),s.addColorStop(.7,"#8a8a8a"),s.addColorStop(1,"#7a7a7a"),a.fillStyle=s,a.fillRect(0,0,h*4,h*4),a.strokeStyle="rgba(0, 0, 0, 0.1)",a.lineWidth=1;for(let u=0;u<h*4;u+=8)a.beginPath(),a.moveTo(0,u),a.lineTo(h*4,u),a.stroke();for(let u=0;u<h*4;u+=16){const y=Math.floor(u/16)%2*8;for(let m=y;m<h*4;m+=16)a.beginPath(),a.moveTo(u,m),a.lineTo(u,m+8),a.stroke()}const o=a.createLinearGradient(0,0,0,12);o.addColorStop(0,"#d85a4a"),o.addColorStop(.5,"#c44a3a"),o.addColorStop(1,"#a03a2a"),a.fillStyle=o,a.fillRect(0,0,h*4,12),a.fillStyle="#b03a2a";for(let u=0;u<h*4;u+=8)a.beginPath(),a.moveTo(u,12),a.lineTo(u+4,6),a.lineTo(u+8,12),a.fill();a.fillStyle="#8a2a1a",a.fillRect(0,10,h*4,3),a.fillStyle="#2a2015",a.fillRect(h*2-14,h*4-32,28,32),a.fillStyle="#3a3025",a.fillRect(h*2-12,h*4-30,24,30),a.fillStyle="#c0a030",a.beginPath(),a.arc(h*2+6,h*4-16,2,0,Math.PI*2),a.fill();const d=e==="lit",S=Math.sin(t*.003)*.2+.8;for(let u=20;u<h*4-28;u+=18)for(let y=12;y<h*4-16;y+=20)if(d){const m=a.createRadialGradient(y+6,u+6,0,y+6,u+6,20);m.addColorStop(0,"rgba(255, 245, 180, 0.4)"),m.addColorStop(1,"rgba(255, 220, 100, 0)"),a.fillStyle=m,a.fillRect(y-14,u-14,40,40),a.fillStyle="#4a4035",a.fillRect(y,u,12,12);const p=.8+Math.sin(y+t*.002)*.2;a.fillStyle=`rgba(255, 245, 180, ${p*S})`,a.fillRect(y+1,u+1,10,10),a.fillStyle="rgba(255, 255, 220, 0.6)",a.fillRect(y+1,u+1,4,4),a.fillStyle="#3a3025",a.fillRect(y+5,u,2,12),a.fillRect(y,u+5,12,2)}else a.fillStyle="#3a3a40",a.fillRect(y,u,12,12),a.fillStyle="#2a2a30",a.fillRect(y+1,u+1,10,10),a.fillStyle="#4a4a50",a.fillRect(y+5,u,2,12),a.fillRect(y,u+5,12,2);return v.set(n,i),i}function Re(e){const t="tree_detailed_"+e;if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(h,h);Te(i,0,0,h,h,"#5a9a30","#3a7a18");const a=i.createLinearGradient(14,18,19,32);a.addColorStop(0,"#7a5a3a"),a.addColorStop(.5,"#6a4a2a"),a.addColorStop(1,"#5a3a1a"),i.fillStyle=a,i.fillRect(14,18,5,14),i.fillStyle="#5a3a1a",i.fillRect(15,20,1,10),i.fillRect(18,22,1,8),i.fillStyle="rgba(0, 50, 0, 0.3)",i.beginPath(),i.ellipse(16,26,12,4,0,0,Math.PI*2),i.fill();const s=i.createRadialGradient(16,10,2,16,10,14);return s.addColorStop(0,"#7aba50"),s.addColorStop(.5,"#5a9a30"),s.addColorStop(.8,"#4a8a25"),s.addColorStop(1,"#3a7a18"),i.fillStyle=s,i.beginPath(),i.arc(16,10,13,0,Math.PI*2),i.fill(),i.fillStyle="#6aaa40",i.beginPath(),i.arc(12,8,7,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(20,8,7,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(16,4,6,0,Math.PI*2),i.fill(),i.fillStyle="#8aca60",i.beginPath(),i.arc(14,6,4,0,Math.PI*2),i.fill(),i.beginPath(),i.arc(18,10,3,0,Math.PI*2),i.fill(),i.fillStyle="#5a4030",i.beginPath(),i.ellipse(16.5,18,3,1.5,0,0,Math.PI*2),i.fill(),v.set(t,n),n}function ce(e){const t="npc_human_detailed_"+e;if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(24,32),a=["#f5d0b0","#e5c0a0","#d5b090","#c5a080"],s=["#4a6a9a","#6a5a8a","#5a7a6a","#8a6a5a","#7a5a6a"],o=["#3a4a5a","#4a3a3a","#5a4a3a","#3a3a4a"],d=a[e%4],S=s[Math.floor(e/4)%5],u=o[Math.floor(e/8)%4];return i.fillStyle="rgba(0, 0, 0, 0.2)",i.beginPath(),i.ellipse(12,30,6,2,0,0,Math.PI*2),i.fill(),i.fillStyle=u,i.fillRect(8,18,8,14),i.fillStyle=N(u,-15),i.fillRect(8,18,8,2),i.fillStyle=N(u,10),i.fillRect(8,28,8,4),i.fillStyle=S,i.fillRect(6,10,12,10),i.fillStyle=N(S,-15),i.fillRect(6,10,12,2),i.fillStyle=N(S,15),i.fillRect(6,16,12,4),i.fillStyle=d,i.beginPath(),i.arc(12,6,5,0,Math.PI*2),i.fill(),i.fillStyle=N(d,-25),i.beginPath(),i.arc(12,3,5,Math.PI,Math.PI*2),i.fill(),i.fillStyle="#2a2a2a",i.fillRect(10,5,1.5,2),i.fillRect(12.5,5,1.5,2),i.fillStyle=N(d,-20),i.fillRect(11,8,2,1),i.fillStyle=d,i.fillRect(4,11,3,7),i.fillRect(17,11,3,7),i.fillStyle="#3a3a3a",i.fillRect(7,28,4,4),i.fillRect(13,28,4,4),v.set(t,n),n}function N(e,t){if(e==="human")return"#888888";const n=parseInt(e.replace("#",""),16),i=Math.round(2.55*t),a=(n>>16)+i,s=(n>>8&255)+i,o=(n&255)+i;return"#"+(16777216+(a<255?a<1?0:a:255)*65536+(s<255?s<1?0:s:255)*256+(o<255?o<1?0:o:255)).toString(16).slice(1)}function Oe(e){const t=(e%(Math.PI*2)+Math.PI*2)%(Math.PI*2);return Math.floor((t+Math.PI/8)/(Math.PI/4))%8}function He(e,t,n,i,a,s=1){const o=i%8;e.save(),e.translate(t,n);const d=a||"#d84a4a",S=N(d,20),u=N(d,-20);N(d,-40);const y="#3a3a3a",m="#4a4a4a",p=N(d,-10),r=(l,g,L)=>{e.fillStyle=L,e.fillRect(l*s,g*s,s,s)};if(o===0){for(let l=0;l<8;l++)r(4,4+l*2,y),r(5,4+l*2,y),r(6,4+l*2,m),r(7,4+l*2,m),r(24,4+l*2,y),r(25,4+l*2,y),r(26,4+l*2,m),r(27,4+l*2,m);for(let l=8;l<20;l++)for(let g=8;g<24;g++)g===8||g===23||l===8||l===19?r(g,l,u):r(g,l,d);for(let l=10;l<16;l++)for(let g=12;g<20;g++)g===12||g===19||l===10||l===15?r(g,l,S):r(g,l,d);r(15,4,p),r(16,4,p),r(15,5,p),r(16,5,p),r(15,6,p),r(16,6,p),r(15,7,p),r(16,7,p)}else if(o===1){for(let l=0;l<8;l++)r(8+l,2,y),r(9+l,3,y),r(18+l,2,m),r(19+l,3,m);for(let l=0;l<6;l++)for(let g=0;g<10-l;g++)r(10+l+g,6+l,d),r(10+g,6+l,d);r(22,0,p),r(23,0,p),r(24,1,p),r(25,1,p)}else if(o===2){for(let l=0;l<8;l++)r(4+l*2,4,y),r(4+l*2,5,y),r(4+l*2,6,m),r(4+l*2,7,m);for(let l=8;l<24;l++)for(let g=8;g<16;g++)l===8||l===23||g===8||g===15?r(l,g,u):r(l,g,d);r(24,11,p),r(25,11,p),r(26,11,p),r(27,11,p),r(24,12,p),r(25,12,p)}else if(o===3){for(let l=0;l<8;l++)r(8+l,20,y),r(9+l,21,y),r(18+l,20,m),r(19+l,21,m);for(let l=0;l<6;l++)for(let g=0;g<10-l;g++)r(10+l+g,18-l,d),r(10+g,18-l,d);r(22,22,p),r(23,22,p),r(24,23,p),r(25,23,p)}else if(o===4){for(let l=0;l<8;l++)r(4,4+l*2,y),r(5,4+l*2,y),r(6,4+l*2,m),r(7,4+l*2,m),r(24,4+l*2,y),r(25,4+l*2,y),r(26,4+l*2,m),r(27,4+l*2,m);for(let l=4;l<16;l++)for(let g=8;g<24;g++)g===8||g===23||l===4||l===15?r(g,l,u):r(g,l,d);for(let l=6;l<12;l++)for(let g=12;g<20;g++)g===12||g===19||l===6||l===11?r(g,l,S):r(g,l,d);r(15,16,p),r(16,16,p),r(15,17,p),r(16,17,p),r(15,18,p),r(16,18,p),r(15,19,p),r(16,19,p)}else if(o===5){for(let l=0;l<8;l++)r(4+l,20,y),r(5+l,21,y),r(4+l,20,m),r(5+l,21,m);for(let l=0;l<6;l++)for(let g=0;g<10-l;g++)r(10-l+g,18-l,d),r(10+g,18-l,d);r(6,22,p),r(7,22,p),r(4,23,p),r(5,23,p)}else if(o===6){for(let l=0;l<8;l++)r(4+l*2,16,y),r(4+l*2,17,y),r(4+l*2,18,m),r(4+l*2,19,m);for(let l=8;l<24;l++)for(let g=8;g<16;g++)l===8||l===23||g===8||g===15?r(l,g,u):r(l,g,d);r(0,11,p),r(1,11,p),r(2,11,p),r(3,11,p),r(4,11,p),r(5,11,p)}else if(o===7){for(let l=0;l<8;l++)r(4+l,2,y),r(5+l,3,y),r(4+l,2,m),r(5+l,3,m);for(let l=0;l<6;l++)for(let g=0;g<10-l;g++)r(10-l+g,6+l,d),r(10+g,6+l,d);r(6,0,p),r(7,0,p),r(4,1,p),r(5,1,p)}e.restore()}function K(e,t,n,i,a){const s=Oe(i);He(e,t-16,n-12,s,a,2)}function Ue(e){const t="coin_detailed_"+Math.floor(e/200);if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(20,20),a=Math.sin(e*.008),s=5+Math.abs(a)*7;i.fillStyle="rgba(0, 0, 0, 0.2)",i.beginPath(),i.ellipse(10,12,s*.8,3,0,0,Math.PI*2),i.fill();const o=i.createRadialGradient(10-s*.2,8,0,10,10,10);return o.addColorStop(0,"#f8e080"),o.addColorStop(.4,"#f0d060"),o.addColorStop(.8,"#c0a030"),o.addColorStop(1,"#a08020"),i.fillStyle=o,i.beginPath(),i.ellipse(10,10,s,8,0,0,Math.PI*2),i.fill(),i.strokeStyle="#806010",i.lineWidth=1,i.beginPath(),i.ellipse(10,10,s,8,0,0,Math.PI*2),i.stroke(),i.fillStyle="rgba(255, 255, 255, 0.5)",i.beginPath(),i.ellipse(10-s*.3,8,s*.4,3,0,0,Math.PI*2),i.fill(),s>8&&(i.fillStyle="#f8f080",i.font="8px Arial",i.textAlign="center",i.fillText("★",10,12)),v.set(t,n),n}function Be(e){const t="lamp_detailed_"+Math.floor(e/500);if(v.has(t))return v.get(t);const{canvas:n,ctx:i}=_(20,44),a=.85+Math.sin(e*.006)*.15,s=i.createLinearGradient(9,8,11,44);s.addColorStop(0,"#7a7a7a"),s.addColorStop(.5,"#5a5a5a"),s.addColorStop(1,"#3a3a3a"),i.fillStyle=s,i.fillRect(9,8,3,36),i.fillStyle="#6a6a6a",i.fillRect(6,6,8,4);const o=i.createRadialGradient(10,4,0,10,4,25);return o.addColorStop(0,`rgba(255, 255, 200, ${a*.7})`),o.addColorStop(.3,`rgba(255, 255, 150, ${a*.4})`),o.addColorStop(.6,`rgba(255, 220, 100, ${a*.15})`),o.addColorStop(1,"rgba(255, 200, 50, 0)"),i.fillStyle=o,i.beginPath(),i.arc(10,4,25,0,Math.PI*2),i.fill(),i.fillStyle=`rgba(255, 255, 220, ${a})`,i.beginPath(),i.arc(10,4,6,0,Math.PI*2),i.fill(),i.fillStyle="#fffff0",i.beginPath(),i.arc(10,4,4,0,Math.PI*2),i.fill(),i.fillStyle="#ffffff",i.beginPath(),i.arc(9,3,2,0,Math.PI*2),i.fill(),v.set(t,n),n}const B=[];function fe(e,t,n){B.push({x:e,y:t,vx:(Math.random()-.5)*4,vy:-Math.random()*4-1,life:1,type:n,size:2+Math.random()*5})}function ze(){for(let e=B.length-1;e>=0;e--){const t=B[e];t.x+=t.vx,t.y+=t.vy,t.vy+=.12,t.life-=.02,t.life<=0&&B.splice(e,1)}}function We(e){for(const t of B)if(e.globalAlpha=t.life,t.type==="sparkle"){const n=e.createRadialGradient(t.x,t.y,0,t.x,t.y,t.size*2);n.addColorStop(0,"#ffff88"),n.addColorStop(.5,"#ffcc00"),n.addColorStop(1,"rgba(255, 200, 0, 0)"),e.fillStyle=n,e.beginPath(),e.arc(t.x,t.y,t.size*2,0,Math.PI*2),e.fill()}else t.type==="dust"&&(e.fillStyle="#a09080",e.beginPath(),e.arc(t.x,t.y,t.size,0,Math.PI*2),e.fill());e.globalAlpha=1}let J=0;function Ye(e,t){for(let n=0;n<25;n++)fe(e,t,"sparkle");J=Date.now()}const z=[];function qe(e,t,n,i){z.length=0;const a=["red_wolf","townsfolk","bar_drinker","human"],s=["#d84a4a","#6a9a6a","#8a6a4a","human"];for(let o=0;o<e;o++){const d=o%a.length,S=Math.random()*(t-200)+100,u=Math.random()*(n-200)+100;z.push({x:S,y:u,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2,type:a[d],color:s[d],direction:Math.random()*Math.PI*2,speed:.5+Math.random()*1,changeTimer:0,variant:o,pathfinder:new Ne(S,u)})}}function De(e,t,n,i){for(const a of z){a.changeTimer+=1,a.changeTimer>60+Math.random()*60&&(a.changeTimer=0,a.direction=Math.random()*Math.PI*2,a.speed=.3+Math.random()*.5);const s=Math.cos(a.direction)*a.speed,o=Math.sin(a.direction)*a.speed;a.x+=s,a.y+=o,(a.x<50||a.x>e-50)&&(a.direction=Math.PI-a.direction,a.x=Math.max(50,Math.min(e-50,a.x))),(a.y<50||a.y>t-50)&&(a.direction=-a.direction,a.y=Math.max(50,Math.min(t-50,a.y))),a.pathfinder&&a.pathfinder.update(i,e,t)}}function Fe(e,t){for(const n of z)if(n.type==="red_wolf")K(e,n.x,n.y,n.direction,"#d84a4a");else if(n.type==="human"||n.type==="townsfolk"||n.type==="bar_drinker"){const i=ce(n.variant);e.save(),e.translate(n.x,n.y),Math.cos(n.direction)<0&&e.scale(-1,1),e.drawImage(i,-12,-16),e.restore()}else K(e,n.x,n.y,n.direction,n.color)}function Xe(e,t,n){const{canvas:i,ctx:a}=_(h,h),s=a.createRadialGradient(16,16,0,16,16,24);s.addColorStop(0,"#4a4035"),s.addColorStop(.5,"#3a3025"),s.addColorStop(1,"#2a2015"),a.fillStyle=s,a.fillRect(0,0,h,h),a.strokeStyle="rgba(0, 0, 0, 0.15)",a.lineWidth=1;for(let u=0;u<h;u+=8)a.beginPath(),a.moveTo(0,u),a.lineTo(h,u),a.stroke();a.strokeStyle="rgba(255, 255, 255, 0.05)",a.beginPath(),a.moveTo(0,0),a.lineTo(h,0),a.stroke(),a.fillStyle="rgba(0, 0, 0, 0.1)",a.fillRect(0,0,h,1),a.fillRect(0,0,1,h);const o=i,d=Math.ceil(t/h)+1,S=Math.ceil(n/h)+1;for(let u=0;u<S;u++)for(let y=0;y<d;y++)e.drawImage(o,y*h,u*h)}function Ke(e,t,n,i,a){const s=n*e.canvas.width,o=i*e.canvas.height;switch(e.save(),e.translate(s,o),t.type){case"table":const d=e.createLinearGradient(-30,-20,30,10);d.addColorStop(0,"#6a5040"),d.addColorStop(.5,"#5a4030"),d.addColorStop(1,"#4a3020"),e.fillStyle=d,e.fillRect(-30,-15,60,30),e.fillStyle="#7a6050",e.fillRect(-30,-15,60,4),e.fillStyle="#4a3020",e.fillRect(-28,10,6,20),e.fillRect(22,10,6,20),e.strokeStyle="rgba(0, 0, 0, 0.1)",e.lineWidth=1,e.beginPath(),e.moveTo(-25,-10),e.lineTo(25,-10),e.moveTo(-25,0),e.lineTo(25,0),e.stroke();break;case"bed":e.fillStyle="#5a4030",e.fillRect(-28,-22,56,44),e.fillStyle="#6a5a50",e.fillRect(-26,-20,52,24),e.fillStyle="#8a7a70",e.fillRect(-22,-18,20,12),e.fillStyle="#9a8a80",e.fillRect(-20,-16,16,8),e.fillStyle="#5a6a7a",e.fillRect(-24,-4,48,18),e.fillStyle="#6a7a8a",e.fillRect(-22,-2,44,14),e.fillStyle="#4a3020",e.fillRect(-26,18,6,6),e.fillRect(20,18,6,6);break;case"lamp":e.fillStyle="#5a5a50",e.fillRect(-3,-28,6,28),e.fillStyle="#6a6a60",e.beginPath(),e.moveTo(-10,-30),e.lineTo(10,-30),e.lineTo(8,-20),e.lineTo(-8,-20),e.closePath(),e.fill();const S=e.createRadialGradient(0,-25,0,0,-25,50);S.addColorStop(0,"rgba(255, 255, 200, 0.6)"),S.addColorStop(.3,"rgba(255, 255, 180, 0.3)"),S.addColorStop(1,"rgba(255, 255, 150, 0)"),e.fillStyle=S,e.beginPath(),e.arc(0,-25,50,0,Math.PI*2),e.fill(),e.fillStyle="#ffffc0",e.beginPath(),e.arc(0,-25,6,0,Math.PI*2),e.fill();break;case"counter":const u=e.createLinearGradient(-40,-20,40,15);u.addColorStop(0,"#6a5a4a"),u.addColorStop(.5,"#5a4a3a"),u.addColorStop(1,"#4a3a2a"),e.fillStyle=u,e.fillRect(-40,-15,80,30),e.fillStyle="#7a6a5a",e.fillRect(-40,-15,80,4),e.fillStyle="#8a7a6a",e.fillRect(-38,-11,76,4),e.fillStyle="#4a3a2a",e.fillRect(-38,-5,35,18),e.fillRect(3,-5,35,18);break;case"shelf":e.fillStyle="#5a4535",e.fillRect(-32,-45,64,90),e.fillStyle="#6a5545",e.fillRect(-30,-43,60,4),e.fillRect(-30,-15,60,4),e.fillRect(-30,13,60,4),e.fillRect(-30,38,60,4),e.fillStyle="#8a7a6a";for(let g=0;g<3;g++)e.fillRect(-25,-38+g*28,50,8),e.fillStyle="#7a6a5a",e.fillRect(-20,-30+g*28,10,12),e.fillRect(-5,-30+g*28,15,12),e.fillRect(15,-30+g*28,10,12),e.fillStyle="#8a7a6a";break;case"crate":const y=e.createLinearGradient(-22,-22,22,22);y.addColorStop(0,"#7a6a50"),y.addColorStop(.5,"#6a5a40"),y.addColorStop(1,"#5a4a30"),e.fillStyle=y,e.fillRect(-20,-20,40,40),e.fillStyle="#8a7a60",e.fillRect(-20,-20,40,3),e.fillRect(-20,-20,3,40),e.fillStyle="#4a3a20",e.fillRect(-20,17,40,3),e.fillRect(17,-20,3,40),e.strokeStyle="#5a4a30",e.lineWidth=2,e.beginPath(),e.moveTo(-20,0),e.lineTo(20,0),e.moveTo(0,-20),e.lineTo(0,20),e.stroke();break;case"workbench":e.fillStyle="#5a5a5a",e.fillRect(-38,-15,76,30),e.fillStyle="#6a6a6a",e.fillRect(-36,-13,72,6),e.fillStyle="#4a4a4a",e.fillRect(-34,12,8,18),e.fillRect(26,12,8,18),e.fillStyle="#8a8a8a",e.fillRect(-30,-8,20,4),e.fillRect(10,-8,15,4);break;case"oil_barrel":const m=e.createLinearGradient(-16,-20,16,20);m.addColorStop(0,"#5a7a5a"),m.addColorStop(.5,"#4a6a4a"),m.addColorStop(1,"#3a5a3a"),e.fillStyle=m,e.beginPath(),e.ellipse(0,-12,14,6,0,0,Math.PI*2),e.fill(),e.fillRect(-14,-12,28,28),e.beginPath(),e.ellipse(0,16,14,6,0,0,Math.PI*2),e.fill(),e.strokeStyle="#3a4a3a",e.lineWidth=2,e.beginPath(),e.ellipse(0,-8,13,4,0,0,Math.PI*2),e.stroke(),e.beginPath(),e.ellipse(0,12,13,4,0,0,Math.PI*2),e.stroke();break;case"weapon_rack":e.fillStyle="#4a3a2a",e.fillRect(-38,-55,76,110),e.fillStyle="#5a4a3a";for(let g=0;g<4;g++)e.fillRect(-36,-50+g*28,72,4);e.fillStyle="#7a7a7a";for(let g=0;g<4;g++)e.fillRect(-30,-45+g*28,60,6),e.fillStyle="#6a6a6a",e.fillRect(-25,-42+g*28,50,3),e.fillStyle="#8a8a8a";break;case"radar":e.fillStyle="#3a4a5a",e.fillRect(-45,10,90,25);const p=e.createRadialGradient(0,-20,0,0,-20,45);p.addColorStop(0,"#5a7a8a"),p.addColorStop(.7,"#4a6a7a"),p.addColorStop(1,"#3a5a6a"),e.fillStyle=p,e.beginPath(),e.ellipse(0,-20,42,32,0,0,Math.PI*2),e.fill(),e.fillStyle="#2a4a5a",e.beginPath(),e.ellipse(0,-20,36,26,0,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(100, 200, 100, 0.6)",e.lineWidth=2;const r=a*.004%(Math.PI*2);e.beginPath(),e.moveTo(0,-20),e.lineTo(Math.cos(r)*34,-20+Math.sin(r)*24),e.stroke(),e.strokeStyle="rgba(100, 180, 100, 0.4)",e.beginPath(),e.ellipse(0,-20,25,18,0,0,Math.PI*2),e.stroke(),e.beginPath(),e.ellipse(0,-20,12,9,0,0,Math.PI*2),e.stroke(),e.fillStyle="#80ff80",e.beginPath(),e.arc(0,-20,3,0,Math.PI*2),e.fill();break;case"console":e.fillStyle="#4a5a6a",e.fillRect(-35,-25,70,45),e.fillStyle="#2a3a4a",e.fillRect(-32,-22,64,35),e.fillStyle="#3a5a7a",e.fillRect(-30,-20,28,20),e.fillRect(2,-20,28,20);const l=Math.sin(a*.008)>0;e.fillStyle=l?"#80ff80":"#306030",e.beginPath(),e.arc(-25,10,3,0,Math.PI*2),e.fill(),e.fillStyle=l?"#ff8080":"#603030",e.beginPath(),e.arc(-15,10,3,0,Math.PI*2),e.fill();break;case"map_table":e.fillStyle="#5a5040",e.fillRect(-45,-30,90,60),e.fillStyle="#6a6050",e.fillRect(-43,-28,86,56),e.fillStyle="#d4c4a4",e.fillRect(-40,-25,80,50),e.fillStyle="#b4a484",e.fillRect(-35,-20,30,40),e.fillRect(5,-15,30,30),e.fillStyle="#c44a4a",e.beginPath(),e.arc(-20,0,4,0,Math.PI*2),e.fill(),e.fillStyle="#4a4ac4",e.beginPath(),e.arc(20,-5,4,0,Math.PI*2),e.fill();break}e.restore()}function je(e,t,n,i){if(!t.exitPosition)return;const a=t.exitPosition.x*n,s=t.exitPosition.y*i,o=e.createRadialGradient(a,s,0,a,s,45);o.addColorStop(0,"rgba(150, 255, 150, 0.4)"),o.addColorStop(.5,"rgba(100, 200, 100, 0.2)"),o.addColorStop(1,"rgba(50, 150, 50, 0)"),e.fillStyle=o,e.beginPath(),e.arc(a,s,45,0,Math.PI*2),e.fill(),e.strokeStyle="rgba(100, 255, 100, 0.7)",e.lineWidth=3,e.setLineDash([8,6]),e.beginPath(),e.arc(a,s,35,0,Math.PI*2),e.stroke(),e.setLineDash([]),e.fillStyle="#ffffff",e.font="bold 16px Courier New",e.textAlign="center",e.fillText("⬆",a,s-50),e.font="12px Courier New",e.fillText("出口",a,s-38)}function Qe(e,t,n,i,a){Xe(e,n,i);const s=e.createRadialGradient(n/2,i/2,0,n/2,i/2,n/2);if(s.addColorStop(0,"rgba(255, 250, 240, 0.1)"),s.addColorStop(1,"rgba(0, 0, 0, 0.2)"),e.fillStyle=s,e.fillRect(0,0,n,i),t.items)for(const o of t.items)Ke(e,o,o.x,o.y,a);je(e,t,n,i)}function Ve(e,t,n,i,a){t.isInterior?Qe(e,t,n,i,a):Ze(e,n,i,a,t.buildings)}function Ze(e,t,n,i,a){const s=Math.ceil(t/h)+2,o=Math.ceil(n/h)+2,d=12345;function S(m,p){return Math.sin(d+m*123.456+p*789.012)*.5+.5}for(let m=0;m<o;m++)for(let p=0;p<s;p++){const r=p*h,l=m*h,g=S(p,m),L=Math.floor(S(p+100,m+100)*10);let G;g<.65?G=Pe(L):g<.82?G=Le(L):G=$e(i,L),e.drawImage(G,r,l)}const u=Math.floor(n/h/2)*h;for(let m=0;m<t;m+=h){const p=Ae();e.drawImage(p,m,u-h),e.drawImage(p,m,u),e.drawImage(p,m,u+h)}if(a)for(const m of a){const p=t*m.x,r=n*m.y,l=Ge(m.type,i);e.drawImage(l,p,r),m.enterable&&(e.fillStyle="rgba(100, 255, 100, 0.3)",e.beginPath(),e.arc(p+h*2,r+h*3.5,18,0,Math.PI*2),e.fill(),e.fillStyle="#ffffff",e.font="bold 14px Courier New",e.textAlign="center",e.fillText("入",p+h*2,r+h*3.5+5))}for(let m=0;m<16;m++){const p=(.03+m*.062)*t,r=u-h*1.5+m%2*h*3,l=Be(i);e.drawImage(l,p,r);const g=e.createRadialGradient(p+10,r+4,0,p+10,r+4,80);g.addColorStop(0,"rgba(255, 255, 200, 0.08)"),g.addColorStop(1,"rgba(255, 255, 200, 0)"),e.fillStyle=g,e.beginPath(),e.arc(p+10,r+4,80,0,Math.PI*2),e.fill()}const y=[];for(let m=0;m<15;m++)y.push({x:.05+m%5*.2+Math.sin(m*123)*.02,y:.08+Math.floor(m/5)*.22+Math.cos(m*234)*.02,v:m});for(const m of y){const p=t*m.x,r=n*m.y;if(Math.abs(r-u)>h*2){const l=Re(m.v);e.drawImage(l,p,r)}}if(ze(),We(e),Date.now()-J<150){const m=1-(Date.now()-J)/150;e.fillStyle=`rgba(255, 255, 220, ${m*.3})`,e.fillRect(0,0,t,n)}}function ae(e,t,n,i,a=0){i?K(e,t,n,a,"#d84a4a"):(e.globalAlpha=.6,K(e,t,n,a,"#d84a4a"),e.globalAlpha=1),i&&Math.random()>.9&&fe(t+(Math.random()-.5)*25,n-12,"dust")}function Je(e,t,n,i){const a=Ue(i);e.drawImage(a,t-10,n-10),e.globalAlpha=.15+Math.sin(i*.005)*.1;const s=e.createRadialGradient(t,n,0,t,n,20);s.addColorStop(0,"rgba(255, 255, 100, 0.8)"),s.addColorStop(.5,"rgba(255, 255, 50, 0.4)"),s.addColorStop(1,"rgba(255, 255, 50, 0)"),e.fillStyle=s,e.beginPath(),e.arc(t,n,20,0,Math.PI*2),e.fill(),e.globalAlpha=1}function et(){return z}function tt(e){return{x:e.canvas.width/2,y:e.canvas.height/2,tankX:e.canvas.width/2,tankY:e.canvas.height/2,size:20,targetX:e.canvas.width/2,targetY:e.canvas.height/2,speed:.12,isInTank:!0,variant:5,walkFrame:0}}function it(e,t,n,i,a){e.targetX=t*i,e.targetY=n*a;const s=e.isInTank?.06:.025,o=e.targetX-e.x,d=e.targetY-e.y;e.x+=o*s,e.y+=d*s,e.isInTank&&(e.tankX=e.x,e.tankY=e.y),(Math.abs(o)>2||Math.abs(d)>2)&&e.walkFrame++}function nt(e,t){if(!t.isInTank){const n=ce(t.variant);e.save(),e.translate(t.x,t.y);const i=Math.sin(t.walkFrame*.3)*2;e.translate(0,i),e.drawImage(n,-12,-16),e.restore()}}function at(e){return e.isInTank?{x:e.x-32,y:e.y-24,width:64,height:48}:{x:e.x-12,y:e.y-16,width:24,height:32}}function st(e){e.isInTank?(e.isInTank=!1,e.x=e.tankX+40,e.y=e.tankY):Math.sqrt((e.x-e.tankX)**2+(e.y-e.tankY)**2)<60&&(e.isInTank=!0,e.x=e.tankX,e.y=e.tankY)}const W=[],F=[],ot=20;function he(e,t,n=[]){const i=F.length<ot?{collected:!1}:F.find(u=>u.collected);if(!i)return null;let a=!1,s,o,d=0;const S=50;for(;!a&&d<50;){s=S+Math.random()*(e-S*2),o=S+Math.random()*(t-S*2),a=!0;for(const u of n)if(Math.sqrt((s-u.x)**2+(o-u.y)**2)<60){a=!1;break}d++}return i.x=s,i.y=o,i.size=18,i.floatPhase=Math.random()*Math.PI*2,i.collected=!1,i.baseY=o,F.includes(i)||F.push(i),W.includes(i)||W.push(i),i}function lt(e,t,n){for(const i of e)i.collected||(i.y=i.baseY+Math.sin(t*.004+i.floatPhase)*5)}function rt(e,t,n){for(const i of t)i.collected||Je(e,i.x,i.y,n)}function dt(e){return{x:e.x-e.size/2,y:e.y-e.size/2,width:e.size,height:e.size}}function ct(e){Ye(e.x,e.y),e.collected=!0;const t=W.indexOf(e);t>-1&&W.splice(t,1)}function j(){return W.filter(e=>!e.collected)}function ft(e,t){return e.x<t.x+t.width&&e.x+e.width>t.x&&e.y<t.y+t.height&&e.y+e.height>t.y}function ht(e,t){const n={x:e.x-10,y:e.y-10,width:e.width+20,height:e.height+20};return ft(n,t)}let se=0;const X=document.getElementById("score-value"),Z=document.getElementById("game-tip"),$=document.getElementById("toggle-vehicle-btn");function gt(e){se=e,X&&(X.textContent=se,X.style.transform="scale(1.2)",setTimeout(()=>{X.style.transform="scale(1)"},100))}function ut(){Z&&(Z.style.opacity="0",setTimeout(()=>{Z.style.display="none"},500))}function ge(e){$&&(e.isInTank?($.textContent="下车",$.disabled=!1):Math.sqrt((e.x-e.tankX)**2+(e.y-e.tankY)**2)<60?($.textContent="上车",$.disabled=!1):($.textContent="靠近坦克",$.disabled=!0))}const P={intro:[{speaker:"爸爸",text:"什么，你说想成为超级勇士？还没放弃这种无聊的追求！",delay:2500},{speaker:"姐姐",text:"爸爸，不要发这样大的火。",delay:2e3},{speaker:"爸爸",text:"没有你的事！人应该老老实实地生活，这才是主要的。说过多少次了还不懂？",delay:3e3},{speaker:"爸爸",text:"这个笨家伙！像你这样的，今天就从家里给我出去！让外面的冷风好好吹吹你那发昏的脑袋吧！",delay:3500},{speaker:"旁白",text:"就这样，你被老爸揪出了家门……",delay:2e3},{speaker:"旁白",text:"夜晚，你在家门口睡着了……",delay:2e3},{speaker:"邻居",text:"哈哈，又淘气给爸爸赶出家了吧！",delay:2e3},{speaker:"旁白",text:"天亮了，新的冒险即将开始……",delay:2e3}],missions:[{id:1,name:"寻找战车",description:"去镇南的山洞里找到第一辆战车",target:1,type:"get_tank",reward:"获得第一辆战车"},{id:2,name:"消灭水怪",description:"消灭镇北山洞里的水怪",target:1,type:"defeat_monster",reward:"获得1000G赏金"}],npcs:{dad:{name:"爸爸",dialogs:["什么，你说想成为超级勇士？还没放弃这种无聊的追求！","人应该老老实实地生活，这才是主要的。","快走吧！到哪儿去都行！","……（沉默）"]},sister:{name:"姐姐",dialogs:["哦，终于回来了！","累了？休息一下吧。","爸爸也是为你好……"]},neighbor:{name:"邻居",dialogs:["哈哈，又淘气给爸爸赶出家了吧！","就你？哈哈……你是个小孩耶～","这是拉多镇，你不是修理厂的小孩吗？"]},red_wolf:{name:"红狼",dialogs:["……（沉默）","哼，破车。","小孩，让给你了。"]},townsfolk:{name:"镇民",dialogs:["镇的南面有个洞穴里有辆战车，勇士们都集中在这个镇了。","山洞里的战车是红狼发现的。","酒吧里来了一位驾驶红色战车的赏金杀手。","镇子遭受过怪物的掠夺，南边的山洞是他们的老巢。","连战车都没有就谈不上作勇士，只会老死街头。","找到战车后就去找机械师和士兵作同伴。"]},bar_drinker:{name:"醉汉",dialogs:["这个世界是以去过多远的地方，见过多少人来衡量人生的价值。","红狼？他在散布谣言。"]}}};let E=null,U=0,oe=new Set,M=P.missions[0],mt=!1,pt=!1;function yt(){U=0,ue()}function ue(){U<P.intro.length?(E={type:"intro",...P.intro[U]},setTimeout(()=>{U++,ue()},P.intro[U].delay||2e3)):E=null}function bt(e,t){if(oe.has(t))return;const n=P.npcs[e];if(n){const i=n.dialogs[Math.floor(Math.random()*n.dialogs.length)];E={type:"npc",speaker:n.name,text:i},oe.add(t),setTimeout(()=>{E=null},3e3)}}function St(){kt()}function kt(){if(M){let e=!1;if(M.type==="get_tank"?e=mt:M.type==="defeat_monster"&&(e=pt),e){const t=P.missions.findIndex(n=>n.id===M.id);t<P.missions.length-1?(M=P.missions[t+1],E={type:"mission",speaker:"系统",text:`任务完成！${M.name}：${M.description}`},setTimeout(()=>{E=null},3500)):E={type:"complete",speaker:"系统",text:"恭喜！你已经完成了拉多镇的所有任务！"}}}}function wt(){if(!M)return{current:0,target:0};let e=0;return(M.type==="get_tank"||M.type==="defeat_monster")&&(e=0),{current:e,target:M.target,mission:M}}function vt(){E=null}let T=null,H=null;function xt(){It(),Ct()}function It(){T=document.createElement("div"),T.id="dialog-container",T.style.cssText=`
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 20, 40, 0.95);
    border: 3px solid #c42c2c;
    border-radius: 12px;
    padding: 20px 30px;
    max-width: 600px;
    width: 90%;
    z-index: 100;
    display: none;
    box-shadow: 0 0 30px rgba(196, 44, 44, 0.3);
  `,T.innerHTML=`
    <div id="dialog-speaker" style="color: #c42c2c; font-weight: bold; margin-bottom: 8px; font-family: 'Courier New', monospace;"></div>
    <div id="dialog-text" style="color: #fff; line-height: 1.6; font-family: 'Courier New', monospace;"></div>
    <div id="dialog-hint" style="color: #888; margin-top: 10px; font-size: 12px; text-align: right; font-family: 'Courier New', monospace;">点击继续...</div>
  `,T.addEventListener("click",vt),document.body.appendChild(T)}function Ct(){H=document.createElement("div"),H.id="mission-container",H.style.cssText=`
    position: fixed;
    top: 80px;
    left: 20px;
    background: rgba(20, 20, 40, 0.9);
    border: 2px solid #4a6a9a;
    border-radius: 8px;
    padding: 12px 16px;
    z-index: 99;
    font-family: 'Courier New', monospace;
  `,H.innerHTML=`
    <div style="color: #4a9aff; font-weight: bold; margin-bottom: 6px;">📋 当前任务</div>
    <div id="mission-name" style="color: #fff; margin-bottom: 4px;"></div>
    <div id="mission-progress" style="color: #aaa; font-size: 13px;"></div>
  `,document.body.appendChild(H)}function Et(){E?(T.style.display="block",document.getElementById("dialog-speaker").textContent=E.type==="mission"?"🎯 任务":E.type==="complete"?"🎉 恭喜":E.speaker||"对话",document.getElementById("dialog-text").textContent=E.text,document.getElementById("dialog-hint").style.display=E.type==="intro"?"none":"block"):T.style.display="none"}function Mt(){const e=wt();e.mission&&(document.getElementById("mission-name").textContent=e.mission.name,document.getElementById("mission-progress").textContent=`进度：${e.current} / ${e.target} - ${e.mission.description}`)}function Nt(){const e=document.createElement("div");return e.id="start-screen",e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(180deg, #0a0a15 0%, #1a1020 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 200;
  `,e.innerHTML=`
    <h1 style="color: #c42c2c; font-size: 48px; margin-bottom: 20px; text-shadow: 0 0 20px rgba(196, 44, 44, 0.5); font-family: 'Courier New', monospace;">
      重装机兵
    </h1>
    <p style="color: #aaa; margin-bottom: 40px; font-size: 18px; font-family: 'Courier New', monospace;">
      红狼传说
    </p>
    <button id="start-btn" style="
      background: linear-gradient(180deg, #c42c2c, #7a0f0f);
      color: #fff;
      border: 3px solid #e84c4c;
      padding: 15px 60px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Courier New', monospace;
      box-shadow: 0 4px 0 #4a0a0a;
    ">开始游戏</button>
    <div style="color: #666; margin-top: 40px; font-size: 14px; font-family: 'Courier New', monospace;">
      <p>🎮 移动鼠标控制坦克</p>
      <p>💎 收集能量晶石</p>
      <p>💬 点击 NPC 对话</p>
    </div>
  `,document.body.appendChild(e),new Promise(t=>{document.getElementById("start-btn").addEventListener("click",()=>{e.style.display="none",t()})})}const Q={town:{id:"town",name:"拉多镇(リオラド)",background:"#1a1a2e",buildings:[{id:"home",x:.12,y:.22,width:5,height:4,name:"主角家",enterable:!0,interior:"home_interior"},{id:"bar",x:.35,y:.18,width:4,height:4,name:"酒吧",enterable:!0,interior:"bar_interior"},{id:"shop",x:.58,y:.25,width:4,height:4,name:"勇士商店",enterable:!0,interior:"shop_interior"},{id:"garage",x:.8,y:.2,width:5,height:4,name:"战车修理厂",enterable:!0,interior:"garage_interior"},{id:"hospital",x:.1,y:.6,width:4,height:4,name:"明奇研究所",enterable:!0,interior:"hospital_interior"},{id:"hunter_office",x:.38,y:.62,width:4,height:4,name:"勇士办事处",enterable:!0,interior:"hunter_interior"},{id:"inn",x:.62,y:.58,width:4,height:4,name:"旅店",enterable:!0,interior:"inn_interior"}]},home_interior:{id:"home_interior",name:"主角家内部",background:"#2a2015",isInterior:!0,floorTiles:!0,items:[{type:"table",x:.5,y:.4},{type:"bed",x:.3,y:.65},{type:"bed",x:.7,y:.65}],exitPosition:{x:.5,y:.9}},bar_interior:{id:"bar_interior",name:"酒吧内部",background:"#1a1515",isInterior:!0,floorTiles:!0,items:[{type:"counter",x:.5,y:.3},{type:"table",x:.3,y:.6},{type:"table",x:.7,y:.6}],exitPosition:{x:.5,y:.9}},shop_interior:{id:"shop_interior",name:"勇士商店内部",background:"#1a1a25",isInterior:!0,floorTiles:!0,items:[{type:"counter",x:.5,y:.4},{type:"shelf",x:.3,y:.6},{type:"shelf",x:.7,y:.6}],exitPosition:{x:.5,y:.9}},garage_interior:{id:"garage_interior",name:"战车修理厂内部",background:"#252015",isInterior:!0,floorTiles:!0,items:[{type:"workbench",x:.5,y:.4},{type:"tool_rack",x:.3,y:.65},{type:"oil_barrel",x:.7,y:.65}],exitPosition:{x:.5,y:.9}},hospital_interior:{id:"hospital_interior",name:"明奇研究所内部",background:"#151a20",isInterior:!0,floorTiles:!0,items:[{type:"table",x:.5,y:.35},{type:"machine",x:.3,y:.6},{type:"machine",x:.7,y:.6}],exitPosition:{x:.5,y:.9}},hunter_interior:{id:"hunter_interior",name:"勇士办事处内部",background:"#15201a",isInterior:!0,floorTiles:!0,items:[{type:"counter",x:.5,y:.4},{type:"wanted_posters",x:.3,y:.25},{type:"chair",x:.7,y:.6}],exitPosition:{x:.5,y:.9}},inn_interior:{id:"inn_interior",name:"旅店内部",background:"#20151a",isInterior:!0,floorTiles:!0,items:[{type:"counter",x:.5,y:.35},{type:"bed",x:.3,y:.6},{type:"bed",x:.7,y:.6}],exitPosition:{x:.5,y:.9}}};let C=Q.town;function _t(e){return Q[e]?(C=Q[e],!0):!1}function Tt(e,t,n,i){const a=C.exitPosition;return a&&(e=a.x*n,t=a.y*i),C=Q.town,{x:e,y:t}}function Pt(e,t,n,i){if(C.isInterior)return null;const a=C.buildings,s=32;for(const o of a){if(!o.enterable)continue;const d=n*o.x,S=i*o.y,u=o.width*s,y=o.height*s;if(e>=d&&e<=d+u&&t>=S&&t<=S+y)return o}return null}function Lt(e,t,n,i){if(!C.isInterior||!C.exitPosition)return!1;const a=C.exitPosition.x*n,s=C.exitPosition.y*i;return Math.sqrt((e-a)**2+(t-s)**2)<40}const f={MAIN_CANNON:"mainCannon",SUB_CANNON:"subCannon",SE:"se",C_UNIT:"cUnit",ENGINE:"engine",HAT:"hat",ARMOR:"armor",GLOVE:"glove",SHOES:"shoes",WEAPON:"weapon"},b={SINGLE:"single",GROUP:"group",ALL:"all"},me=[{id:"mc_45",name:"45炮",attack:45,defense:0,price:100,weight:1.5,ammo:99,range:b.SINGLE},{id:"mc_55",name:"55炮",attack:55,defense:0,price:300,weight:2,ammo:99,range:b.SINGLE},{id:"mc_75",name:"75炮",attack:75,defense:0,price:800,weight:3,ammo:99,range:b.SINGLE},{id:"mc_80h",name:"80高炮",attack:80,defense:0,price:1200,weight:3.5,ammo:99,range:b.SINGLE},{id:"mc_95",name:"95炮",attack:95,defense:0,price:2e3,weight:4,ammo:99,range:b.SINGLE},{id:"mc_105j",name:"105加农",attack:105,defense:0,price:3500,weight:4.5,ammo:99,range:b.SINGLE},{id:"mc_115t",name:"115T型",attack:115,defense:0,price:5e3,weight:5,ammo:99,range:b.SINGLE},{id:"mc_125t",name:"125T型",attack:125,defense:0,price:7e3,weight:5.5,ammo:99,range:b.SINGLE},{id:"mc_125j",name:"125加农",attack:125,defense:0,price:8e3,weight:5.5,ammo:99,range:b.SINGLE},{id:"mc_135j",name:"135加农",attack:135,defense:0,price:1e4,weight:6,ammo:99,range:b.SINGLE},{id:"mc_140h",name:"140高炮",attack:140,defense:0,price:12e3,weight:6.5,ammo:99,range:b.SINGLE},{id:"mc_155j",name:"155加农",attack:155,defense:0,price:15e3,weight:7,ammo:99,range:b.SINGLE},{id:"mc_160h",name:"160滑膛",attack:160,defense:0,price:18e3,weight:7.5,ammo:99,range:b.SINGLE},{id:"mc_165t",name:"165T型",attack:165,defense:0,price:22e3,weight:8,ammo:99,range:b.SINGLE},{id:"mc_165g",name:"165钢炮",attack:165,defense:0,price:25e3,weight:8,ammo:99,range:b.SINGLE},{id:"mc_175j",name:"175加农",attack:175,defense:0,price:3e4,weight:8.5,ammo:99,range:b.SINGLE},{id:"mc_180h",name:"180高炮",attack:180,defense:0,price:35e3,weight:9,ammo:99,range:b.SINGLE},{id:"mc_195j",name:"195加农",attack:195,defense:0,price:45e3,weight:9.5,ammo:99,range:b.SINGLE},{id:"mc_205j",name:"205加农",attack:205,defense:0,price:55e3,weight:10,ammo:99,range:b.SINGLE},{id:"mc_220",name:"220炮",attack:220,defense:0,price:7e4,weight:11,ammo:99,range:b.SINGLE}],pe=[{id:"sc_07jg",name:"07机关",attack:7,defense:0,price:50,weight:.5,ammo:null,range:b.SINGLE},{id:"sc_09jg",name:"09机关",attack:9,defense:0,price:100,weight:.6,ammo:null,range:b.SINGLE},{id:"sc_glp",name:"格林炮",attack:12,defense:0,price:200,weight:.8,ammo:null,range:b.SINGLE},{id:"sc_09hp",name:"09火炮",attack:9,defense:0,price:150,weight:.7,ammo:99,range:b.SINGLE},{id:"sc_11jg",name:"11机关",attack:11,defense:0,price:250,weight:.8,ammo:null,range:b.SINGLE},{id:"sc_11hp",name:"11火炮",attack:11,defense:0,price:300,weight:.9,ammo:99,range:b.SINGLE},{id:"sc_15jg",name:"15机关",attack:15,defense:0,price:400,weight:1,ammo:null,range:b.SINGLE},{id:"sc_ls",name:"雷神",attack:20,defense:0,price:600,weight:1.2,ammo:null,range:b.SINGLE},{id:"sc_18jg",name:"18机关",attack:18,defense:0,price:500,weight:1.1,ammo:null,range:b.SINGLE},{id:"sc_jg",name:"激光",attack:25,defense:0,price:800,weight:1.3,ammo:null,range:b.SINGLE},{id:"sc_sd",name:"闪电",attack:30,defense:0,price:1e3,weight:1.5,ammo:null,range:b.SINGLE},{id:"sc_20hp",name:"20火炮",attack:20,defense:0,price:700,weight:1.2,ammo:99,range:b.SINGLE},{id:"sc_25jg",name:"25机关",attack:25,defense:0,price:900,weight:1.4,ammo:null,range:b.SINGLE},{id:"sc_hl",name:"火龙",attack:35,defense:0,price:1500,weight:1.8,ammo:null,range:b.GROUP},{id:"sc_bt",name:"波坦",attack:40,defense:0,price:2e3,weight:2,ammo:null,range:b.SINGLE},{id:"sc_fb",name:"风暴",attack:45,defense:0,price:2500,weight:2.2,ammo:null,range:b.GROUP},{id:"sc_atm",name:"ATM导弹",attack:50,defense:0,price:3e3,weight:2.5,ammo:20,range:b.SINGLE},{id:"sc_ph",name:"喷火",attack:30,defense:0,price:1800,weight:1.6,ammo:null,range:b.GROUP},{id:"sc_lx",name:"LI旋炮",attack:55,defense:0,price:3500,weight:2.8,ammo:null,range:b.SINGLE},{id:"sc_qd",name:"汽弹",attack:60,defense:0,price:4e3,weight:3,ammo:15,range:b.SINGLE},{id:"sc_jp",name:"巨炮",attack:65,defense:0,price:4500,weight:3.2,ammo:null,range:b.SINGLE},{id:"sc_dg",name:"电光",attack:70,defense:0,price:5e3,weight:3.5,ammo:null,range:b.SINGLE},{id:"sc_lk",name:"拉卡",attack:75,defense:0,price:5500,weight:3.8,ammo:null,range:b.GROUP},{id:"sc_ft",name:"福特",attack:80,defense:0,price:6e3,weight:4,ammo:null,range:b.SINGLE},{id:"sc_tf",name:"台风",attack:85,defense:0,price:6500,weight:4.2,ammo:null,range:b.GROUP},{id:"sc_hs",name:"火神",attack:90,defense:0,price:7e3,weight:4.5,ammo:null,range:b.SINGLE},{id:"sc_ld",name:"雷电",attack:95,defense:0,price:7500,weight:4.8,ammo:null,range:b.SINGLE},{id:"sc_jj",name:"截击",attack:100,defense:0,price:8e3,weight:5,ammo:null,range:b.SINGLE},{id:"sc_hl2",name:"火狼",attack:105,defense:0,price:8500,weight:5.2,ammo:null,range:b.GROUP},{id:"sc_qx",name:"气旋",attack:110,defense:0,price:9e3,weight:5.5,ammo:null,range:b.ALL},{id:"sc_tl",name:"托卢",attack:115,defense:0,price:1e4,weight:6,ammo:null,range:b.SINGLE},{id:"sc_hal900",name:"HAL900",attack:120,defense:0,price:12e3,weight:6.5,ammo:null,range:b.SINGLE},{id:"sc_nk",name:"尼克",attack:125,defense:0,price:14e3,weight:7,ammo:null,range:b.SINGLE},{id:"sc_am",name:"艾米",attack:130,defense:0,price:16e3,weight:7.5,ammo:null,range:b.SINGLE},{id:"sc_solomon2",name:"SOLOMON2",attack:140,defense:0,price:2e4,weight:8,ammo:null,range:b.ALL}],ye=[{id:"se_missile",name:"导弹",attack:80,defense:0,price:3e3,weight:3,ammo:10,range:b.SINGLE},{id:"se_torpedo",name:"鱼雷",attack:100,defense:0,price:5e3,weight:4,ammo:8,range:b.SINGLE},{id:"se_flamethrower",name:"火焰喷射器",attack:60,defense:0,price:2500,weight:2.5,ammo:null,range:b.GROUP},{id:"se_ice",name:"冷冻炮",attack:70,defense:0,price:4e3,weight:3.5,ammo:15,range:b.SINGLE},{id:"se_plasma",name:"等离子炮",attack:120,defense:0,price:8e3,weight:5,ammo:null,range:b.SINGLE},{id:"se_sonic",name:"音波炮",attack:90,defense:0,price:6e3,weight:4.5,ammo:null,range:b.GROUP},{id:"se_laser",name:"激光炮",attack:150,defense:0,price:12e3,weight:6,ammo:null,range:b.SINGLE},{id:"se_napalm",name:"凝固汽油弹",attack:85,defense:0,price:5500,weight:4.2,ammo:12,range:b.GROUP},{id:"se_emp",name:"电磁脉冲",attack:95,defense:0,price:7e3,weight:4.8,ammo:null,range:b.ALL},{id:"se_antiair",name:"对空导弹",attack:110,defense:0,price:9e3,weight:5.5,ammo:10,range:b.SINGLE}],be=[{id:"cu_hal900",name:"HAL900",attack:0,defense:5,price:15e3,weight:2,accuracy:15,evasion:10},{id:"cu_nike",name:"尼克",attack:0,defense:8,price:18e3,weight:2.5,accuracy:20,evasion:15},{id:"cu_amy",name:"艾米",attack:0,defense:10,price:22e3,weight:3,accuracy:25,evasion:20},{id:"cu_solomon2",name:"SOLOMON2",attack:0,defense:15,price:3e4,weight:4,accuracy:35,evasion:30}],Se=[{id:"eng_mot1",name:"MOT1",attack:0,defense:0,price:500,weight:1,loadCapacity:3,fuel:50},{id:"eng_mot2",name:"MOT2",attack:0,defense:0,price:1e3,weight:1.5,loadCapacity:5,fuel:80},{id:"eng_mot3",name:"MOT3",attack:0,defense:0,price:2e3,weight:2,loadCapacity:8,fuel:120},{id:"eng_sol0",name:"SOL0",attack:0,defense:0,price:3e3,weight:2.5,loadCapacity:10,fuel:150},{id:"eng_sol1",name:"SOL1",attack:0,defense:0,price:5e3,weight:3,loadCapacity:12,fuel:180},{id:"eng_sol2",name:"SOL2",attack:0,defense:0,price:8e3,weight:3.5,loadCapacity:15,fuel:220},{id:"eng_bul",name:"BUL",attack:0,defense:0,price:4e3,weight:2.8,loadCapacity:11,fuel:160},{id:"eng_bul1",name:"BUL1",attack:0,defense:0,price:7e3,weight:3.2,loadCapacity:14,fuel:200},{id:"eng_bul11",name:"BUL11",attack:0,defense:0,price:1e4,weight:3.8,loadCapacity:18,fuel:260},{id:"eng_hun0",name:"HUN0",attack:0,defense:0,price:6e3,weight:3,loadCapacity:13,fuel:190},{id:"eng_hun1",name:"HUN1",attack:0,defense:0,price:9e3,weight:3.5,loadCapacity:16,fuel:230},{id:"eng_hun2",name:"HUN2",attack:0,defense:0,price:12e3,weight:4,loadCapacity:20,fuel:280},{id:"eng_v24",name:"V24",attack:0,defense:0,price:15e3,weight:4.5,loadCapacity:22,fuel:320},{id:"eng_v36",name:"V36",attack:0,defense:0,price:2e4,weight:5,loadCapacity:25,fuel:380},{id:"eng_v48",name:"V48",attack:0,defense:0,price:25e3,weight:5.5,loadCapacity:28,fuel:420},{id:"eng_sil0",name:"SIL0",attack:0,defense:0,price:18e3,weight:4.2,loadCapacity:24,fuel:350},{id:"eng_sil1",name:"SIL1",attack:0,defense:0,price:23e3,weight:4.8,loadCapacity:27,fuel:400},{id:"eng_sil2",name:"SIL2",attack:0,defense:0,price:28e3,weight:5.2,loadCapacity:30,fuel:450},{id:"eng_ohc",name:"OHC",attack:0,defense:0,price:3e4,weight:5.8,loadCapacity:32,fuel:480},{id:"eng_turbo",name:"涡轮",attack:0,defense:0,price:35e3,weight:6,loadCapacity:35,fuel:520},{id:"eng_jet",name:"喷气",attack:0,defense:0,price:4e4,weight:6.5,loadCapacity:38,fuel:560},{id:"eng_v66",name:"V66",attack:0,defense:0,price:5e4,weight:7,loadCapacity:42,fuel:620},{id:"eng_v100",name:"V100",attack:0,defense:0,price:65e3,weight:8,loadCapacity:50,fuel:700}],ke=[{id:"hat_goldcrown",name:"金冠",attack:0,defense:15,price:5e3,weight:.5},{id:"hat_headband",name:"头巾",attack:0,defense:5,price:200,weight:.1}],we=[{id:"armor_steel",name:"钢甲",attack:0,defense:20,price:1500,weight:5},{id:"armor_iron",name:"铁甲",attack:0,defense:30,price:3e3,weight:7},{id:"armor_gold",name:"金甲",attack:0,defense:50,price:8e3,weight:10},{id:"armor_goldcloth",name:"金衣",attack:0,defense:35,price:5e3,weight:3}],ve=[{id:"glove_goldclaw",name:"金爪",attack:25,defense:5,price:4e3,weight:.3}],xe=[{id:"shoe_steel",name:"钢靴",attack:0,defense:10,price:1e3,weight:2},{id:"shoe_gold",name:"金靴",attack:0,defense:20,price:6e3,weight:3}],Ie=[{id:"wp_laser",name:"激光炮",attack:100,defense:0,price:1e4,weight:2,range:b.SINGLE},{id:"wp_armor",name:"穿甲炮",attack:80,defense:0,price:6e3,weight:3,range:b.SINGLE},{id:"wp_knife",name:"首",attack:15,defense:0,price:100,weight:.2,range:b.SINGLE},{id:"wp_blade",name:"宝刀",attack:40,defense:0,price:2500,weight:.8,range:b.SINGLE}];function R(e){return[...me,...pe,...ye,...be,...Se,...ke,...we,...ve,...xe,...Ie].find(n=>n.id===e)}function $t(e){switch(e){case f.MAIN_CANNON:return me;case f.SUB_CANNON:return pe;case f.SE:return ye;case f.C_UNIT:return be;case f.ENGINE:return Se;case f.HAT:return ke;case f.ARMOR:return we;case f.GLOVE:return ve;case f.SHOES:return xe;case f.WEAPON:return Ie;default:return[]}}function At(e){return[f.MAIN_CANNON,f.SUB_CANNON,f.SE,f.C_UNIT,f.ENGINE].includes(e)}function Gt(e){return[f.HAT,f.ARMOR,f.GLOVE,f.SHOES,f.WEAPON].includes(e)}class Rt{constructor(){this.mainCannon=null,this.subCannon=null,this.se=null,this.cUnit=null,this.engine=null}}class Ot{constructor(){this.hat=null,this.armor=null,this.glove=null,this.shoes=null,this.weapon=null}}class le{constructor(t="坦克",n=null){this.name=t,this.id=n||t,this.slots=new Rt,this.currentFuel=0,this.currentAmmo={}}getTotalWeight(){let t=0;for(const n in this.slots)this.slots[n]&&(t+=this.slots[n].weight||0);return t}getLoadCapacity(){return this.slots.engine?this.slots.engine.loadCapacity:0}isOverloaded(){return this.getTotalWeight()>this.getLoadCapacity()}getTotalAttack(){let t=0;return this.slots.mainCannon&&(t+=this.slots.mainCannon.attack||0),this.slots.subCannon&&(t+=this.slots.subCannon.attack||0),this.slots.se&&(t+=this.slots.se.attack||0),t}getTotalDefense(){let t=0;return this.slots.cUnit&&(t+=this.slots.cUnit.defense||0),t}getAccuracyBonus(){return this.slots.cUnit&&this.slots.cUnit.accuracy||0}getEvasionBonus(){return this.slots.cUnit&&this.slots.cUnit.evasion||0}getMaxFuel(){return this.slots.engine?this.slots.engine.fuel:0}}class re{constructor(t="角色",n=null){this.name=t,this.id=n||t,this.slots=new Ot}getTotalWeight(){let t=0;for(const n in this.slots)this.slots[n]&&(t+=this.slots[n].weight||0);return t}getTotalAttack(){let t=0;return this.slots.weapon&&(t+=this.slots.weapon.attack||0),this.slots.glove&&(t+=this.slots.glove.attack||0),t}getTotalDefense(){let t=0;return this.slots.hat&&(t+=this.slots.hat.defense||0),this.slots.armor&&(t+=this.slots.armor.defense||0),this.slots.glove&&(t+=this.slots.glove.defense||0),this.slots.shoes&&(t+=this.slots.shoes.defense||0),t}}class Ht{constructor(){this.gold=1e3,this.tanks=[new le("1号坦克")],this.humans=[new re("主角")],this.inventory={mainCannons:[],subCannons:[],seEquipments:[],cUnits:[],engines:[],hats:[],armors:[],gloves:[],shoes:[],weapons:[]}}getGold(){return this.gold}addGold(t){return this.gold+=t,!0}spendGold(t){return this.gold>=t?(this.gold-=t,!0):!1}canAfford(t){return this.gold>=t}buyEquipment(t,n=1){const i=R(t);if(!i)return{success:!1,message:"装备不存在"};const a=i.price*n;return this.canAfford(a)?(this.spendGold(a),this.addToInventory(t,n),{success:!0,message:`购买了 ${i.name} x${n}`}):{success:!1,message:"金币不足"}}sellEquipment(t,n=1){const i=R(t);if(!i)return{success:!1,message:"装备不存在"};const a=this.getInventoryListByType(this.getEquipmentType(t)),s=a.findIndex(d=>d.id===t);if(s===-1||a[s].quantity<n)return{success:!1,message:"背包中装备数量不足"};const o=Math.floor(i.price*.5);return this.addGold(o*n),a[s].quantity-=n,a[s].quantity<=0&&a.splice(s,1),{success:!0,message:`出售了 ${i.name} x${n}，获得 ${o*n} 金币`}}addToInventory(t,n=1){const i=R(t);if(!i)return!1;const a=this.getEquipmentType(t),s=this.getInventoryListByType(a),o=s.find(d=>d.id===t);return o?o.quantity+=n:s.push({...i,quantity:n}),!0}removeFromInventory(t,n=1){const i=this.getEquipmentType(t),a=this.getInventoryListByType(i),s=a.findIndex(o=>o.id===t);return s===-1?!1:(a[s].quantity-=n,a[s].quantity<=0&&a.splice(s,1),!0)}getInventoryQuantity(t){const n=this.getEquipmentType(t),a=this.getInventoryListByType(n).find(s=>s.id===t);return a?a.quantity:0}getInventoryListByType(t){switch(t){case f.MAIN_CANNON:return this.inventory.mainCannons;case f.SUB_CANNON:return this.inventory.subCannons;case f.SE:return this.inventory.seEquipments;case f.C_UNIT:return this.inventory.cUnits;case f.ENGINE:return this.inventory.engines;case f.HAT:return this.inventory.hats;case f.ARMOR:return this.inventory.armors;case f.GLOVE:return this.inventory.gloves;case f.SHOES:return this.inventory.shoes;case f.WEAPON:return this.inventory.weapons;default:return[]}}getEquipmentType(t){return t.startsWith("mc_")?f.MAIN_CANNON:t.startsWith("sc_")?f.SUB_CANNON:t.startsWith("se_")?f.SE:t.startsWith("cu_")?f.C_UNIT:t.startsWith("eng_")?f.ENGINE:t.startsWith("hat_")?f.HAT:t.startsWith("armor_")?f.ARMOR:t.startsWith("glove_")?f.GLOVE:t.startsWith("shoe_")?f.SHOES:t.startsWith("wp_")?f.WEAPON:null}installTankEquipment(t,n){if(t<0||t>=this.tanks.length)return{success:!1,message:"坦克不存在"};const i=R(n);if(!i)return{success:!1,message:"装备不存在"};const a=this.getEquipmentType(n);if(!At(a))return{success:!1,message:"该装备不能安装在坦克上"};const s=this.tanks[t];if(this.getInventoryQuantity(n)<=0)return{success:!1,message:"背包中没有该装备"};let o;switch(a){case f.MAIN_CANNON:o="mainCannon";break;case f.SUB_CANNON:o="subCannon";break;case f.SE:o="se";break;case f.C_UNIT:o="cUnit";break;case f.ENGINE:o="engine";break;default:return{success:!1,message:"未知装备类型"}}return s.slots[o]&&this.addToInventory(s.slots[o].id,1),s.slots[o]={...i},this.removeFromInventory(n,1),i.ammo&&(s.currentAmmo[n]=i.ammo),s.isOverloaded()?{success:!0,message:`${i.name} 已安装，但坦克超载！`}:{success:!0,message:`${i.name} 已安装到 ${s.name}`}}uninstallTankEquipment(t,n){if(t<0||t>=this.tanks.length)return{success:!1,message:"坦克不存在"};const i=this.tanks[t];if(!i.slots[n])return{success:!1,message:"该槽位没有装备"};const a=i.slots[n];return this.addToInventory(a.id,1),i.slots[n]=null,a.ammo&&i.currentAmmo[a.id]!==void 0&&delete i.currentAmmo[a.id],{success:!0,message:`${a.name} 已卸下`}}installHumanEquipment(t,n){if(t<0||t>=this.humans.length)return{success:!1,message:"角色不存在"};const i=R(n);if(!i)return{success:!1,message:"装备不存在"};const a=this.getEquipmentType(n);if(!Gt(a))return{success:!1,message:"该装备不能装备在人类角色上"};const s=this.humans[t];if(this.getInventoryQuantity(n)<=0)return{success:!1,message:"背包中没有该装备"};let o;switch(a){case f.HAT:o="hat";break;case f.ARMOR:o="armor";break;case f.GLOVE:o="glove";break;case f.SHOES:o="shoes";break;case f.WEAPON:o="weapon";break;default:return{success:!1,message:"未知装备类型"}}return s.slots[o]&&this.addToInventory(s.slots[o].id,1),s.slots[o]={...i},this.removeFromInventory(n,1),{success:!0,message:`${i.name} 已装备到 ${s.name}`}}uninstallHumanEquipment(t,n){if(t<0||t>=this.humans.length)return{success:!1,message:"角色不存在"};const i=this.humans[t];if(!i.slots[n])return{success:!1,message:"该槽位没有装备"};const a=i.slots[n];return this.addToInventory(a.id,1),i.slots[n]=null,{success:!0,message:`${a.name} 已卸下`}}refillAmmo(t,n){if(t<0||t>=this.tanks.length)return{success:!1,message:"坦克不存在"};const i=this.tanks[t],a=R(n);return!a||!a.ammo?{success:!1,message:"该装备不需要弹药"}:(i.currentAmmo[n]=a.ammo,{success:!0,message:"弹药已补充"})}useAmmo(t,n){if(t<0||t>=this.tanks.length)return!1;const i=this.tanks[t];return!i.currentAmmo[n]||i.currentAmmo[n]<=0?!1:(i.currentAmmo[n]--,!0)}getCurrentAmmo(t,n){return t<0||t>=this.tanks.length?0:this.tanks[t].currentAmmo[n]||0}refuel(t,n){if(t<0||t>=this.tanks.length)return{success:!1,message:"坦克不存在"};const i=this.tanks[t],a=i.getMaxFuel();return i.currentFuel=Math.min(i.currentFuel+n,a),{success:!0,message:`燃料已补充，当前: ${i.currentFuel}/${a}`}}consumeFuel(t,n){if(t<0||t>=this.tanks.length)return!1;const i=this.tanks[t];return i.currentFuel<n?!1:(i.currentFuel-=n,!0)}getTankStatus(t){if(t<0||t>=this.tanks.length)return null;const n=this.tanks[t];return{name:n.name,totalAttack:n.getTotalAttack(),totalDefense:n.getTotalDefense(),totalWeight:n.getTotalWeight(),loadCapacity:n.getLoadCapacity(),isOverloaded:n.isOverloaded(),accuracyBonus:n.getAccuracyBonus(),evasionBonus:n.getEvasionBonus(),currentFuel:n.currentFuel,maxFuel:n.getMaxFuel(),equipment:{mainCannon:n.slots.mainCannon,subCannon:n.slots.subCannon,se:n.slots.se,cUnit:n.slots.cUnit,engine:n.slots.engine}}}getHumanStatus(t){if(t<0||t>=this.humans.length)return null;const n=this.humans[t];return{name:n.name,totalAttack:n.getTotalAttack(),totalDefense:n.getTotalDefense(),totalWeight:n.getTotalWeight(),equipment:{hat:n.slots.hat,armor:n.slots.armor,glove:n.slots.glove,shoes:n.slots.shoes,weapon:n.slots.weapon}}}getInventoryStatus(){return{gold:this.gold,inventory:this.inventory,tanks:this.tanks.map((t,n)=>this.getTankStatus(n)),humans:this.humans.map((t,n)=>this.getHumanStatus(n))}}addTank(t="新坦克",n=null){return this.tanks.push(new le(t,n)),this.tanks.length-1}removeTank(t){if(t<0||t>=this.tanks.length)return{success:!1,message:"坦克不存在"};if(this.tanks.length<=1)return{success:!1,message:"至少需要保留一辆坦克"};const n=this.tanks[t];for(const i in n.slots)n.slots[i]&&this.addToInventory(n.slots[i].id,1);return this.tanks.splice(t,1),{success:!0,message:"坦克已移除"}}addHuman(t="新角色",n=null){return this.humans.push(new re(t,n)),this.humans.length-1}removeHuman(t){if(t<0||t>=this.humans.length)return{success:!1,message:"角色不存在"};if(this.humans.length<=1)return{success:!1,message:"至少需要保留一个角色"};const n=this.humans[t];for(const i in n.slots)n.slots[i]&&this.addToInventory(n.slots[i].id,1);return this.humans.splice(t,1),{success:!0,message:"角色已移除"}}renameTank(t,n){return t<0||t>=this.tanks.length?{success:!1,message:"坦克不存在"}:(this.tanks[t].name=n,{success:!0,message:"坦克已重命名"})}renameHuman(t,n){return t<0||t>=this.humans.length?{success:!1,message:"角色不存在"}:(this.humans[t].name=n,{success:!0,message:"角色已重命名"})}}let w=null;const c={bgDark:"#1a1a2e",bgMedium:"#2a2a4e",bgLight:"#3a3a6e",textWhite:"#ffffff",textYellow:"#f8f864",textCyan:"#64f8f8",textGreen:"#64f864",textRed:"#f86464",textGray:"#888888",borderLight:"#6a6a9a",accent:"#c42c2c",accentLight:"#e84c4c"},Ut={[f.MAIN_CANNON]:"主炮",[f.SUB_CANNON]:"副炮",[f.SE]:"S-E",[f.C_UNIT]:"C装置",[f.ENGINE]:"引擎",[f.HAT]:"帽子",[f.ARMOR]:"衣服",[f.GLOVE]:"手套",[f.SHOES]:"鞋子",[f.WEAPON]:"武器"},k={MAIN_MENU:"mainMenu",TANK_SELECT:"tankSelect",TANK_EQUIP:"tankEquip",HUMAN_SELECT:"humanSelect",HUMAN_EQUIP:"humanEquip",BACKPACK:"backpack",SHOP:"shop",SHOP_LIST:"shopList"};class Bt{constructor(){this.container=null,this.currentUI=null,this.state=k.MAIN_MENU,this.selectedIndex=0,this.subIndex=0,this.thirdIndex=0,this.message="",this.messageTimer=null,this.shopCategory=null,this.visible=!1,this.keyDelay=0,this.keyDelayMax=150}setInventoryManager(t){w=t}getInventoryManager(){return w}createContainer(){this.container=document.createElement("div"),this.container.id="equipment-ui-container",this.container.style.cssText=`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${c.bgDark};
      z-index: 1000;
      font-family: 'Courier New', monospace;
      display: none;
      image-rendering: pixelated;
    `,document.body.appendChild(this.container),this.setupKeyboardListeners(),this.setupTouchListeners()}setupKeyboardListeners(){document.addEventListener("keydown",t=>{if(this.visible&&!(this.keyDelay>0)){switch(this.keyDelay=this.keyDelayMax,t.key){case"ArrowUp":case"w":case"W":this.navigateUp();break;case"ArrowDown":case"s":case"S":this.navigateDown();break;case"ArrowLeft":case"a":case"A":this.navigateLeft();break;case"ArrowRight":case"d":case"D":this.navigateRight();break;case"Enter":case" ":case"z":case"Z":this.confirm();break;case"Escape":case"x":case"X":this.cancel();break}t.preventDefault()}}),setInterval(()=>{this.keyDelay>0&&(this.keyDelay-=16)},16)}setupTouchListeners(){let t=0,n=0;this.container.addEventListener("touchstart",i=>{t=i.touches[0].clientY,n=i.touches[0].clientX}),this.container.addEventListener("touchend",i=>{if(!this.visible)return;const a=i.changedTouches[0].clientY,s=i.changedTouches[0].clientX,o=a-t,d=s-n;Math.abs(o)<30&&Math.abs(d)<30?this.confirm():Math.abs(o)>Math.abs(d)&&(o>30?this.navigateDown():o<-30&&this.navigateUp())})}show(){this.container||this.createContainer(),this.container.style.display="block",this.visible=!0,this.state=k.MAIN_MENU,this.selectedIndex=0,this.render()}hide(){this.container&&(this.container.style.display="none"),this.visible=!1}toggle(){this.visible?this.hide():this.show()}navigateUp(){const t=this.getMaxIndex();this.selectedIndex>0?this.selectedIndex--:this.selectedIndex=t-1,this.render()}navigateDown(){const t=this.getMaxIndex();this.selectedIndex<t-1?this.selectedIndex++:this.selectedIndex=0,this.render()}navigateLeft(){(this.state===k.BACKPACK||this.state===k.SHOP)&&this.subIndex>0&&(this.subIndex--,this.thirdIndex=0,this.render())}navigateRight(){if(this.state===k.BACKPACK||this.state===k.SHOP){const t=this.getMaxSubIndex();this.subIndex<t-1&&(this.subIndex++,this.thirdIndex=0,this.render())}}confirm(){switch(this.state){case k.MAIN_MENU:this.handleMainMenuConfirm();break;case k.TANK_SELECT:this.handleTankSelectConfirm();break;case k.TANK_EQUIP:this.handleTankEquipConfirm();break;case k.HUMAN_SELECT:this.handleHumanSelectConfirm();break;case k.HUMAN_EQUIP:this.handleHumanEquipConfirm();break;case k.BACKPACK:this.handleBackpackConfirm();break;case k.SHOP:this.handleShopConfirm();break;case k.SHOP_LIST:this.handleShopListConfirm();break}}cancel(){switch(this.state){case k.MAIN_MENU:this.hide();break;case k.TANK_SELECT:case k.HUMAN_SELECT:case k.BACKPACK:case k.SHOP:this.state=k.MAIN_MENU,this.selectedIndex=0;break;case k.TANK_EQUIP:this.state=k.TANK_SELECT,this.selectedIndex=0;break;case k.HUMAN_EQUIP:this.state=k.HUMAN_SELECT,this.selectedIndex=0;break;case k.SHOP_LIST:this.state=k.SHOP,this.selectedIndex=this.subIndex;break}this.render()}getMaxIndex(){switch(this.state){case k.MAIN_MENU:return 5;case k.TANK_SELECT:return w.tanks.length+1;case k.TANK_EQUIP:return 7;case k.HUMAN_SELECT:return w.humans.length+1;case k.HUMAN_EQUIP:return 6;case k.BACKPACK:return this.getBackpackItems().length+1;case k.SHOP:return 11;case k.SHOP_LIST:return this.getShopItems().length+1;default:return 1}}getMaxSubIndex(){return this.state===k.BACKPACK?3:this.state===k.SHOP?10:1}handleMainMenuConfirm(){switch(this.selectedIndex){case 0:this.state=k.TANK_SELECT,this.selectedIndex=0;break;case 1:this.state=k.HUMAN_SELECT,this.selectedIndex=0;break;case 2:this.state=k.BACKPACK,this.selectedIndex=0,this.subIndex=0,this.thirdIndex=0;break;case 3:this.state=k.SHOP,this.selectedIndex=0,this.subIndex=0;break;case 4:this.hide();break}this.render()}handleTankSelectConfirm(){this.selectedIndex===w.tanks.length?(this.state=k.MAIN_MENU,this.selectedIndex=0):(this.state=k.TANK_EQUIP,this.selectedIndex=0),this.render()}handleTankEquipConfirm(){const t=this.getPreviousSelection();if(this.selectedIndex===6){this.state=k.TANK_SELECT,this.selectedIndex=t,this.render();return}if(this.selectedIndex===5){this.showMessage("装甲片购买功能开发中...");return}const i=["mainCannon","subCannon","se","cUnit","engine"][this.selectedIndex];if(w.tanks[t].slots[i]){const s=w.uninstallTankEquipment(t,i);this.showMessage(s.message)}else{const s=this.getSlotEquipmentType(i),o=this.getBackpackItemsByType(s);if(o.length===0){this.showMessage("背包中没有可用的装备！");return}const d=w.installTankEquipment(t,o[0].id);this.showMessage(d.message)}this.render()}handleHumanSelectConfirm(){this.selectedIndex===w.humans.length?(this.state=k.MAIN_MENU,this.selectedIndex=0):(this.state=k.HUMAN_EQUIP,this.selectedIndex=0),this.render()}handleHumanEquipConfirm(){const t=this.getPreviousSelection();if(this.selectedIndex===5){this.state=k.HUMAN_SELECT,this.selectedIndex=t,this.render();return}const i=["hat","armor","glove","shoes","weapon"][this.selectedIndex];if(w.humans[t].slots[i]){const s=w.uninstallHumanEquipment(t,i);this.showMessage(s.message)}else{const s=this.getHumanSlotEquipmentType(i),o=this.getBackpackItemsByType(s);if(o.length===0){this.showMessage("背包中没有可用的装备！");return}const d=w.installHumanEquipment(t,o[0].id);this.showMessage(d.message)}this.render()}handleBackpackConfirm(){const t=this.getBackpackItems();if(this.selectedIndex===t.length){this.state=k.MAIN_MENU,this.selectedIndex=0,this.render();return}const n=t[this.selectedIndex];n&&this.showMessage(`已选择: ${n.name}`)}handleShopConfirm(){const t=[f.MAIN_CANNON,f.SUB_CANNON,f.SE,f.C_UNIT,f.ENGINE,f.HAT,f.ARMOR,f.GLOVE,f.SHOES,f.WEAPON];this.selectedIndex===10?(this.state=k.MAIN_MENU,this.selectedIndex=0):(this.shopCategory=t[this.selectedIndex],this.state=k.SHOP_LIST,this.selectedIndex=0),this.render()}handleShopListConfirm(){const t=this.getShopItems();if(this.selectedIndex===t.length){this.state=k.SHOP,this.selectedIndex=0,this.render();return}const n=t[this.selectedIndex];if(n&&w.canAfford(n.price)){const i=w.buyEquipment(n.id,1);this.showMessage(i.message)}else n&&this.showMessage("金币不足！");this.render()}getPreviousSelection(){return 0}getSlotEquipmentType(t){return{mainCannon:f.MAIN_CANNON,subCannon:f.SUB_CANNON,se:f.SE,cUnit:f.C_UNIT,engine:f.ENGINE}[t]}getHumanSlotEquipmentType(t){return{hat:f.HAT,armor:f.ARMOR,glove:f.GLOVE,shoes:f.SHOES,weapon:f.WEAPON}[t]}getBackpackItems(){const t=[[f.MAIN_CANNON,f.SUB_CANNON,f.SE,f.C_UNIT,f.ENGINE],[f.HAT,f.ARMOR,f.GLOVE,f.SHOES,f.WEAPON],[]],n=this.subIndex,i=[];if(n<2){const a=t[n];for(const s of a){const o=w.getInventoryListByType(s);i.push(...o)}}return i}getBackpackItemsByType(t){return w.getInventoryListByType(t)}getShopItems(){return this.shopCategory?$t(this.shopCategory):[]}showMessage(t){this.message=t,this.messageTimer&&clearTimeout(this.messageTimer),this.messageTimer=setTimeout(()=>{this.message="",this.render()},2e3),this.render()}render(){if(!this.container)return;let t="";switch(this.state){case k.MAIN_MENU:t=this.renderMainMenu();break;case k.TANK_SELECT:t=this.renderTankSelect();break;case k.TANK_EQUIP:t=this.renderTankEquip();break;case k.HUMAN_SELECT:t=this.renderHumanSelect();break;case k.HUMAN_EQUIP:t=this.renderHumanEquip();break;case k.BACKPACK:t=this.renderBackpack();break;case k.SHOP:t=this.renderShop();break;case k.SHOP_LIST:t=this.renderShopList();break}this.container.innerHTML=t}renderMainMenu(){const t=w.getGold();return`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader("装备管理")}
        
        <!-- 金币显示 -->
        <div style="
          background: ${c.bgMedium};
          border: 3px solid ${c.borderLight};
          padding: 15px 20px;
          margin: 15px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${c.textYellow}; font-size: 18px;">💰 金币</span>
          <span style="color: ${c.textYellow}; font-size: 24px; font-weight: bold;">${t.toLocaleString()} G</span>
        </div>
        
        <!-- 菜单选项 -->
        <div style="
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 10px 0;
        ">
          ${this.renderMenuItem("🛡️ 坦克装备",0,"管理坦克的武器和装备")}
          ${this.renderMenuItem("👤 人类装备",1,"管理角色的防具和武器")}
          ${this.renderMenuItem("🎒 背包",2,"查看拥有的装备和道具")}
          ${this.renderMenuItem("🏪 商店",3,"购买新的装备")}
          ${this.renderMenuItem("❌ 关闭",4,"返回游戏")}
        </div>
        
        ${this.renderWindowFooter("↑↓选择  Enter确认  Esc取消")}
        ${this.renderMessage()}
      </div>
    `}renderTankSelect(){const t=w.tanks;let n="";return t.forEach((i,a)=>{const s=w.getTankStatus(a),o=s.isOverloaded,d=this.selectedIndex===a;n+=`
        <div style="
          background: ${d?c.bgLight:c.bgMedium};
          border: 3px solid ${d?c.textCyan:c.borderLight};
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${c.textWhite}; font-size: 16px; font-weight: bold;">
              ${d?"▶ ":""}${i.name}
            </div>
            <div style="color: ${c.textGray}; font-size: 12px; margin-top: 5px;">
              攻击: ${s.totalAttack} | 防御: ${s.totalDefense}
            </div>
          </div>
          <div style="text-align: right;">
            <div style="color: ${o?c.textRed:c.textGreen}; font-size: 14px;">
              ${o?"⚠ 超载":"✓ 正常"}
            </div>
            <div style="color: ${c.textGray}; font-size: 12px;">
              ${s.totalWeight.toFixed(1)}t / ${s.loadCapacity.toFixed(1)}t
            </div>
          </div>
        </div>
      `}),n+=this.renderBackOption(t.length),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader("坦克装备 - 选择坦克")}
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 10px 0;">
          ${n}
        </div>
        ${this.renderWindowFooter("↑↓选择  Enter确认  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderTankEquip(){const n=w.getTankStatus(0),i=w.tanks[0],a=[{name:"主炮",slot:"mainCannon",icon:"🔫"},{name:"副炮",slot:"subCannon",icon:"🎯"},{name:"S-E",slot:"se",icon:"🚀"},{name:"C装置",slot:"cUnit",icon:"📡"},{name:"引擎",slot:"engine",icon:"⚙️"}];let s="";return a.forEach((o,d)=>{const S=n.equipment[o.slot],u=this.selectedIndex===d;s+=`
        <div style="
          background: ${u?c.bgLight:c.bgMedium};
          border: 3px solid ${u?c.textCyan:c.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${o.icon}</span>
            <span style="color: ${c.textWhite};">${o.name}</span>
          </div>
          <div style="text-align: right;">
            ${S?`
              <div style="color: ${c.textYellow};">${S.name}</div>
              <div style="color: ${c.textGray}; font-size: 12px;">
                ${S.attack?`攻:${S.attack} `:""}${S.defense?`防:${S.defense} `:""}重:${S.weight}t
              </div>
            `:`
              <div style="color: ${c.textGray};">------</div>
            `}
          </div>
        </div>
      `}),s+=this.renderMenuItem("🛡️ 装甲片",5,"购买装甲片增强防御"),s+=this.renderBackOption(6),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`${i.name} 装备管理`)}
        
        <!-- 状态面板 -->
        <div style="
          background: ${c.bgMedium};
          border: 3px solid ${c.borderLight};
          padding: 15px;
          margin-bottom: 15px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        ">
          <div style="text-align: center;">
            <div style="color: ${c.textGray}; font-size: 12px;">总攻击</div>
            <div style="color: ${c.textRed}; font-size: 20px; font-weight: bold;">${n.totalAttack}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${c.textGray}; font-size: 12px;">总防御</div>
            <div style="color: ${c.textCyan}; font-size: 20px; font-weight: bold;">${n.totalDefense}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${c.textGray}; font-size: 12px;">重量</div>
            <div style="color: ${n.isOverloaded?c.textRed:c.textGreen}; font-size: 20px; font-weight: bold;">
              ${n.totalWeight.toFixed(1)}t/${n.loadCapacity.toFixed(1)}t
            </div>
          </div>
        </div>
        
        <!-- 装备槽 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${s}
        </div>
        
        ${this.renderWindowFooter("↑↓选择  Enter装备/卸下  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderHumanSelect(){const t=w.humans;let n="";return t.forEach((i,a)=>{const s=w.getHumanStatus(a),o=this.selectedIndex===a;n+=`
        <div style="
          background: ${o?c.bgLight:c.bgMedium};
          border: 3px solid ${o?c.textCyan:c.borderLight};
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${c.textWhite}; font-size: 16px; font-weight: bold;">
              ${o?"▶ ":""}${i.name}
            </div>
            <div style="color: ${c.textGray}; font-size: 12px; margin-top: 5px;">
              攻击: ${s.totalAttack} | 防御: ${s.totalDefense}
            </div>
          </div>
          <div style="color: ${c.textCyan}; font-size: 14px;">
            👤 角色
          </div>
        </div>
      `}),n+=this.renderBackOption(t.length),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader("人类装备 - 选择角色")}
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 10px 0;">
          ${n}
        </div>
        ${this.renderWindowFooter("↑↓选择  Enter确认  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderHumanEquip(){const n=w.getHumanStatus(0),i=w.humans[0],a=[{name:"帽子",slot:"hat",icon:"🎩"},{name:"衣服",slot:"armor",icon:"👕"},{name:"手套",slot:"glove",icon:"🧤"},{name:"鞋子",slot:"shoes",icon:"👟"},{name:"武器",slot:"weapon",icon:"⚔️"}];let s="";return a.forEach((o,d)=>{const S=n.equipment[o.slot],u=this.selectedIndex===d;s+=`
        <div style="
          background: ${u?c.bgLight:c.bgMedium};
          border: 3px solid ${u?c.textCyan:c.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        ">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">${o.icon}</span>
            <span style="color: ${c.textWhite};">${o.name}</span>
          </div>
          <div style="text-align: right;">
            ${S?`
              <div style="color: ${c.textYellow};">${S.name}</div>
              <div style="color: ${c.textGray}; font-size: 12px;">
                ${S.attack?`攻:${S.attack} `:""}${S.defense?`防:${S.defense} `:""}
              </div>
            `:`
              <div style="color: ${c.textGray};">------</div>
            `}
          </div>
        </div>
      `}),s+=this.renderBackOption(5),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`${i.name} 装备管理`)}
        
        <!-- 状态面板 -->
        <div style="
          background: ${c.bgMedium};
          border: 3px solid ${c.borderLight};
          padding: 15px;
          margin-bottom: 15px;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        ">
          <div style="text-align: center;">
            <div style="color: ${c.textGray}; font-size: 12px;">总攻击</div>
            <div style="color: ${c.textRed}; font-size: 20px; font-weight: bold;">${n.totalAttack}</div>
          </div>
          <div style="text-align: center;">
            <div style="color: ${c.textGray}; font-size: 12px;">总防御</div>
            <div style="color: ${c.textCyan}; font-size: 20px; font-weight: bold;">${n.totalDefense}</div>
          </div>
        </div>
        
        <!-- 装备槽 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${s}
        </div>
        
        ${this.renderWindowFooter("↑↓选择  Enter装备/卸下  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderBackpack(){const t=["坦克装备","人类装备","道具"];let n="";t.forEach((s,o)=>{const d=this.subIndex===o;n+=`
        <div style="
          background: ${d?c.bgLight:c.bgMedium};
          border: 2px solid ${d?c.textCyan:c.borderLight};
          padding: 10px 20px;
          cursor: pointer;
          color: ${d?c.textCyan:c.textGray};
          font-weight: ${d?"bold":"normal"};
        ">${s}</div>
      `});const i=this.getBackpackItems();let a="";return i.forEach((s,o)=>{const d=this.selectedIndex===o;a+=`
        <div style="
          background: ${d?c.bgLight:c.bgMedium};
          border: 2px solid ${d?c.textCyan:c.borderLight};
          padding: 10px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${c.textYellow};">${d?"▶ ":""}${s.name} x${s.quantity}</div>
            <div style="color: ${c.textGray}; font-size: 11px;">
              ${s.attack?`攻:${s.attack} `:""}${s.defense?`防:${s.defense} `:""}${s.weight?`重:${s.weight}t `:""}
            </div>
          </div>
          <div style="color: ${c.textGreen}; font-size: 14px;">
            ${s.price}G
          </div>
        </div>
      `}),i.length===0&&(a=`
        <div style="
          text-align: center;
          padding: 40px;
          color: ${c.textGray};
        ">暂无装备</div>
      `),a+=this.renderBackOption(i.length),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader("背包")}
        
        <!-- 分类标签 -->
        <div style="display: flex; gap: 5px; margin-bottom: 15px;">
          ${n}
        </div>
        
        <!-- 物品列表 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;">
          ${a}
        </div>
        
        ${this.renderWindowFooter("←→切换分类  ↑↓选择  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderShop(){const t=w.getGold(),n=[{name:"主炮",type:f.MAIN_CANNON,icon:"🔫"},{name:"副炮",type:f.SUB_CANNON,icon:"🎯"},{name:"S-E",type:f.SE,icon:"🚀"},{name:"C装置",type:f.C_UNIT,icon:"📡"},{name:"引擎",type:f.ENGINE,icon:"⚙️"},{name:"帽子",type:f.HAT,icon:"🎩"},{name:"衣服",type:f.ARMOR,icon:"👕"},{name:"手套",type:f.GLOVE,icon:"🧤"},{name:"鞋子",type:f.SHOES,icon:"👟"},{name:"武器",type:f.WEAPON,icon:"⚔️"}];let i="";return n.forEach((a,s)=>{const o=this.selectedIndex===s;i+=`
        <div style="
          background: ${o?c.bgLight:c.bgMedium};
          border: 3px solid ${o?c.textCyan:c.borderLight};
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        ">
          <span style="font-size: 24px;">${a.icon}</span>
          <span style="color: ${c.textWhite}; font-size: 16px;">
            ${o?"▶ ":""}${a.name}
          </span>
        </div>
      `}),i+=this.renderBackOption(10),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader("商店")}
        
        <!-- 金币显示 -->
        <div style="
          background: ${c.bgMedium};
          border: 3px solid ${c.borderLight};
          padding: 10px 20px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${c.textYellow}; font-size: 16px;">💰 持有金币</span>
          <span style="color: ${c.textYellow}; font-size: 20px; font-weight: bold;">${t.toLocaleString()} G</span>
        </div>
        
        <!-- 商品分类 -->
        <div style="flex: 1; overflow-y: auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
          ${i}
        </div>
        
        ${this.renderWindowFooter("↑↓选择  Enter进入  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderShopList(){const t=w.getGold(),n=this.getShopItems(),i=Ut[this.shopCategory]||"装备";let a="";return n.forEach((s,o)=>{const d=this.selectedIndex===o,S=t>=s.price;a+=`
        <div style="
          background: ${d?c.bgLight:c.bgMedium};
          border: 2px solid ${d?c.textCyan:c.borderLight};
          padding: 12px 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <div>
            <div style="color: ${c.textYellow};">${d?"▶ ":""}${s.name}</div>
            <div style="color: ${c.textGray}; font-size: 11px;">
              ${s.attack!==void 0&&s.attack>0?`攻:${s.attack} `:""}
              ${s.defense!==void 0&&s.defense>0?`防:${s.defense} `:""}
              ${s.weight?`重:${s.weight}t `:""}
              ${s.loadCapacity?`载重:${s.loadCapacity}t `:""}
              ${s.ammo?`弹药:${s.ammo} `:""}
            </div>
          </div>
          <div style="color: ${S?c.textGreen:c.textRed}; font-size: 16px; font-weight: bold;">
            ${s.price}G
          </div>
        </div>
      `}),a+=this.renderBackOption(n.length),`
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
      ">
        ${this.renderWindowHeader(`商店 - ${i}`)}
        
        <!-- 金币显示 -->
        <div style="
          background: ${c.bgMedium};
          border: 3px solid ${c.borderLight};
          padding: 10px 20px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
          <span style="color: ${c.textYellow}; font-size: 16px;">💰 持有金币</span>
          <span style="color: ${c.textYellow}; font-size: 20px; font-weight: bold;">${t.toLocaleString()} G</span>
        </div>
        
        <!-- 商品列表 -->
        <div style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 5px;">
          ${a}
        </div>
        
        ${this.renderWindowFooter("↑↓选择  Enter购买  Esc返回")}
        ${this.renderMessage()}
      </div>
    `}renderWindowHeader(t){return`
      <div style="
        background: linear-gradient(180deg, ${c.accent}, ${c.bgDark});
        border: 3px solid ${c.accentLight};
        border-radius: 8px 8px 0 0;
        padding: 15px 20px;
        text-align: center;
        margin-bottom: 10px;
      ">
        <h2 style="
          color: ${c.textYellow};
          font-size: 24px;
          margin: 0;
          text-shadow: 2px 2px 0 #000;
          letter-spacing: 4px;
        ">${t}</h2>
      </div>
    `}renderWindowFooter(t){return`
      <div style="
        background: ${c.bgMedium};
        border: 2px solid ${c.borderLight};
        padding: 10px 20px;
        text-align: center;
        margin-top: 10px;
      ">
        <span style="color: ${c.textGray}; font-size: 12px;">${t}</span>
      </div>
    `}renderMenuItem(t,n,i){const a=this.selectedIndex===n;return`
      <div style="
        background: ${a?c.bgLight:c.bgMedium};
        border: 3px solid ${a?c.textCyan:c.borderLight};
        padding: 15px 20px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <span style="color: ${a?c.textCyan:c.textWhite}; font-size: 18px;">
          ${a?"▶ ":""}${t}
        </span>
        <span style="color: ${c.textGray}; font-size: 12px;">${i}</span>
      </div>
    `}renderBackOption(t){const n=this.selectedIndex===t;return`
      <div style="
        background: ${n?c.bgLight:c.bgMedium};
        border: 3px solid ${n?c.textCyan:c.borderLight};
        padding: 15px;
        cursor: pointer;
        text-align: center;
        margin-top: 10px;
      ">
        <span style="color: ${n?c.textCyan:c.textGray}; font-size: 16px;">
          ${n?"▶ ":""}返回
        </span>
      </div>
    `}renderMessage(){return this.message?`
      <div style="
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: ${c.accent};
        border: 3px solid ${c.accentLight};
        padding: 15px 30px;
        border-radius: 8px;
        z-index: 100;
        animation: fadeIn 0.3s ease;
      ">
        <span style="color: ${c.textWhite}; font-size: 16px; font-weight: bold;">
          ${this.message}
        </span>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      </style>
    `:""}}const ee=new Bt;function zt(e){ee.setInventoryManager(e)}function Wt(){const e=document.createElement("button");e.id="equipment-ui-btn",e.textContent="装备",e.style.cssText=`
    position: fixed;
    bottom: 30px;
    left: 30px;
    background: linear-gradient(180deg, #2a6a9a, #1a4a6a);
    color: #fff;
    border: 3px solid #4a9aff;
    padding: 14px 30px;
    font-size: 18px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    pointer-events: auto;
    transition: all 0.2s;
    text-shadow: 1px 1px 2px #000;
    box-shadow: 0 4px 0 #0a2a4a, 0 0 20px rgba(74, 154, 255, 0.4);
    z-index: 100;
  `,e.addEventListener("mouseenter",()=>{e.style.transform="translateY(-2px)",e.style.boxShadow="0 6px 0 #0a2a4a, 0 0 25px rgba(74, 154, 255, 0.6)"}),e.addEventListener("mouseleave",()=>{e.style.transform="translateY(0)",e.style.boxShadow="0 4px 0 #0a2a4a, 0 0 20px rgba(74, 154, 255, 0.4)"}),e.addEventListener("click",()=>{ee.toggle()}),document.getElementById("ui-layer").appendChild(e)}const Yt=6,qt=6,Dt=600,Ft=document.getElementById("game-container"),{canvas:x,ctx:A}=_e(Ft),I=tt(A);qe(qt,x.width,x.height,C.buildings);const V=new Ht;V.addTank("红狼战车","red_wolf");V.addHuman("主角");V.gold=1e3;zt(V);const O={x:.5,y:.5};let de=0;function te(e){e.touches?(O.x=e.touches[0].clientX/window.innerWidth,O.y=e.touches[0].clientY/window.innerHeight):(O.x=e.clientX/window.innerWidth,O.y=e.clientY/window.innerHeight)}function Xt(e){te(e)}function Ce(e){var o,d,S,u;const t=Date.now();if(t-de<300)return;de=t;const n=e.clientX||((d=(o=e.touches)==null?void 0:o[0])==null?void 0:d.clientX),i=e.clientY||((u=(S=e.touches)==null?void 0:S[0])==null?void 0:u.clientY);if(C.isInterior){if(Lt(n,i,x.width,x.height)){const y=Tt(n,i,x.width,x.height);I.x=y.x,I.y=y.y,I.tankX=y.x,I.tankY=y.y}return}const a=Pt(n,i,x.width,x.height);if(a&&a.enterable){_t(a.interior);return}const s=et();for(let y=0;y<s.length;y++){const m=s[y];if(Math.sqrt((n-m.x)**2+(i-m.y)**2)<50){bt(m.type,`npc_${y}`);break}}}x.addEventListener("click",Ce);x.addEventListener("touchstart",Ce,{passive:!0});document.addEventListener("mousemove",te);document.addEventListener("touchstart",Xt,{passive:!0});document.addEventListener("touchmove",te,{passive:!0});document.addEventListener("keydown",e=>{(e.key==="e"||e.key==="E")&&ee.toggle()});const Kt=document.getElementById("toggle-vehicle-btn");Kt.addEventListener("click",()=>{st(I),ge(I)});for(let e=0;e<Yt;e++)he(x.width,x.height,[]);function jt(){if(C.isInterior)return;const e=at(I),t=j();for(const n of t){if(n.collected)continue;const i=dt(n);ht(e,i)&&(ct(n),St(),gt(parseInt(document.getElementById("score-value").textContent)+1),setTimeout(()=>{const a=j().map(s=>({x:s.x,y:s.y}));he(x.width,x.height,a)},Dt))}}function Ee(e){requestAnimationFrame(Ee),Ve(A,C,x.width,x.height,e),C.isInterior||(De(x.width,x.height,e,C.buildings),Fe(A),I.isInTank||ae(A,I.tankX,I.tankY,!1,I.direction||0)),it(I,O.x,O.y,x.width,x.height),lt(j(),e,x.height),jt(),rt(A,j(),e),I.isInTank&&ae(A,I.x,I.y,!0,I.direction||0),nt(A,I),ge(I),Et(),Mt()}xt();Wt();Nt().then(()=>{setTimeout(()=>{yt()},500),setTimeout(()=>{ut()},5e3),Ee(0)});
