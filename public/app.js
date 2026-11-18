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
  const N=innerWidth<600?7:12;
  for(let i=0;i<N;i++){
    const z=Math.random(),el=document.createElement('img');      // z: 0 = jauh, 1 = dekat
    el.src='/dove.svg';el.alt='';el.className='fly';el.dataset.z=z;
    el.style.width=(30+z*60)+'px';el.style.opacity=(.45+z*.55).toFixed(2);
    el.style.filter=`blur(${((1-z)*1.6).toFixed(1)}px)`;el.style.zIndex=Math.round(z*10);
    el.style.transform='translate3d(-300px,-300px,0)';box.append(el);setTimeout(()=>fly(el),R(0,9000));
  }
})();

// Hujan bunga & hati yang terus berjatuhan pelan setelah undangan dibuka
function petalRain(){if(petalRain.on||matchMedia('(prefers-reduced-motion:reduce)').matches)return;petalRain.on=1;
  const drop=()=>{if(!document.hidden){const p=document.createElement('span');p.className='petal';p.textContent=['❀','✿','💜'][Math.floor(Math.random()*3)];
    p.style.left=Math.random()*100+'vw';p.style.fontSize=12+Math.random()*14+'px';const d=6+Math.random()*5;p.style.animationDuration=d+'s';p.style.opacity=.75;
    document.body.append(p);setTimeout(()=>p.remove(),d*1000+500)}
    setTimeout(drop,innerWidth<600?900:600)};
  drop()}
