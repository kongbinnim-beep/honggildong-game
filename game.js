(()=>{'use strict';
const STORE='qualification-future-game-v2';
const $=id=>document.getElementById(id);
const ITEMS={
 notice:{title:'불합격 통지서',text:'시험 점수는 상위 2%지만, 출신 가정의 D등급 때문에 선발 대상에서 제외되었다.'},
 ranking:{title:'등급 산정 규칙',text:'학습 능력과 성취도보다 부모의 자산과 사회 등급이 우선 계산되는 공식 문서.'},
 sibling:{title:'심사관의 증언',text:'평가 시스템 담당자가 실제 성적과 등급이 서로 다르게 반영된다고 증언했다.'},
 ledger:{title:'비밀 자금 거래 내역',text:'상위 등급 기업의 후원금이 심사 위원들의 개인 계좌로 흘러간 기록.'},
 algorithm:{title:'조작된 등급 알고리즘',text:'하위 등급 지원자의 점수를 자동 감점하도록 설정된 내부 코드와 로그.'},
 testimony:{title:'지원자 연대 서명',text:'등급 때문에 교육·취업 기회를 빼앗긴 지원자들의 공동 증언.'},
 archive:{title:'백업 뉴스 원본',text:'삭제된 폭로 기사와 공공 데이터의 원본 사본.'}
};
const ENDINGS={
 obey:{number:'ENDING A / 순응',title:'정숙한 내일, 그대로인 등급 체계',image:'end_obey',subtitle:'당신은 오늘을 지켰다. 그러나 내일의 규칙은 바뀌지 않았다.',paragraphs:[
 '당신은 조건부 합격 제안을 받아들였다. 상위 등급 기업이 보장하는 안정된 자리와 특별 거주권. 오랫동안 바라던 문이 마침내 열렸다.',
 '하지만 같은 날, 당신과 같은 점수를 받은 D등급 지원자 수백 명은 문밖에 남았다. 당신이 발견한 장부와 조작된 평가 기록은 비밀 보관함 속에 묻혔다.',
 '권력층은 조용히 안도한다. <em>한 사람의 성공이 불공정한 제도의 정당성을 증명하지는 않는다.</em>'
 ],effect1:['당신에게 일어난 일','조건부 기회를 얻었지만 비밀 유지와 감시를 받아들이게 되었다.'],effect2:['사회에 남은 일','부와 출신 배경에 따라 기회가 갈리는 구조가 유지되었다.']},
 expose:{number:'ENDING B / 폭로',title:'진실이 번진 네온 도시',image:'end_reveal',subtitle:'숨겼던 숫자가 도시의 모든 화면에 나타났다.',paragraphs:[
 '당신이 확보한 자료는 독립 기자들의 손을 거쳐 공개되었다. 후원금 거래, 조작된 점수표, 내부 증언이 연달아 뉴스에 등장한다.',
 '시민들은 거리로 나왔고, 권력층은 당신을 허위 사실 유포자로 몰아갔다. 일부 기관이 조사를 시작하지만 그 결과와 제도 개혁은 아직 불확실하다.',
 '진실이 알려진 것은 끝이 아니라 시작이었다. <em>폭로 뒤의 사회를 바꾸려면, 자료를 지킬 사람과 행동할 공동체가 필요하다.</em>'
 ],effect1:['당신에게 일어난 일','권력의 반발과 위험 속에서도 진실을 세상에 알렸다.'],effect2:['사회에 남은 일','등급제의 부패가 드러났지만 제도 개혁은 아직 진행 중이다.']},
 change:{number:'ENDING C / 변화',title:'NEW YULDO PROTOCOL',image:'end_change',subtitle:'누군가의 가정 배경이 아니라, 모두의 권리가 기준이 되는 도시 시스템.',paragraphs:[
 '당신은 진실을 혼자 외치지 않았다. 차별받은 지원자와 기자, 교사, 심지어 기존 시스템의 내부자까지 힘을 모아 독립 심사 기구를 요구했다.',
 '공개된 증거와 시민들의 지속적인 행동 끝에 혈통·재산을 평가에 반영하는 규칙이 폐지되기 시작한다. 누구나 심사 기준을 검증할 수 있는 감시 위원회도 만들어진다.',
 '사람들은 이 새로운 실험을 <em>‘율도국 프로젝트’</em>라고 부른다. 홍길동이 차별 없는 나라를 꿈꾸었던 것처럼, 이곳도 완성된 이상향이 아니라 함께 지켜야 할 약속이다.'
 ],effect1:['당신에게 일어난 일','진실과 연대를 결합해 제도 변화의 시작을 만들었다.'],effect2:['사회에 남은 일','출신에 따른 등급 차별을 줄이고 권력을 감시하는 장치를 세웠다.']}
};
const SCENES={
 screening:{chap:1,kicker:'CHAPTER 01 · 심사의 문',title:'당신의 등급은 D입니다',image:'screen',prose:s=>`<p>2099년, 도시 <em>뉴서울-2099</em>. 모든 시민은 열여덟 살이 되는 날, 중앙 AI <em>CIVOS</em>에게 사회 등급을 부여받는다. 등급은 교육, 취업, 주거 구역, 심지어 이용 가능한 교통 노선까지 결정한다.</p><p>당신은 전국 역량 시험에서 상위 2%를 기록했다. 홍채 스캔을 마친 순간, 공중 홀로스크린에 붉은 경고 문구가 떠오른다.</p><p><em>“지원 불가 — 가구 출신 등급 D.”</em> 바로 옆 공중 패널에는 당신보다 점수가 낮은 A등급 지원자의 합격 배지가 떠 있다.</p>`,dialogue:'“능력이 충분하다는 건 인정합니다. 하지만 자격은 별개입니다.”',question:'첫 번째 부당함 앞에서 무엇을 할까?',choices:[
 {title:'등급 산정 기준의 공개를 요구한다',sub:'왜 출신 배경이 실력보다 우선하는지 확인한다',next:'rules',evidence:1,item:'notice'},
 {title:'같은 처지의 지원자들에게 말을 건다',sub:'혼자가 아님을 확인하고 증언을 모은다',next:'allies',solidarity:2,item:'notice'}]},
 rules:{chap:2,kicker:'CHAPTER 02 · 등급의 비밀',title:'기준은 능력이 아니었다',image:'records',prose:s=>`<p>이의 신청센터의 구형 투명 OLED 단말기를 해킹하듯 넘기던 당신은 등급 산정의 세부 항목을 발견한다.</p><p>시험 성적은 전체 점수의 20%. 나머지 80%는 <em>부모의 자산, 거주 구역, 가족의 사회 등급</em>이었다.</p><p>그때 손목 인터페이스에 익명의 암호화 메시지가 뜬다. “더 큰 비밀이 있어요. 누군가 이 기준을 고의로 유지하고 있습니다.”</p>`,dialogue:'“우리가 태어나기 전에 이미 결과가 결정된 거예요.”',question:'어느 단서부터 추적할까?',choices:[
 {title:'익명 제보자를 만나 내부 문서를 받는다',sub:'조작을 입증할 증언을 확보한다',next:'vault',evidence:1,item:'ranking',flag:'insider'},
 {title:'피해 지원자들의 사례를 공개적으로 모은다',sub:'차별을 겪은 사람들의 목소리를 연결한다',next:'vault',solidarity:2,item:'ranking',flag:'public_cases'}]},
 allies:{chap:2,kicker:'CHAPTER 02 · 보이지 않는 선',title:'같은 점수, 다른 삶',image:'people',prose:s=>`<p>지원센터 바깥, 네온 광고가 번지는 대합실에서 당신은 같은 시험을 치른 사람들을 만난다. 누군가는 장학금을 잃었고, 누군가는 거주 구역 바깥으로 쫓겨날 위기에 놓였다.</p><p>한 지원자가 자신의 화면을 보여준다. A등급인 친구는 낮은 점수로도 최상위 대학에 합격했다. <em>이 차별은 한 사람의 불운이 아니라 구조였다.</em></p><p>그중 한 명이 상위 등급 기업의 기밀 심사 자료가 저장된 양자 서버 위치를 알고 있다고 말한다.</p>`,dialogue:'“우리가 바꿔야 할 건 시험 점수가 아니라, 시험 바깥의 규칙이에요.”',question:'누구와 함께 움직일까?',choices:[
 {title:'지원자들과 공동 서명을 만든다',sub:'차별을 겪은 사람들의 경험을 기록한다',next:'vault',solidarity:2,item:'testimony'},
 {title:'심사 담당자를 설득해 내부 자료를 얻는다',sub:'조작의 흔적을 찾아 나선다',next:'vault',evidence:2,item:'sibling'}]},
 vault:{chap:3,kicker:'CHAPTER 03 · 부패한 연결',title:'권력의 서버에 남은 숫자',image:'records',prose:s=>`<p>뉴서울 중심 구역. 공중 차도가 겹겹이 교차하는 초고층 타워 아래의 비밀 양자 데이터 센터에서 당신은 <em>기업 후원금이 등급 심사 위원들에게 흘러간 기록</em>을 발견한다.</p><p>기업들은 A등급 가정의 자녀가 좋은 기회를 독점하도록 알고리즘까지 조작했다. 그 대가로 권력자들은 막대한 돈을 받았다.</p><p>청색 경고등이 번쩍이고 보안 드론이 깨어난다. 보안망이 당신의 접근을 감지했다. 모든 자료를 가져갈 시간은 없다.</p>`,dialogue:'“기회가 불공평한 것만이 아니에요. 불공평하게 만들어 돈을 벌고 있었어요.”',question:'어떤 증거를 먼저 확보할까?',choices:[
 {title:'비밀 자금 장부를 내려받는다',sub:'부패의 돈 흐름을 입증한다',next:'crossroads',evidence:2,risk:1,item:'ledger'},
 {title:'등급 알고리즘의 조작 로그를 복사한다',sub:'차별이 의도적으로 설계됐다는 흔적을 남긴다',next:'crossroads',evidence:2,risk:1,item:'algorithm'},
 {title:'동료가 무사히 빠져나가도록 돕는다',sub:'증거 일부를 포기하고 함께할 사람을 지킨다',next:'crossroads',solidarity:2,risk:0,item:'testimony'}]},
 crossroads:{chap:4,kicker:'CHAPTER 04 · 선택의 무게',title:'한 사람의 목소리, 도시의 미래',image:'confront',prose:s=>`<p>도시 전역의 초대형 홀로그램 화면에는 “사회 등급은 모두에게 공정하다”는 광고가 흐른다. 당신에게는 거액의 비밀 합의금과 조건부 A등급 승격 제안이 도착한다.</p><p>반면 독립 기자들은 당신에게 자료를 보내 달라고 한다. 피해 지원자들은 함께 공청회를 열자고 제안한다.</p><p>${s.solidarity>=3?'당신 곁에는 이미 서로를 믿는 사람들이 모여 있다.':'아직 당신의 편에 선 사람은 많지 않다. 그러나 진실을 지킬 방법은 남아 있다.'} <em>당신의 한 번의 행동이 누구의 내일을 바꿀까?</em></p>`,dialogue:'“당신 혼자만 위로 올라갈 수도 있어요. 아니면 모두에게 새로운 길을 열 수도 있죠.”',question:'마지막 선택을 앞두고 무엇을 준비할까?',choices:[
 {title:'권력층의 거래 조건을 자세히 확인한다',sub:'안전을 확보하지만 압박도 커진다',next:'finale',risk:1,flag:'negotiated'},
 {title:'독립 기자에게 자료를 안전하게 분산한다',sub:'사실이 지워지지 않도록 백업한다',next:'finale',evidence:1,risk:1,item:'archive'},
 {title:'피해자들과 공개 시민회의를 조직한다',sub:'변화를 요구하는 목소리를 모은다',next:'finale',solidarity:2,flag:'meeting'}]},
 finale:{chap:5,kicker:'FINAL CHAPTER · 당신의 선택',title:'당신의 자격은 무엇입니까?',image:'confront',prose:s=>`<p>자정. 뉴서울 시청 타워의 홀로그램 전광판이 켜졌다. 당신이 선 곳은 하층 구역과 상층 공중구역을 가르는 스카이브리지 위다.</p><p>당신이 모은 증거는 <em>${s.evidence}</em>, 함께하는 사람들의 힘은 <em>${s.solidarity}</em>. 그동안의 선택은 당신에게 서로 다른 책임을 남겼다.</p><p>세 가지 경로가 눈앞에 떠오른다. <em>당신은 어떤 미래 프로토콜을 실행할 것인가?</em></p>`,dialogue:'“내가 바꿀 수 있는 건 내 자리뿐일까, 아니면 자리를 나누는 규칙일까?”',question:'마지막 결정을 내리세요.',choices:[
 {title:'A. 제안에 순응하고 자신의 기회를 지킨다',sub:'당장은 안전하지만 등급 사회의 규칙은 남는다',next:'obey'},
 {title:'B. 부패 자료를 공개해 진실을 폭로한다',sub:'권력의 반발과 사회의 혼란을 감수한다',next:'expose'},
 {title:'C. 사람들과 함께 등급제를 바꾸는 운동을 시작한다',sub:'긴 시간이 걸리더라도 제도를 바꾸려 한다',next:'change'}]}
};
const fresh=()=>({scene:'intro',evidence:0,solidarity:0,risk:0,items:[],flags:[],history:[]});
const validScenes=['intro',...Object.keys(SCENES),...Object.keys(ENDINGS)];
let state=fresh();try{const saved=JSON.parse(localStorage.getItem(STORE)||'null');if(saved&&validScenes.includes(saved.scene)&&Array.isArray(saved.items)&&Array.isArray(saved.history)&&Array.isArray(saved.flags))state={...fresh(),...saved};}catch(e){}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}};
const clamp=n=>Math.max(0,Math.min(10,n));
const art=(name,label)=>`<figure class="art"><img src="assets/${name}.svg" alt="${label}"/><div class="art-label"><span>NEW SEOUL / 2099</span><span>${label}</span></div></figure>`;
const intro=()=>`${art('city','등급으로 나뉜 미래 도시')}<div class="body"><p class="eyebrow">QR INTERACTIVE STORY · 『홍길동전』에서 출발한 미래</p><h1 class="title">당신의 자격은<br>무엇입니까?</h1><div class="prose"><p>신분제가 사라진 미래. 그런데 사람들은 여전히 <em>태어난 배경에 따라 등급</em>을 부여받습니다.</p><p>당신은 능력이 있지만 낮은 등급 때문에 기회를 빼앗긴 지원자입니다. 홍길동이 서자라는 이유로 차별받았던 것처럼요.</p><p>숨겨진 부패를 발견한 뒤, 당신의 선택은 뉴서울의 미래를 바꿉니다.</p></div><div class="pill-row"><span class="pill">약 5분</span><span class="pill">선택형 이야기</span><span class="pill">3가지 결말</span></div><div class="buttons"><button class="primary" data-action="start" type="button">이야기 시작하기 ↗</button>${state.scene!=='intro'?'<button class="secondary" data-action="resume" type="button">이어 하기</button>':''}</div><div class="notice-box">♫ 배경음악은 상단의 <b>음악 켜기</b> 버튼으로 시작할 수 있어요. 선택할 때마다 이야기가 달라집니다.</div></div>`;
const sceneView=s=>`${art(s.image,s.title)}<div class="body"><p class="eyebrow">${s.kicker}</p><h1 class="title">${s.title}</h1><div class="prose">${s.prose(state)}</div><div class="dialogue">${s.dialogue}</div><div class="question">${s.question}</div><div class="choices">${s.choices.map((c,i)=>`<button type="button" class="choice" data-choice="${i}"><span class="choice-number">${String(i+1).padStart(2,'0')}</span><span class="choice-copy"><b>${c.title}</b><small>${c.sub}</small></span><span class="choice-arrow">↗</span></button>`).join('')}</div></div>`;
const endView=e=>`${art(e.image,e.title)}<div class="body"><p class="eyebrow">THE STORY YOU CHOSE · ${e.number}</p><div class="ending-hero"><small>당신이 실행한 미래</small><h2>${e.title}</h2><p>${e.subtitle}</p></div><div class="prose">${e.paragraphs.map(x=>`<p>${x}</p>`).join('')}</div><div class="outcome"><div><b>${e.effect1[0]}</b><p>${e.effect1[1]}</p></div><div><b>${e.effect2[0]}</b><p>${e.effect2[1]}</p></div></div><div class="reflection">“사람의 자격은 태어난 배경으로 결정될까요? 공정한 사회를 만드는 일은 누구의 몫일까요?”</div><div class="buttons"><button type="button" class="primary" data-action="restart">다른 미래 선택하기 ↺</button><button type="button" class="secondary" data-action="share">결말 공유하기</button></div><p class="hint">고전 《홍길동전》의 서자 차별과 율도국을 미래 사회의 등급제 문제와 연결한 창작 게임입니다.</p></div>`;
let preview=false;
function render(){const s=SCENES[state.scene],e=ENDINGS[state.scene];$('gameArea').innerHTML=preview||state.scene==='intro'?intro():s?sceneView(s):e?endView(e):intro();const chapter=preview||state.scene==='intro'?0:s?s.chap:5;$('chapterLabel').textContent=preview||state.scene==='intro'?'PROLOGUE':e?'ENDING · 세 갈래의 미래':s.kicker;$('progressCount').textContent=`${String(chapter).padStart(2,'0')} / 05`;$('progressBar').style.width=`${chapter*20}%`;$('itemCount').textContent=state.items.length;for(const k of ['evidence','solidarity','risk']){$(k).textContent=state[k];$(k+'Bar').style.width=`${clamp(state[k])*10}%`;}document.title='당신의 자격은 무엇입니까? — 선택형 스토리 게임';}
const showTop=()=>{if(scrollY>150)scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
function start(){state=fresh();state.scene='screening';preview=false;save();render();showTop();}
function choose(idx){const current=SCENES[state.scene],c=current?.choices[idx];if(!c)return;for(const k of ['evidence','solidarity','risk'])state[k]=clamp(state[k]+(c[k]||0));if(c.item&&!state.items.includes(c.item)){state.items.push(c.item);toast('새 자료 확보: '+ITEMS[c.item].title);}if(c.flag&&!state.flags.includes(c.flag))state.flags.push(c.flag);state.history.push({scene:state.scene,choice:c.title});state.scene=c.next;save();render();showTop();}
let toastTimer;function toast(txt){$('toast').textContent=txt;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2300);}
function showJournal(){const items=state.items.map((k,i)=>`<article class="document"><small>FILE ${String(i+1).padStart(2,'0')}</small><h3>${ITEMS[k].title}</h3><p>${ITEMS[k].text}</p></article>`).join('');$('documents').innerHTML=items||'<p>아직 확보한 자료가 없습니다. 선택지를 진행하며 증거를 찾으세요.</p>';$('modal').hidden=false;$('closeJournal').focus();}
function closeJournal(){$('modal').hidden=true;$('openJournal').focus();}
let musicOn=false;const music=$('bgm');music.volume=.42;const musicBtn=$('musicToggle');async function toggleMusic(){if(musicOn){music.pause();musicOn=false;}else{try{await music.play();musicOn=true;}catch(e){toast('브라우저에서 음악 재생이 제한됐어요. 버튼을 다시 눌러 보세요.');}}musicBtn.textContent=musicOn?'♫ 음악 끄기':'♫ 음악 켜기';musicBtn.classList.toggle('playing',musicOn);musicBtn.setAttribute('aria-label',musicOn?'배경음악 끄기':'배경음악 켜기');}
async function share(){const e=ENDINGS[state.scene];if(!e)return;const txt=`《당신의 자격은 무엇입니까?》\n${e.number}: ${e.title}\n${e.subtitle}\n${location.protocol.startsWith('http')?location.href:''}`;if(navigator.share){try{await navigator.share({title:'당신의 자격은 무엇입니까?',text:txt});return;}catch(err){if(err.name==='AbortError')return;}}try{await navigator.clipboard.writeText(txt);toast('결말이 복사됐어요!');}catch(err){toast('공유 기능을 사용할 수 없어요.');}}
$('gameArea').addEventListener('click',e=>{const c=e.target.closest('[data-choice]');if(c){choose(+c.dataset.choice);return;}const a=e.target.closest('[data-action]')?.dataset.action;if(a==='start')start();if(a==='resume'){preview=false;render();showTop();}if(a==='restart')start();if(a==='share')share();});
$('home').addEventListener('click',e=>{e.preventDefault();preview=true;render();showTop();});$('reset').addEventListener('click',()=>{if(confirm('처음부터 새로운 이야기를 시작할까요?'))start();});$('openJournal').addEventListener('click',showJournal);$('closeJournal').addEventListener('click',closeJournal);$('modal').addEventListener('click',e=>{if(e.target===$('modal'))closeJournal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('modal').hidden)closeJournal();});musicBtn.addEventListener('click',toggleMusic);render();
})();