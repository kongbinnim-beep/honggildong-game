/* 당신의 자격은 무엇입니까? — 2099 NEW SEOUL, v3 */
(()=>{
'use strict';
const KEY='qualification-future-game-v4-fixed-d';
const $=id=>document.getElementById(id);
const MAX=10;
const GRADES=['D'];
const GRADE_META={
 A:{name:'특권 계층',side:'상층 구역 거주 · 진입 허가',intro:'당신은 태어나자마자 시민 등급 A를 부여받았다. 시험 결과가 평범해도 교육·취업 심사는 자동 통과된다. 오늘 당신은 가족이 운영하는 기업의 후원 명단에서 자신의 이름을 발견한다. 그리고 그 명단에는 평가위원들의 비밀 계좌가 연결되어 있었다.',quote:'“혜택을 누리는 동안, 무엇이 잘못됐는지 알려고 하지 않았죠.”',dilemma:'당신의 특권을 지키는 대신 진실을 외면할 것인가?',fact:'상위 등급 시민은 일부 심사를 면제받는다.',mark:'[상층 시민 인증 완료]'},
 B:{name:'중간 계층',side:'조건부 심사 · 재평가 가능',intro:'당신은 시민 등급 B다. 성적과 실적이 좋아야만 상층 구역의 문이 열린다. 오늘 공동 프로젝트에 참여하던 D등급 동료가 같은 성적을 받고도 탈락했다. 반면 A등급 지원자는 평가를 받기도 전에 합격 통보를 받았다.',quote:'“내 자리는 안전한 걸까요? 아니면 언젠가 나도 밀려나는 걸까요?”',dilemma:'공정함을 요구하면 당신의 기회도 사라질 수 있다.',fact:'B등급은 출신 배경에 따른 추가 심사를 받는다.',mark:'[조건부 시민 권한 승인]'},
 D:{name:'차별 계층',side:'접근 제한 · 교육/취업 불이익',intro:'당신은 전국 역량 시험 상위 2%를 기록했다. 그러나 부모의 자산과 출신 구역을 이유로 태어날 때부터 시민 등급 D로 분류되어 왔다. 홍채 인증을 마친 순간, 공중 홀로그램에는 붉은 글자가 떠올랐다. “지원 불가 — 출신 가구 기준 미달.”',quote:'“시험은 내가 치렀는데, 왜 결과는 부모의 이름으로 결정되죠?”',dilemma:'자격을 증명해도 문이 열리지 않는 사회에서 무엇을 할 것인가?',fact:'D등급은 능력과 관계없이 일부 교육·취업 기회를 제한받는다.',mark:'[상위 진입 권한 거부]'}
};
const DOCS={
 score:{head:'CIVOS / CITIZEN SCORING PROTOCOL',title:'사회 등급 산정 비밀 규칙',desc:'평가 안내서에는 실력 중심 심사라고 쓰여 있지만, 내부 규칙에는 출신 배경 항목이 대부분을 차지한다.',rows:[['역량 시험 비중','20%'],['부모의 자산·가구 등급','60%'],['거주 구역·승계 점수','20%']],foot:'능력보다 태어난 환경이 더 큰 영향을 미친다.',gain:1},
 ledger:{head:'SECURE PAYMENT CHANNEL / TOP SECRET',title:'평가위원 비밀 거래 기록',desc:'상위 기업들이 유리한 등급 규칙을 유지하도록 돈을 지급한 내역이다.',rows:[['상층 기업 후원금','₡ 8,400,000'],['평가위원 비공개 계좌','지급 확인'],['규칙 변경 요청','보류 처리']],foot:'불공정한 제도가 우연이 아니라 거래의 결과였다는 흔적.',gain:2},
 algorithm:{head:'ALGORITHM AUDIT LOG / ACCESS DENIED',title:'차별 자동화 알고리즘 로그',desc:'성적이 같아도 D등급은 자동 감점되고, A등급은 가산점이 적용된다.',rows:[['지원자 A-204','가산점 +35'],['지원자 B-118','추가 심사'],['지원자 D-017','자동 탈락']],foot:'같은 능력이라도 출발 등급에 따라 계산 결과가 달라진다.',gain:2},
 witness:{head:'CITIZEN VOICE ARCHIVE',title:'차별 피해 시민 공동 증언',desc:'교육 기회와 주거 이동권을 제한받은 시민들의 증언이 모였다.',rows:[['증언 접수','218건'],['피해 시민 등급','B · D'],['서명 보존','분산 백업']],foot:'기록 속 숫자 뒤에 사람이 있다는 것을 보여 주는 자료.',gain:1}
};
const ENDINGS={
 obey:{code:'A',tag:'순응',title:'당신에게 열린 문, 닫힌 도시',image:'end_obey'},
 expose:{code:'B',tag:'폭로',title:'도시 전체에 공개된 진실',image:'end_reveal'},
 change:{code:'C',tag:'변화',title:'새로운 율도 프로토콜',image:'end_change'}
};
const base=()=>({grade:null,stage:'intro',evidence:0,solidarity:0,risk:0,documents:[],history:[],flags:[],docFocus:'score',ending:null,played:false});
let state=load(),introPreview=false,audioCtx=null,musicOn=false,toastTimer=null;
function load(){try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw&&typeof raw==='object'&&['intro','reveal','origin','signal','audit','vault','vaultDoc','crossroads','finale','ending'].includes(raw.stage)&&(!raw.grade||GRADES.includes(raw.grade))&&Array.isArray(raw.documents)&&Array.isArray(raw.history)){return {...base(),...raw,grade:raw.stage==='intro'?null:'D'};}}catch(_){}return base()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){}}
const cap=n=>Math.max(0,Math.min(MAX,Number(n)||0));
function update(e=0,s=0,r=0){state.evidence=cap(state.evidence+e);state.solidarity=cap(state.solidarity+s);state.risk=cap(state.risk+r)}
const picked=f=>state.flags.includes(f);
const remember=f=>{if(!picked(f))state.flags.push(f)};
const hasDoc=d=>state.documents.includes(d);
const asset=n=>`assets/${n}.svg`;
const hero=(img,tag)=>`<figure class="hero"><img src="${asset(img)}" alt="미래 도시의 ${tag} 장면"><div class="hero-overlay"><span class="holo-pill">${tag}</span><span class="holo-lines">CIVOS / NEW SEOUL / 2099</span></div></figure>`;
const outer=(img,tag,kicker,title,copy,dialogue,question,choices,extra='')=>`${hero(img,tag)}<div class="scene"><p class="kicker">${kicker}</p><h1>${title}</h1><div class="story-copy">${copy}</div>${dialogue?`<div class="dialogue">${dialogue}</div>`:''}${extra}${question?`<div class="question">${question}</div>`:''}<div class="choices">${choices.map((c,i)=>buttonChoice(i,c)).join('')}</div></div>`;
const buttonChoice=(i,c)=>`<button class="choice" type="button" data-choice="${i}" ${c.disabled?'disabled':''}><span class="choice-num">${String(i+1).padStart(2,'0')}</span><span class="choice-main"><strong>${c.title}</strong><small>${c.sub||''}</small></span><span class="choice-arrow">↗</span></button>`;
const buttons=(arr)=>arr.map((c,i)=>buttonChoice(i,c)).join('');
function screenIntro(){return `${hero('city','YEAR 2099 / NEW SEOUL')}<div class="scene"><p class="kicker">SYSTEM INITIALIZATION / 000</p><h1>당신의 자격은<br>무엇입니까?</h1><div class="story-copy"><p>2099년 뉴서울. 중앙 AI <strong>CIVOS</strong>는 시민의 출신 배경을 계산해 사회 등급을 부여합니다.</p><p>등급은 입학, 취업, 주거지, 교통 이용권까지 결정합니다. 당신의 선택과 무관하게 <strong>출발선이 정해지는 도시</strong>입니다.</p><p>이야기는 언제나 <strong>D등급 시민</strong>의 눈으로 시작됩니다. 과거 홍길동이 서얼이라는 이유로 능력을 인정받지 못했듯, 당신도 출신 배경 때문에 기회를 빼앗깁니다. 하지만 그 뒤의 행동은 선택할 수 있습니다.</p></div><div class="chip-row"><span class="chip">◈ 5~8분</span><span class="chip">◈ D등급으로 시작</span><span class="chip">◈ 3가지 결말</span></div><div class="alert"><span class="alert-heading">SYSTEM NOTICE</span>모든 플레이어는 D등급으로 시작합니다. 타고난 배경 때문에 불이익을 받는 홍길동의 처지를 직접 경험해 보세요. 다시 시작해도 등급은 D이며, 선택에 따라 미래는 달라집니다.</div><div class="buttons"><button type="button" class="primary" data-action="assign">D등급 시민으로 이야기 시작 →</button></div><p class="tiny-note">진행 상황은 이 기기에 저장됩니다. 음악은 상단 버튼으로 켤 수 있습니다.</p></div>`}
function screenReveal(){let g=state.grade,m=GRADE_META[g];return `${hero('screen','CIVOS / IDENTITY CONFIRMED')}<div class="scene"><p class="kicker">GOVERNMENT CLASSIFICATION COMPLETE</p><h1>당신의 등급은 이미 정해져 있습니다.</h1><div class="ranking-screen"><p class="kicker">CIVOS CLASS RATING ENGINE</p><div class="grade-reveal ${g.toLowerCase()}">${g}</div><p class="reveal-sub">GRADE ${g} · ${m.name}</p><div class="rank-row"><span>접근 권한</span><b>${m.side}</b></div><div class="rank-row"><span>등급 결정 기준</span><b>가구 배경 · 거주 구역</b></div></div><div class="story-copy"><p><strong>등급은 당신의 능력이 아니라 가정의 배경으로 결정됐습니다.</strong> 하지만 이후의 선택은 당신이 할 수 있습니다.</p></div><div class="buttons"><button type="button" class="primary" data-action="continue">나의 이야기 시작하기 →</button></div></div>`}
function sceneData(){const g=state.grade,gm=GRADE_META[g],isA=g==='A',isD=g==='D';
if(state.stage==='origin')return {image:isA?'city':isD?'screen':'people',tag:`CITIZEN GRADE ${g} / ENTRY POINT`,kicker:'CHAPTER 01 / DIFFERENT STARTING LINES',title:isA?'닫힌 문이 없는 사람':isD?'능력을 증명해도 닫힌 문':'경계선에 선 사람',copy:`<p>${gm.intro}</p><p>도시 전역에는 <strong>“등급은 공정하다”</strong>는 광고가 흐른다. 그러나 바로 앞의 현실은 그 말을 반박한다.</p>`,quote:gm.quote,question:gm.dilemma,choices:[{title:isA?'기업 후원 기록을 조사한다':isD?'합격 심사의 근거를 요구한다':'평가 기준을 조사한다',sub:'등급을 결정하는 진짜 규칙을 찾아본다',to:'signal',e:1,flag:'pursued_rules'},{title:isA?'부당하게 탈락한 시민에게 말을 건다':isD?'같은 처지의 지원자들을 모은다':'탈락한 동료의 이야기를 듣는다',sub:'차별을 겪는 사람들과 연결된다',to:'signal',s:2,flag:'met_citizens'}]};
if(state.stage==='signal')return {image:'people',tag:'CITIZEN ACCESS DIFFERENTIAL',kicker:'CHAPTER 02 / THE WALL BETWEEN US',title:'같은 점수, 다른 출구',copy:`<p>당신은 폐쇄된 공공 심사관에서 한 화면을 마주한다. A등급은 우선 통과, B등급은 재심사, D등급은 자동 제외.</p><p>${isA?'당신의 시민증은 경고 없이 통과하지만, 뒤따르던 D등급 시민의 출입문은 굳게 닫힌다.':isD?'당신 앞에서 또다시 문이 닫힌다. 같은 성적을 받은 A등급 시민은 홍채 검사도 없이 통과한다.':'당신은 조건부 통과 판정을 받는다. 당신의 친구는 D등급이라는 이유로 출입을 거절당한다.'}</p><p><strong>누군가의 자유는 특별 권한이 되고, 누군가의 권리는 금지 목록이 되었다.</strong> 익명의 내부 제보자가 심사 규칙을 볼 수 있는 통로를 알려준다.</p>`,quote:'“우리가 바꿔야 할 건 점수가 아니라, 점수 뒤의 규칙이에요.”',question:'어떻게 움직일까?',choices:[{title:'심사 서버에 접근해 규칙을 확인한다',sub:'자료를 직접 열어 부패를 추적한다',to:'audit',e:1,r:1,flag:'hacked_terminal'},{title:'차별받은 시민들의 증언을 기록한다',sub:'위험을 감수하고 시민 네트워크를 만든다',to:'audit',s:2,r:1,flag:'citizen_network'}]};
if(state.stage==='vault')return {image:'records',tag:'CLASSIFIED FINANCIAL NETWORK',kicker:'CHAPTER 04 / INSIDE THE MACHINE',title:'부패가 숨겨진 서버',copy:`<p>뉴서울 중심구역의 양자 데이터 센터. 투명 서버벽 너머에 두 종류의 파일이 떠 있다. <strong>상층 기업과 평가위원의 거래 기록</strong>, 그리고 <strong>등급별 자동 감점 알고리즘</strong>.</p><p>그때 공중에 붉은 경고가 뜬다. <strong>“비인가 접근 감지. 보안 드론 출동.”</strong> 이 중 한 파일을 먼저 내려받아야 한다.</p>`,quote:'“차별은 오류가 아니었어요. 누군가 돈을 받고 설계한 규칙이었어요.”',question:'어떤 자료를 먼저 조사할까?',choices:[{title:'평가위원 비밀 거래 기록을 연다',sub:'돈이 어떻게 권력을 유지했는지 추적한다',to:'vaultDoc',r:1,focus:'ledger'},{title:'등급 알고리즘 실행 로그를 연다',sub:'신분에 따른 자동 차별의 흔적을 확인한다',to:'vaultDoc',r:1,focus:'algorithm'}]};
if(state.stage==='crossroads')return {image:'confront',tag:'CIVOS SECURITY LEVEL / HIGH',kicker:'CHAPTER 05 / THE COST OF TRUTH',title:'당신에게 도착한 제안',copy:`<p>당신에게 상위 기업의 비밀 메시지가 도착한다. <strong>“이 자료를 넘기면 A등급과 상층 거주권을 보장하겠다.”</strong></p><p>같은 시각 시민 네트워크에서는 공개 청문회를 요구하고, 독립 기자들은 폭로 기사를 준비 중이다.</p><p>${g==='A'?'A등급인 당신에게는 특권을 잃을 위험이 있다.':g==='B'?'B등급인 당신에게는 어렵게 얻은 안정이 무너질 위험이 있다.':'D등급인 당신에게는 기회를 되찾을 희망과 보복당할 위험이 동시에 있다.'}</p><p>당신이 지금 무엇을 준비하느냐에 따라 마지막 결정의 결과가 달라진다.</p>`,quote:'“한 사람의 승격은 쉬워요. 모든 사람의 규칙을 바꾸는 일은 어렵죠.”',question:'마지막 행동을 준비하자.',choices:[{title:'증거를 여러 서버에 안전하게 백업한다',sub:'폭로가 쉽게 지워지지 않도록 한다',to:'finale',e:2,r:1,flag:'backup'},{title:'시민 공동회의를 조직한다',sub:'제도 변화에 필요한 연대를 모은다',to:'finale',s:3,r:1,flag:'assembly'},{title:'상층 기업의 비밀 협상에 응한다',sub:'안전을 확보하지만 감시가 높아진다',to:'finale',r:2,flag:'negotiation'}]};
if(state.stage==='finale')return {image:'confront',tag:'THREE FUTURES / ONE DECISION',kicker:'FINAL / YOUR DECISION',title:'당신의 자격은 무엇입니까?',copy:`<p>자정. 뉴서울 하층 구역과 상층 공중도시를 연결하는 스카이브리지에서 마지막 공지가 떠오른다.</p><p>당신이 모은 <strong>증거 ${state.evidence}</strong>, 시민의 힘 <strong>연대 ${state.solidarity}</strong>, 그리고 <strong>감시 위험 ${state.risk}</strong>. 지금까지의 행동은 최후의 선택이 어떤 결과를 낳을지 바꾸었다.</p><p>눈앞의 세 가지 미래 중 하나를 선택한다.</p>`,quote:'“내가 바꿀 수 있는 건 나의 자리일까, 아니면 자리를 나누는 규칙일까?”',question:'당신은 어떤 미래를 실행할 것인가?',choices:[{title:'A. 순응 — 비밀 제안을 받아들인다',sub:'개인의 기회는 얻지만 등급 제도는 유지된다',ending:'obey'},{title:'B. 폭로 — 자료를 도시 전체에 공개한다',sub:'증거가 충분할수록 조사와 제도 중단이 확산된다',ending:'expose'},{title:'C. 변화 — 시민들과 제도 개혁을 추진한다',sub:'증거와 연대가 충분해야 새로운 제도가 자리 잡는다',ending:'change'}]};
return null}
function sceneDoc(){let doc=DOCS[state.docFocus],audit=state.stage==='audit',name=doc.title;return `${hero('records',audit?'ACCESS / SCORING RULES':'ACCESS / CORPORATE ARCHIVE')}<div class="scene"><p class="kicker">${audit?'CHAPTER 03 / INVESTIGATE':'CHAPTER 04 / INVESTIGATE'}</p><h1>${audit?'누가 등급을 계산하는가':'숨겨진 결정적 자료'}</h1><div class="story-copy"><p>${audit?'익명의 제보자가 알려 준 시스템에 접속했다. 부정행위를 추측만으로 말해서는 권력층을 움직일 수 없다. 직접 기록을 읽어야 한다.':'드론의 탐지 범위가 점점 좁혀진다. 데이터 서버에 저장된 파일을 지금 열어 볼 수 있다.'}</p></div><div class="document-card"><div class="document-top">${doc.head}</div><div class="document-title">${name}</div><div class="document-body"><p>${doc.desc}</p></div><table class="data-table">${doc.rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</table><div class="alert"><span class="alert-heading">EVIDENCE DISCOVERED</span>${doc.foot}</div><button type="button" class="primary doc-action" data-action="collect" ${hasDoc(state.docFocus)?'disabled':''}>${hasDoc(state.docFocus)?'✓ 자료 확보 완료':'◈ 발견한 자료 확보하기'}</button></div><div class="buttons"><button type="button" class="secondary" data-action="doc-next" ${hasDoc(state.docFocus)?'':'disabled'}>${audit?'부패의 근원으로 이동 →':'추적을 피해 탈출 →'}</button></div><p class="tiny-note">자료를 확보해야 다음 장면으로 넘어갈 수 있습니다.</p></div>`}
function endingResult(){const ending=ENDINGS[state.ending],grade=state.grade,goodEvidence=state.evidence>=4,goodSolidarity=state.solidarity>=4,highRisk=state.risk>=5;
let headline,deck,sys,corrupt,citizen,after,remaining,personal;
if(state.ending==='obey'){
 headline='상층 거주권 특별 승인, 등급제는 그대로';deck='비밀 합의 후 시민 한 명이 승격했지만, 다른 시민의 입학·취업 제한은 여전히 유지된다.';
 sys='출신 배경에 따른 등급 평가 유지';corrupt='내부 거래 기록 비공개, 공식 조사 없음';citizen='D등급 지원자의 자동 탈락 계속';after='상층 기업은 비밀을 지킨 대가로 당신에게 특별 권한을 제공했다. 뉴서울에는 아무런 정책 변화가 일어나지 않았다.';
 remaining='개인의 성공이 모두에게 공정한 제도를 뜻하지는 않는다.';
 personal=grade==='A'?'당신은 원래 가졌던 특권을 지켰지만, 이제 그 대가를 알고 있다.':grade==='B'?'당신은 조건부 지위를 A로 바꾸었지만, 동료의 심사는 여전히 거절된다.':'당신은 예외적 승격을 허락받았지만, 다른 D등급 시민들은 같은 문 앞에 남았다.';
}else if(state.ending==='expose'){
 if(goodEvidence){headline='등급 평가 시스템 운영 일시 중단, 부패 조사 개시';deck='공개된 거래 기록과 알고리즘 로그가 대조되며 조작 정황이 확인됐다.';sys='조작 심사 중단 · 피해자 재심사 시작';corrupt='평가위원 공식 조사 · 상층 기업의 로비 수사';citizen='탈락자 구제 신청 접수, 시민들의 개혁 요구 확대';after='폭로 직후 도시 곳곳에서 시민들이 모였다. 정부는 일부 심사를 중단하고 피해 사례를 다시 검토하기 시작했다.';remaining='하지만 출신 배경을 등급에 반영하는 법은 아직 남아 있다. 폭로는 개혁의 시작일 뿐이다.'}
 else {headline='폭로 영상 확산, 권력층은 “조작된 자료”라 반박';deck='증거가 부족해 즉각적인 제도 중단은 이루어지지 않았다.';sys='등급 평가 유지 · 독립 검증 요구 증가';corrupt='거래 의혹 제기, 정식 수사 여부 미정';citizen='시민 시위와 온라인 논쟁 확산';after='도시의 홀로그램 뉴스에 폭로 내용이 뜨자 시민들은 의문을 품었다. 하지만 핵심 기록이 부족하자 권력층은 의혹을 부인했다.';remaining='진실을 알리는 용기와 그 진실을 입증하는 자료는 모두 중요하다.'}
 personal=grade==='A'?'폭로의 대가로 상층 사회에서 배척받았지만, 당신의 증언은 내부 고발의 문을 열었다.':grade==='B'?'당신의 조건부 지위는 재심사 대상이 되었지만, 도시의 동료들은 고마움을 전했다.':'D등급이었던 당신의 고발이 뉴서울 전역에 닿았다. 하지만 등급 제한이 완전히 사라진 것은 아니다.';
 if(highRisk){remaining+=' 높은 감시 위험으로 인해 제보자 보호 절차도 필요해졌다.'}
}else{
 if(goodEvidence&&goodSolidarity){headline='뉴서울, 출신 배경 자동등급제 폐지안 시행';deck='시민 공동회의와 부패 수사가 결합해 제도 개혁이 시작됐다.';sys='출신 배경 가중치 폐지 · 실력 중심 재심사';corrupt='시민 감사위원회 출범 · 재정 공개 의무';citizen='교육·취업 접근권 확대, 구역 이동 제한 완화';after='시민 대표와 독립 조사단이 함께 새 규칙을 만들었다. 새로운 율도 프로토콜은 누구나 출신보다 능력과 권리로 평가받게 한다.';remaining='새로운 제도도 부패하지 않도록 계속 감시해야 한다.'}
 else if(goodSolidarity||goodEvidence){headline='시민 개혁안 제출, 등급제 폐지 논쟁 본격화';deck='새 사회를 만들기 위한 연대가 시작됐지만, 시행까지는 더 많은 증거와 시민의 힘이 필요하다.';sys='등급제 개정안 심의 중 · 일부 시범사업';corrupt='독립 감시 조직 구성, 수사 요구 지속';citizen='피해 시민 공청회 시작 · 주거 이동권 논의';after='도시 곳곳에서 시민회의가 열렸다. 요구안은 시의회에 제출됐지만 상층 기업의 반대로 시행은 지연됐다.';remaining='바꾸겠다는 선언만으로 구조가 바뀌지는 않는다. 자료와 연대를 더 쌓아야 한다.'}
 else {headline='개혁 선언 후 상층의 반발, 제도는 유지';deck='소수의 목소리만으로는 거대한 등급 체계를 바꾸기 어려웠다.';sys='등급제 유지 · 개정 논의 보류';corrupt='비공식 문제 제기, 공식 조사 없음';citizen='작은 시민 모임 유지, 다음 행동 준비';after='당신의 선언은 소수의 시민들에게 용기를 주었다. 그러나 충분한 증거나 조직된 연대가 없어 뉴서울의 규칙은 그대로다.';remaining='희망을 현실로 만들려면 사람을 모으고 기록을 지켜야 한다.'}
 personal=grade==='A'?'당신은 가졌던 특권의 일부를 내려놓고 개혁 과정에 참여했다.':grade==='B'?'당신은 안정된 위치를 걸고 시민들의 대화와 제도 개혁에 참여했다.':'D등급이라는 이유로 닫혔던 문을 모두에게 열기 위해 행동했다.';
}
if(highRisk&&state.ending==='change'){remaining+=' CIVOS의 강한 감시 때문에 일부 시민 활동가가 조사를 받고 있어, 제보자 보호도 새 사회의 과제가 되었다.'}
if(highRisk&&state.ending==='obey'){remaining+=' 당신도 특별 승격 뒤 지속적인 감시 대상이 되었다.'}
const intro=`<p>${personal}</p><p>${after}</p>`;
return `${hero(ending.image,`ENDING ${ending.code} / ${ending.tag}`)}<div class="scene"><p class="kicker">THE FUTURE YOU CHOSE / ${ending.code}</p><h1>${ending.title}</h1><div class="story-copy">${intro}</div><div class="chip-row"><span class="chip">출발 등급 D</span><span class="chip">증거 ${state.evidence}</span><span class="chip">연대 ${state.solidarity}</span><span class="chip pink">감시 위험 ${state.risk}</span></div><div class="news-screen"><div class="news-header"><span>NEW SEOUL 2100 // 1 YEAR LATER</span><span class="news-live">LIVE</span></div><p class="news-mark">[긴급 뉴스 / 1년 후]</p><h2>${headline}</h2><p>${deck}</p></div><div class="news-detail"><div><b>사회 등급 제도</b><p>${sys}</p></div><div><b>권력층 부패</b><p>${corrupt}</p></div><div><b>시민의 삶</b><p>${citizen}</p></div></div><div class="dialogue">${remaining}</div><div class="final-question">“과거에는 서자라는 신분이 한 사람의 가능성을 가두었다. 2099년에는 누가, 어떤 기준으로 당신의 자격을 결정하는가?”</div><div class="buttons"><button class="primary" type="button" data-action="restart">다른 선택으로 다시 시작 ↻</button><button class="secondary" type="button" data-action="share">내가 선택한 미래 공유하기</button></div><p class="tiny-note">홍길동이 꿈꾼 율도국처럼, 공정한 사회는 누군가의 힘만으로 완성되지 않습니다.</p></div>`}
function render(){const isIntro=state.stage==='intro'||introPreview;
 let content,chapter=0,chapterTitle='SYSTEM BOOT';
 if(isIntro)content=screenIntro();
 else if(state.stage==='reveal'){content=screenReveal();chapter=0;chapterTitle='IDENTITY / REVEALED'}
 else if(state.stage==='audit'||state.stage==='vaultDoc'){content=sceneDoc();chapter=state.stage==='audit'?3:4;chapterTitle=state.stage==='audit'?'DATA ACCESS / AUDIT':'DATA ACCESS / SERVER'}
 else if(state.stage==='ending'){content=endingResult();chapter=6;chapterTitle='ENDING / ONE YEAR LATER'}
 else{const d=sceneData();if(d){chapter={origin:1,signal:2,vault:4,crossroads:5,finale:6}[state.stage]||0;chapterTitle=d.kicker;content=outer(d.image,d.tag,d.kicker,d.title,d.copy,d.quote,d.question,d.choices)}else content=screenIntro()}
 $('story').innerHTML=content;
 $('chapterName').textContent=chapterTitle;
 $('chapterCount').textContent=`${String(chapter).padStart(2,'0')} / 06`;
 $('progressBar').style.width=`${(chapter/6)*100}%`;
 $('clueCount').textContent=state.documents.length;
 $('gradeMini').textContent=state.grade?`CITIZEN PROFILE: GRADE ${state.grade}`:'CITIZEN PROFILE: UNASSIGNED';
 $('rankBig').textContent=state.grade||'—';$('rankBig').className='rank '+(state.grade?'grade-'+state.grade.toLowerCase():'');
 $('rankDesc').textContent=state.grade?GRADE_META[state.grade].name:'등급 판정 대기 중';
 for(const [n,v,b] of [['evidence','evidenceVal','evidenceMeter'],['solidarity','solidarityVal','solidarityMeter'],['risk','riskVal','riskMeter']]){$(v).textContent=state[n];$(b).style.width=`${state[n]/MAX*100}%`}
 $('sideNote').textContent=state.stage==='ending'?'“선택은 사회의 미래에 무엇을 남겼는가?”':state.risk>=5?'“감시가 강화되었습니다. 하지만 진실도 가까워졌습니다.”':'“과거의 신분제는 정말 사라졌을까?”';
}
function toTop(){if(window.scrollY>160)window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'})}
function go(next){state.stage=next;state.played=true;save();render();toTop()}
function assign(){state=base();state.grade='D';state.played=true;sfx('open');go('reveal')}
function choose(n){const d=sceneData(),c=d?.choices[n];if(!c)return;
 update(c.e||0,c.s||0,c.r||0);if(c.flag)remember(c.flag);
 state.history.push({scene:state.stage,choice:c.title});
 if(c.focus)state.docFocus=c.focus;
 if(c.ending){state.ending=c.ending;go('ending');sfx('end')}else{go(c.to);sfx(c.r?'alert':'select')}
 if(c.r&&state.risk>=4)pop('CIVOS 감시 위험도 상승 · 신중하게 행동하세요');
}
function collect(){const id=state.docFocus,doc=DOCS[id];if(!doc||hasDoc(id))return;state.documents.push(id);update(doc.gain,0,1);save();render();sfx('success');pop(`✓ 자료 확보 완료: ${doc.title}`)}
function docNext(){if(!hasDoc(state.docFocus))return;if(state.stage==='audit'){go('vault');sfx('select')}else if(state.stage==='vaultDoc'){go('crossroads');sfx('alert')}}
function musicUI(){$('musicBtn').setAttribute('aria-pressed',String(musicOn));$('musicLabel').textContent=musicOn?'음악 끄기':'음악 켜기'}
function musicToggle(){const a=$('bgm');if(musicOn){a.pause();musicOn=false}else{a.volume=.38;const play=a.play();if(play?.catch)play.catch(()=>pop('브라우저에서 음악 재생을 허용해 주세요'));musicOn=true;sfx('open')}musicUI()}
function sfx(type){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;audioCtx ||= new AC();if(audioCtx.state==='suspended')audioCtx.resume();const t=audioCtx.currentTime;const map={open:[320,450,.16],select:[560,730,.10],alert:[220,145,.22],success:[480,780,.19],end:[220,440,.3]};const [f1,f2,len]=map[type]||map.select;const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(Math.max(1,f2),t+len);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.035,t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+len);o.connect(g).connect(audioCtx.destination);o.start(t);o.stop(t+len+.01)}catch(_){}}
function pop(msg){const t=$('toast');t.textContent=msg;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),2700)}
function openJournal(){const entries=state.documents.map(id=>`<div class="doc-line"><small>${DOCS[id].head}</small><h3>${DOCS[id].title}</h3><p>${DOCS[id].desc}</p><p><b>${DOCS[id].foot}</b></p></div>`).join('');$('modalTitle').textContent=`자료 보관함 · ${state.documents.length}건`;$('modalBody').innerHTML=`<p class="tiny-note">게임에서 직접 확보한 증거만 여기에 기록됩니다.</p><div class="doc-grid">${entries||'<p class="tiny-note">아직 확보한 자료가 없습니다. 사건을 조사하고 자료를 저장해 보세요.</p>'}</div>`;$('docModal').hidden=false;$('closeModal').focus();document.body.style.overflow='hidden'}
function closeJournal(){$('docModal').hidden=true;document.body.style.overflow='';$('journalBtn').focus()}
function restart(){if(!confirm('현재 진행 상황을 지우고 다시 D등급 시민으로 시작할까요? 기존 진행 기록은 지워집니다.'))return;state=base();introPreview=false;save();render();sfx('open');toTop()}
async function share(){if(state.stage!=='ending')return;const e=ENDINGS[state.ending];const text=`《당신의 자격은 무엇입니까?》\n내 출발 등급: D\n내 선택: ${e.tag}\n${e.title}\n증거 ${state.evidence} · 연대 ${state.solidarity}\n${location.protocol.startsWith('http')?location.origin+location.pathname:''}`;if(navigator.share){try{await navigator.share({title:'당신의 자격은 무엇입니까?',text});return}catch(e){if(e.name==='AbortError')return}}try{await navigator.clipboard.writeText(text);pop('결말이 복사됐어요!')}catch(_){pop('공유가 지원되지 않는 브라우저입니다')}}
$('story').addEventListener('click',e=>{const c=e.target.closest('[data-choice]');if(c&&!c.disabled){choose(Number(c.dataset.choice));return}const a=e.target.closest('[data-action]');if(!a||a.disabled)return;switch(a.dataset.action){case 'assign':introPreview=false;assign();break;case 'continue':go('origin');sfx('select');break;case 'collect':collect();break;case 'doc-next':docNext();break;case 'restart':restart();break;case 'share':share();break}});
$('journalBtn').addEventListener('click',openJournal);$('closeModal').addEventListener('click',closeJournal);$('docModal').addEventListener('click',e=>{if(e.target===$('docModal'))closeJournal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('docModal').hidden)closeJournal()});$('musicBtn').addEventListener('click',musicToggle);$('resetBtn').addEventListener('click',restart);$('homeLink').addEventListener('click',e=>{e.preventDefault();introPreview=true;render();toTop()});musicUI();render();
})();
