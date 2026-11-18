// ====== KONFIGURASI ======
const WEDDING = new Date('2027-02-07T08:00:00+07:00'); // ganti bila tanggal berubah
const WA_NUMBER = '628xxxxxxxxxx'; // nomor WhatsApp penerima RSVP
const QUIZ = [
  {q:'Di mana Fadil & Anisa pertama kali bertemu?',o:['Kampus','Kantor','Acara keluarga','Online'],a:0},
  {q:'Makanan favorit Anisa?',o:['Bakso','Seblak','Sushi','Nasi Padang'],a:1},
  {q:'Warna tema pernikahan ini?',o:['Biru','Lavender','Hijau','Merah'],a:1},
];
// =========================
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('s');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('s'),2600)};
const to=new URLSearchParams(location.search).get('to');
fetch('/api/guest?to='+encodeURIComponent(to||'')).then(r=>r.ok?r.json():Promise.reject()).then(d=>$('#guestName').textContent=d.name).catch(()=>location.replace('/404'));

const fmt=WEDDING.toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
$('#coverDate').textContent=WEDDING.toLocaleDateString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric'}).replace(/\//g,' . ');
$('#dLong1').textContent=$('#dLong2').textContent=fmt;$('#scratchDate').textContent=fmt;
const ds=WEDDING.toISOString().replace(/[-:]|\.\d+/g,'');
$('#calBtn').href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Pernikahan+Fadil+%26+Anisa&dates=${ds}/${ds}&location=Gd.+Graha+Sativa`;

// buka undangan + musik
const bgm=$('#bgm');
$('#openBtn').onclick=()=>{$('#cover').classList.add('open');document.body.classList.remove('locked');bgm.play().then(()=>$('#musicBtn').classList.add('on')).catch(()=>{});petals();setTimeout(petalRain,4500);toast('Kumpulkan 7 💜 tersembunyi di undangan ini!')};
$('#musicBtn').onclick=()=>{if(bgm.paused){bgm.play();$('#musicBtn').classList.add('on')}else{bgm.pause();$('#musicBtn').classList.remove('on')}};
function petals(){for(let i=0;i<25;i++)setTimeout(()=>{const p=document.createElement('span');p.className='petal';p.textContent=['❀','✿','💜'][i%3];p.style.left=Math.random()*100+'vw';p.style.fontSize=12+Math.random()*16+'px';p.style.animationDuration=4+Math.random()*4+'s';document.body.append(p);setTimeout(()=>p.remove(),9000)},i*180)}

// reveal saat scroll
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.15});$$('.sec').forEach(s=>io.observe(s));

// countdown
function tick(){let d=Math.max(0,WEDDING-new Date());const u=[['Hari',864e5],['Jam',36e5],['Menit',6e4],['Detik',1e3]];
$('#countdown').innerHTML=d?u.map(([n,ms])=>{const v=Math.floor(d/ms);d%=ms;return `<div><b>${v}</b>${n}</div>`}).join(''):'<p>Alhamdulillah, hari bahagia telah tiba 💜</p>'}
tick();setInterval(tick,1000);

// GAME 1: berburu hati
const KEY='hearts_'+to;let got=JSON.parse(localStorage.getItem(KEY)||'[]');
const BADGES=[[3,'🥉 Tamu Perhatian'],[5,'🥈 Sahabat Setia'],[7,'🏆 Tamu Teladan!']];
function hud(){$('#heartCount').textContent=got.length;const b=BADGES.filter(x=>got.length>=x[0]).pop();$('#badge').textContent=b?b[1]:''}
$$('.heart').forEach(h=>{if(got.includes(h.dataset.h))h.remove();else h.onclick=()=>{got.push(h.dataset.h);localStorage.setItem(KEY,JSON.stringify(got));h.classList.add('got');hud();
const b=BADGES.find(x=>x[0]===got.length);toast(b?`Lencana baru: ${b[1]}`:`💜 ${got.length}/7 hati terkumpul`);if(got.length===7)petals()}});hud();

// GAME 2: scratch card
(()=>{const c=$('#scratchCv'),x=c.getContext('2d');c.width=280;c.height=110;
const g=x.createLinearGradient(0,0,280,110);g.addColorStop(0,'#BA9AD4');g.addColorStop(1,'#C8B3C8');x.fillStyle=g;x.fillRect(0,0,280,110);
x.fillStyle='#fff';x.font='16px Poppins';x.textAlign='center';x.fillText('✨ Gosok di sini ✨',140,60);
let down=false,done=false;const sc=e=>{if(!down)return;const r=c.getBoundingClientRect(),t=e.touches?e.touches[0]:e;x.globalCompositeOperation='destination-out';x.beginPath();x.arc(t.clientX-r.left,t.clientY-r.top,18,0,7);x.fill();
if(!done){const d=x.getImageData(0,0,280,110).data;let n=0;for(let i=3;i<d.length;i+=16)if(!d[i])n++;if(n/(d.length/16)>.5){done=true;c.style.transition='.6s';c.style.opacity=0;toast('🎉 Catat tanggalnya ya!')}}};
['mousedown','touchstart'].forEach(v=>c.addEventListener(v,e=>{down=true;sc(e)}));['mouseup','touchend','mouseleave'].forEach(v=>c.addEventListener(v,()=>down=false));
['mousemove','touchmove'].forEach(v=>c.addEventListener(v,e=>{e.preventDefault();sc(e)},{passive:false}))})();

// GAME 3: memory
function memory(){const ic=['💍','🕌','💐','🤵','👰','🌙','📿','💜'];const deck=[...ic,...ic].sort(()=>Math.random()-.5);let open=[],moves=0,matched=0,lock=false;
$('#memInfo').textContent='Langkah: 0';$('#memory').innerHTML=deck.map(i=>`<div class="mc" data-i="${i}"><div><span class="bk">F&A</span><span class="fr">${i}</span></div></div>`).join('');
$$('.mc').forEach(c=>c.onclick=()=>{if(lock||c.classList.contains('f')||c.classList.contains('m'))return;c.classList.add('f');open.push(c);
if(open.length===2){moves++;$('#memInfo').textContent='Langkah: '+moves;const[a,b]=open;
if(a.dataset.i===b.dataset.i){a.classList.add('m');b.classList.add('m');open=[];if(++matched===8){$('#memInfo').textContent=`Selesai dalam ${moves} langkah! ${moves<=12?'🏆 Luar biasa!':'👏 Hebat!'}`;petals()}}
else{lock=true;setTimeout(()=>{a.classList.remove('f');b.classList.remove('f');open=[];lock=false},800)}}})}
memory();$('#memReset').onclick=memory;

// GAME 4: kuis
let qi=0,score=0;function quiz(){if(qi>=QUIZ.length){$('#quiz').innerHTML=`<h3>Skor kamu: ${score}/${QUIZ.length}</h3><p>${score===QUIZ.length?'MasyaAllah, kamu kenal kami banget! 💜':'Yuk kenal lebih dekat di hari bahagia kami 😄'}</p><button class="btn" onclick="qi=0;score=0;quiz()">Ulangi</button>`;return}
const q=QUIZ[qi];$('#quiz').innerHTML=`<p>Pertanyaan ${qi+1}/${QUIZ.length}</p><h3>${q.q}</h3>`+q.o.map((o,i)=>`<button class="qopt" data-i="${i}">${o}</button>`).join('');
$$('.qopt').forEach(b=>b.onclick=()=>{$$('.qopt').forEach(x=>x.disabled=true);const ok=+b.dataset.i===q.a;if(ok)score++;b.classList.add(ok?'ok':'no');$$('.qopt')[q.a].classList.add('ok');setTimeout(()=>{qi++;quiz()},1000)})}
quiz();

// RSVP via WhatsApp
$('#rsvp').onsubmit=e=>{e.preventDefault();const t=`Assalamu'alaikum, saya ${$('#guestName').textContent}.\nKehadiran: ${$('#rsvpAtt').value} (${$('#rsvpN').value} orang)\nUcapan: ${$('#rsvpMsg').value}`;open(`https://wa.me/${WA_NUMBER}?text=`+encodeURIComponent(t),'_blank')};
$$('.copy').forEach(b=>b.onclick=()=>navigator.clipboard.writeText(b.dataset.c).then(()=>toast('Nomor disalin ✔')));

