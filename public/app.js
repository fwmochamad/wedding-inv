// ====== KONFIGURASI ======
const WEDDING = new Date('2026-02-07T08:00:00+07:00'); // ganti bila tanggal berubah
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
$('#openBtn').onclick=()=>{$('#cover').classList.add('open');document.body.classList.remove('locked');bgm.play().then(()=>$('#musicBtn').classList.add('on')).catch(()=>{});petals();toast('Kumpulkan 7 💜 tersembunyi di undangan ini!')};
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