// Merpati terbang: lintasan kurva halus (diagonal, menukik, melayang, mendekat) + efek 3D kedalaman
(function doves(){
  const box=document.getElementById('doves');if(!box||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
  const R=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
  // titik pada kurva Bezier kubik
  const bz=(p,t)=>{const u=1-t;return[0,1].map(k=>u*u*u*p[0][k]+3*u*u*t*p[1][k]+3*u*t*t*p[2][k]+t*t*t*p[3][k])};
  function route(W,H,s){
    const L=-s-30,Rt=W+30,T=-s-30,B=H+30,type=pick(['diagonal','diagonal','swoop','glide','approach','rise']);
    const ltr=Math.random()<.5,x0=ltr?L:Rt,x1=ltr?Rt:L;
    let a,b,c1,c2,sc=[1,1];
    if(type==='diagonal'){ // dari pojok atas ke sisi bawah berseberangan (atau sebaliknya)
      const down=Math.random()<.5;a=[x0,down?R(-.1,.3)*H:R(.7,1.1)*H];b=[x1,down?R(.7,1.1)*H:R(-.1,.3)*H];
      c1=[a[0]+(b[0]-a[0])*.33+R(-80,80),a[1]+(b[1]-a[1])*.2];c2=[a[0]+(b[0]-a[0])*.66+R(-80,80),a[1]+(b[1]-a[1])*.8];
    }else if(type==='swoop'){ // menukik lalu naik lagi
      a=[x0,R(.1,.35)*H];b=[x1,R(.1,.35)*H];c1=[a[0]+(b[0]-a[0])*.3,R(.75,1)*H];c2=[a[0]+(b[0]-a[0])*.7,R(.75,1)*H];
    }else if(type==='rise'){ // dari bawah naik melengkung ke atas
      a=[R(.1,.9)*W,B];b=[x1,R(-.1,.3)*H];c1=[a[0],R(.4,.7)*H];c2=[(a[0]+b[0])/2,R(.1,.4)*H];
    }else if(type==='approach'){ // terbang menjauh dari layar ke arah penonton (membesar)
      a=[x0,R(.2,.6)*H];b=[x1,R(.3,.8)*H];c1=[a[0]+(b[0]-a[0])*.35,a[1]-R(40,120)];c2=[a[0]+(b[0]-a[0])*.7,b[1]+R(40,120)];sc=[.55,1.35];
    }else{ // melayang bergelombang landai
      const y=R(.15,.85)*H;a=[x0,y];b=[x1,y+R(-.15,.15)*H];c1=[a[0]+(b[0]-a[0])*.33,y-R(60,140)];c2=[a[0]+(b[0]-a[0])*.66,y+R(60,140)];
    }
    return{p:[a,c1,c2,b],sc};
  }
  function fly(el){
    const W=innerWidth,H=innerHeight,z=+el.dataset.z,s=parseFloat(el.style.width);
    const {p,sc}=route(W,H,s),N=48,pts=[];
    for(let i=0;i<=N;i++)pts.push(bz(p,i/N));
    let len=0;for(let i=1;i<=N;i++)len+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);
    const dir=p[3][0]>=p[0][0]?1:-1,phase=R(0,6.28),bankAmp=R(12,28);
    let prev=0;
    const frames=pts.map((q,i)=>{
      const a=pts[Math.max(i-2,0)],b=pts[Math.min(i+2,N)],t=i/N;
      let ang=Math.atan2(b[1]-a[1],(b[0]-a[0])*dir)*180/Math.PI;ang=Math.max(-50,Math.min(50,ang));
      ang=prev+(ang-prev)*.6;prev=ang; // haluskan perubahan sudut
      const k=sc[0]+(sc[1]-sc[0])*t;
      const bank=Math.sin(t*Math.PI*2+phase)*bankAmp;          // badan miring kiri-kanan (3D)
      const tilt=Math.sin(t*Math.PI*3+phase)*10;               // sedikit mengangguk (3D)
      return{transform:`translate3d(${q[0]}px,${q[1]}px,0) scale(${k}) scaleX(${dir}) rotate(${ang}deg) rotateX(${bank}deg) rotateY(${tilt}deg)`};
    });
    const speed=(28+z*60)*R(.85,1.15);
    const anim=el.animate(frames,{duration:len/speed*1000,easing:'cubic-bezier(.35,.05,.65,.95)',fill:'forwards'});
    anim.onfinish=()=>setTimeout(()=>fly(el),R(800,5000));
  }
  const lowEnd=matchMedia('(pointer:coarse)').matches||innerWidth<700,N=lowEnd?4:12;
  for(let i=0;i<N;i++){
    const z=Math.random(),el=document.createElement('img');      // z: 0 = jauh, 1 = dekat
    el.src='/dove.svg';el.alt='';el.className='fly';el.dataset.z=z;
    el.style.width=(30+z*60)+'px';el.style.opacity=(.45+z*.55).toFixed(2);
    if(!lowEnd)el.style.filter=`blur(${((1-z)*1.6).toFixed(1)}px)`;el.style.zIndex=Math.round(z*10);
    el.style.transform='translate3d(-300px,-300px,0)';box.append(el);setTimeout(()=>fly(el),R(0,9000));
  }
})();

// Hujan bunga & hati yang terus berjatuhan pelan setelah undangan dibuka
function petalRain(){if(petalRain.on||matchMedia('(prefers-reduced-motion:reduce)').matches)return;petalRain.on=1;
  const drop=()=>{if(!document.hidden){const p=document.createElement('span');p.className='petal';p.textContent=['❀','✿','💜'][Math.floor(Math.random()*3)];
    p.style.left=Math.random()*100+'vw';p.style.fontSize=12+Math.random()*14+'px';const d=6+Math.random()*5;p.style.animationDuration=d+'s';p.style.opacity=.75;
    document.body.append(p);setTimeout(()=>p.remove(),d*1000+500)}
    setTimeout(drop,innerWidth<700?1500:600)};
  drop()}

// Menyusuri taman: kamera berjalan di jalan setapak 3D mengikuti scroll (digambar di canvas agar ringan),
// section muncul dari kejauhan lalu dilewati.
(function garden(){
  const cv=document.getElementById('gardenCv');if(!cv)return;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const mobile=matchMedia('(pointer:coarse)').matches||innerWidth<700;
  const ctx=cv.getContext('2d');
  document.body.classList.add('zoomfx');if(mobile)document.body.classList.add('lite');

  // ---- gambar (dirasterisasi sekali agar cepat digambar ulang) ----
  const ASPECT={tree:200/300,bush:200/120,lamp:60/220,arch:300/330,tulips:100/70},img={};
  Object.keys(ASPECT).forEach(n=>{const im=new Image();im.onload=()=>{const h=mobile?260:420,c=document.createElement('canvas');
    c.height=h;c.width=Math.round(h*ASPECT[n]);c.getContext('2d').drawImage(im,0,0,c.width,c.height);img[n]=c;dirty=true;kick()};im.src='/garden/'+n+'.svg'});

  // ---- dunia taman (berulang setiap L satuan) ----
  let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const L=1600,items=[];
  for(let z=0;z<L;z+=200){items.push({n:'tree',x:-(150+rnd()*70),z:z+rnd()*40,h:210+rnd()*70});items.push({n:'tree',x:150+rnd()*70,z:z+100+rnd()*40,h:210+rnd()*70})}
  for(let z=0;z<L;z+=100){items.push({n:'bush',x:-(80+rnd()*25),z:z+50,h:40+rnd()*12});items.push({n:'bush',x:80+rnd()*25,z:z+rnd()*30,h:40+rnd()*12})}
  for(let z=0;z<L;z+=60){items.push({n:'tulips',x:-(52+rnd()*6),z:z+rnd()*20,h:16});items.push({n:'tulips',x:52+rnd()*6,z:z+30+rnd()*20,h:16})}
  for(let z=200;z<L;z+=400){items.push({n:'lamp',x:-62,z,h:110});items.push({n:'lamp',x:62,z,h:110})}
  items.push({n:'arch',x:0,z:0,h:175});items.push({n:'arch',x:0,z:800,h:175});

  let bgc=null,W=0,H=0,dpr=1,sy=scrollY,running=false,dirty=true;
  const CAMH=38,DMAX=mobile?1800:2600,DMIN=12,SPEED=mobile?1.5:1.3;
  function resize(){
    const w=cv.clientWidth,h=cv.clientHeight;if(w===W&&h===H)return;
    W=w;H=h;dpr=Math.min(devicePixelRatio||1,mobile?1.25:2);bgc=null;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);dirty=true;measure();
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=t=>t*t*(3-2*t);

  function drawGarden(camZ){
    const c=ctx;c.setTransform(dpr,0,0,dpr,0,0);
    const cx=W/2,hy=H*.42,f=Math.min(W*1.15,H*.95);
    if(!bgc){bgc=document.createElement('canvas');bgc.width=cv.width;bgc.height=cv.height;const b=bgc.getContext('2d');b.setTransform(dpr,0,0,dpr,0,0);let g;
    // langit
    g=b.createLinearGradient(0,0,0,hy);g.addColorStop(0,'#efe4f6');g.addColorStop(1,'#f8f3ec');b.fillStyle=g;b.fillRect(0,0,W,hy+2);
    g=b.createRadialGradient(cx,hy-H*.06,0,cx,hy-H*.06,H*.35);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(1,'rgba(255,255,255,0)');b.fillStyle=g;b.fillRect(0,0,W,hy+2);
    // bukit jauh (sedikit bergeser agar terasa hidup)
    
    b.fillStyle='#dbe4cc';b.beginPath();b.moveTo(0,hy);for(let x=0;x<=W;x+=W/8)b.lineTo(x,hy-12-Math.sin(x/W*6+1)*10);b.lineTo(W,hy+2);b.lineTo(0,hy+2);b.fill();
    b.fillStyle='#cfdbbd';b.beginPath();b.moveTo(0,hy);for(let x=0;x<=W;x+=W/10)b.lineTo(x,hy-4-Math.sin(x/W*9+2)*6);b.lineTo(W,hy+2);b.lineTo(0,hy+2);b.fill();
    // tanah
    g=b.createLinearGradient(0,hy,0,H);g.addColorStop(0,'#cfdcbd');g.addColorStop(1,'#a9c191');b.fillStyle=g;b.fillRect(0,hy,W,H-hy);
    // jalan setapak
    const dB=CAMH*f/(H-hy),PW=42;
    g=b.createLinearGradient(0,hy,0,H);g.addColorStop(0,'#efe8da');g.addColorStop(1,'#e6dac4');b.fillStyle=g;
    b.beginPath();b.moveTo(cx-PW*f/DMAX,hy+CAMH*f/DMAX);b.lineTo(cx+PW*f/DMAX,hy+CAMH*f/DMAX);b.lineTo(cx+PW*f/dB,H);b.lineTo(cx-PW*f/dB,H);b.fill();
    }
    c.setTransform(1,0,0,1,0,0);c.drawImage(bgc,0,0);c.setTransform(dpr,0,0,dpr,0,0);let g;
    // kumpulkan objek yang terlihat
    const vis=[];
    for(const it of items){let d=((it.z-camZ)%L+L)%L;for(;d<DMAX;d+=L)if(d>DMIN)vis.push([d,it])}
    const STEP=48,off=((-camZ)%STEP+STEP)%STEP;for(let d=off;d<DMAX;d+=STEP)if(d>DMIN)vis.push([d,null]);
    vis.sort((a,b)=>b[0]-a[0]);
    for(const[d,it]of vis){
      const s=f/d,gy=hy+CAMH*s,fog=clamp((DMAX-d)/700,0,1);
      if(!it){ // batu pijakan
        c.globalAlpha=fog*clamp((d-DMIN)/30,0,1);c.fillStyle='#d6cbb8';c.beginPath();c.ellipse(cx,gy,15*s,5*s,0,0,6.283);c.fill();
        c.fillStyle='#e9e1d2';c.beginPath();c.ellipse(cx,gy-1.2*s,13*s,3.8*s,0,0,6.283);c.fill();continue}
      const im=img[it.n];if(!im)continue;
      const hh=it.h*s;if(hh<1.5)continue;const ww=hh*ASPECT[it.n],x=cx+it.x*s;
      if(x+ww/2<-50||x-ww/2>W+50)continue;
      const near=it.n==='arch'?clamp((d-DMIN)/(mobile?55:45),0,1):clamp((d-DMIN)/35,0,1);
      c.globalAlpha=fog*near;c.drawImage(im,x-ww/2,gy-hh,ww,hh);
    }
    c.globalAlpha=1;
    // kabut lembut di cakrawala
    g=c.createLinearGradient(0,hy-H*.05,0,hy+H*.08);g.addColorStop(0,'rgba(248,243,236,0)');g.addColorStop(.5,'rgba(248,243,236,.55)');g.addColorStop(1,'rgba(248,243,236,0)');
    c.fillStyle=g;c.fillRect(0,hy-H*.05,W,H*.13);
  }

  // ---- transisi section ----
  const main=document.querySelector('main'),secs=[...document.querySelectorAll('main .sec')];let tops=[];
  function measure(){tops=secs.map(s=>[main.offsetTop+s.offsetTop,s.offsetHeight])}
  function sections(y){
    if(reduce)return;
    const k=mobile?.55:1;
    secs.forEach((s,i)=>{const[t,h]=tops[i]||[0,0],top=t-y,bot=top+h;
      if(bot<-H||top>H*2)return;
      const e=top>H*.3?clamp((top-H*.3)/(H*.7),0,1):0,l=bot<H*.7?clamp((H*.7-bot)/(H*.7),0,1):0;
      const sc=1-ease(e)*.2*k+ease(l)*.25*k,op=clamp(1-e*1.1-l*1.4,0,1);
      const key=sc.toFixed(3)+'|'+op.toFixed(2);if(s._k===key)return;s._k=key;
      s.style.transformOrigin=`50% ${(H/2-top).toFixed(0)}px`;
      s.style.transform=`translate3d(0,0,0) scale(${sc.toFixed(3)})`;s.style.opacity=op.toFixed(2);
      if(!mobile){const bl=Math.min(3,(e+l)*4);s.style.filter=bl>.3?`blur(${bl.toFixed(1)}px)`:''}
    });
  }

  function frame(){
    resize();
    const target=scrollY;sy+=(target-sy)*(mobile?1:.12);if(Math.abs(target-sy)<.4)sy=target;
    drawGarden(reduce?0:sy*SPEED);sections(sy);dirty=false;
    if(sy!==target)requestAnimationFrame(frame);else running=false;
  }
  function kick(){if(!running){running=true;requestAnimationFrame(frame)}}
  // ---- snap per section yang dinamis ----
  // section pendek: sekali geser langsung pindah. section panjang: bebas di-scroll di dalamnya,
  // baru pindah (snap) setelah mentok di ujung dan tamu masih menggeser ke arah yang sama.
  let segs=[],busyNav=false,lastNav=0,idleT=0;
  function buildSegs(){
    const vh=innerHeight,max=document.documentElement.scrollHeight-vh;
    segs=tops.map(([t,h])=>{let a,b;if(h<=vh*.92){a=b=t+h/2-vh/2}else{a=t-vh*.06;b=t+h-vh*.94}
      return{a:clamp(Math.round(a),0,max),b:clamp(Math.round(b),0,max),tall:h>vh*.92}});
  }
  const segAt=y=>segs.findIndex(s=>y>=s.a-4&&y<=s.b+4);
  const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  function glide(to){
    const from=scrollY;busyNav=true;lastNav=performance.now();
    if(Math.abs(to-from)<2){busyNav=false;return}
    const html=document.documentElement,prev=html.style.scrollBehavior;html.style.scrollBehavior='auto';
    const dur=Math.min(mobile?750:900,300+Math.abs(to-from)*.9),t0=performance.now();
    (function step(now){const k=clamp((now-t0)/dur,0,1);scrollTo(0,from+(to-from)*easeIO(k));
      if(k<1)requestAnimationFrame(step);else{html.style.scrollBehavior=prev;lastNav=performance.now();setTimeout(()=>busyNav=false,120)}})(t0);
  }
  // apakah gerakan ini boleh di-scroll bebas (masih di dalam section panjang, belum mentok)?
  const free=dir=>{const i=segAt(scrollY);if(i<0||!segs[i].tall)return false;const s=segs[i];return dir>0?scrollY<s.b-2:scrollY>s.a+2};
  function go(dir){
    if(busyNav||!segs.length||document.body.classList.contains('locked'))return;
    const y=scrollY;let i=segAt(y);
    if(i<0){let nx=segs.findIndex(s=>s.a>y);if(nx<0)nx=segs.length;i=dir>0?nx-1:nx}  // sedang di celah antar section
    const n=clamp(i+dir,0,segs.length-1),t=segs[n];glide(dir>0?t.a:t.b);
  }
  // kalau berhenti di celah antar section (mis. sisa momentum), luncur ke section terdekat
  function settle(){if(busyNav||document.body.classList.contains('locked')||segAt(scrollY)>=0)return;
    let best=0,bd=1e9;for(const s of segs)for(const v of[s.a,s.b]){const d=Math.abs(v-scrollY);if(d<bd){bd=d;best=v}}glide(best)}
  const skip=e=>e.target.closest&&e.target.closest('#scratchCv,textarea,select,input');
  if(!reduce){
    addEventListener('wheel',e=>{if(skip(e)||document.body.classList.contains('locked'))return;
      const dir=Math.sign(e.deltaY);if(!dir)return;
      if(!busyNav&&free(dir))return;                                   // scroll bebas di section panjang
      e.preventDefault();if(busyNav||performance.now()-lastNav<450||Math.abs(e.deltaY)<6)return;go(dir)},{passive:false});
    let ty=null,fired=false,startFree=null;
    addEventListener('touchstart',e=>{ty=e.touches[0].clientY;fired=false;startFree=null;clearTimeout(idleT)},{passive:true});
    addEventListener('touchmove',e=>{if(skip(e)||ty===null||document.body.classList.contains('locked'))return;
      const dy=ty-e.touches[0].clientY,dir=Math.sign(dy);if(!dir)return;
      if(startFree===null)startFree=free(dir);
      if(startFree&&!busyNav&&free(dir))return;                        // biarkan jari menggulir bebas
      e.preventDefault();if(!fired&&Math.abs(dy)>40){fired=true;go(dir)}},{passive:false});
    addEventListener('touchend',()=>{ty=null},{passive:true});
    addEventListener('scroll',()=>{clearTimeout(idleT);if(!busyNav&&ty===null)idleT=setTimeout(settle,mobile?260:180)},{passive:true});
    addEventListener('keydown',e=>{const k={ArrowDown:1,PageDown:1,' ':1,ArrowUp:-1,PageUp:-1}[e.key];
      if(k&&!skip(e)){if(free(k)&&(e.key==='ArrowDown'||e.key==='ArrowUp'))return;e.preventDefault();
        if(free(k)){const sgm=segs[segAt(scrollY)];glide(clamp(scrollY+k*innerHeight*.8,sgm.a,sgm.b))}else go(k)}});
    const rebuild=()=>{measure();buildSegs()};
    addEventListener('resize',rebuild);addEventListener('load',rebuild);setTimeout(rebuild,1600);rebuild();
  }
  addEventListener('scroll',kick,{passive:true});
  addEventListener('resize',()=>{measure();kick()});
  addEventListener('load',()=>{measure();kick()});
  setTimeout(()=>{measure();kick()},1500);
  measure();kick();
})();
