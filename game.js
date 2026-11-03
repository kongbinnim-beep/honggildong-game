/* 홍길동전: 지워진 이름들 — QR 접속용 모바일 스토리 게임
   라이브러리·서버 없이 실행되는 순수 JavaScript입니다.
   이야기를 수정하려면 SCENES, ENDINGS, ITEMS를 편집하세요. */
(() => {
  'use strict';

  const STORAGE_KEY = 'honggildong-erased-names-v1';
  const MAX_SCORE = 8;
  const ITEMS = {
    ration: { name: '빈 배급표', desc: '쌀을 받을 자격이 있다는 인장이 있지만, 주인의 이름만 칼로 도려낸 종이. 누군가 사람을 기록에서 지우고 있다.' },
    token: { name: '위조된 출입패', desc: '관아의 문지기만 가진다는 패. 뒷면에는 부호의 가문 문장이 찍혀 있다.' },
    letter: { name: '찢어진 편지', desc: '“호적에서 이름을 없애면 곡식도 함께 사라진다.” 수령의 심복이 남긴 명령 일부.' },
    witness: { name: '서리의 증언', desc: '낮은 신분이라는 이유로 거짓 장부를 쓰도록 협박받은 서리의 진술. 그의 용기에는 보호가 필요하다.' },
    ledger: { name: '비밀 곡물 장부', desc: '백성에게 지급할 곡식이 권세가의 창고로 옮겨진 날짜와 수량이 적혀 있다.' },
    seal: { name: '수령의 붉은 인장', desc: '불법 명령서의 진위를 밝힐 수 있는 관인. 겉으론 나라의 권위, 실은 누군가의 탐욕을 나타낸다.' },
    names: { name: '사라진 이름 목록', desc: '가난하다는 이유로 호적에서 지워진 백성 37명의 이름. 이 숫자 뒤에는 한 사람씩의 삶이 있다.' },
    testimony: { name: '마을 사람들의 연서', desc: '서로 다른 신분의 사람들이 한 장의 종이에 자신의 이름을 적었다. 거짓보다 큰 힘을 가진 진실의 증거.' },
  };

  const defaultState = () => ({ scene: 'intro', evidence: 0, solidarity: 0, anger: 0, items: [], flags: [], history: [], played: false });
  let state;
  let homePreview = false;
  let soundOn = true;
  let audioContext = null;
  let toastTimer = null;
  let bgm;

  const $ = id => document.getElementById(id);
  const view = $('gameView');
  bgm = $('bgmAudio');
  const clamp = value => Math.max(0, Math.min(MAX_SCORE, value));
  const has = id => state.items.includes(id);
  const flag = id => state.flags.includes(id);

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data && typeof data.scene === 'string' && Array.isArray(data.items) && Array.isArray(data.flags) && Array.isArray(data.history)
          && ['intro', 'gate', 'market_help', 'market_chase', 'hideout', 'archive', 'jail', 'assembly', 'palace', 'bridge', 'finale', ...Object.keys(ENDINGS)].includes(data.scene)) {
        return { ...defaultState(), ...data, evidence: clamp(Number(data.evidence) || 0), solidarity: clamp(Number(data.solidarity) || 0), anger: clamp(Number(data.anger) || 0) };
      }
    } catch (_) { /* 프라이빗 브라우징 등 저장이 불가능한 경우에도 플레이 가능 */ }
    return defaultState();
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {} }

  const SCENES = {
    gate: {
      chapter: 1, section: '첫 번째 밤 · 성문 앞', art: '門', theme: 'market', title: '이름을 잃은 아이',
      prose: () => `<p>달이 뜨자 도성의 성문이 닫힌다. 소년 하나가 배급소 앞에서 끌려 나온다. 종이에 분명 이름이 적혀 있었지만, 관리는 먹으로 덮어버렸다.</p><p>“<strong>호적에 이름이 없으면, 이 나라의 백성도 아니다.</strong>”</p><p>그 순간 한 관리가 검은 보자기를 품에 안고 골목으로 달아난다. 사람을 먼저 구할 것인가, 단서를 먼저 쫓을 것인가.</p>`,
      dialogue: '“형님, 내 이름은 어디로 간 걸까요?”',
      question: '홍길동, 첫 발걸음을 정하라.',
      choices: [
        { title: '아이를 일으켜 세운다', sub: '지금 여기서 지워진 사람을 외면하지 않는다', next: 'market_help', effects: { solidarity: 2 }, item: 'ration', flag: 'helped_child' },
        { title: '검은 보자기를 든 관리를 쫓는다', sub: '이 일을 꾸민 자의 흔적부터 찾는다', next: 'market_chase', effects: { evidence: 1 }, item: 'token', flag: 'chased_clerk' }
      ]
    },
    market_help: {
      chapter: 2, section: '두 번째 장 · 저잣거리', art: '人', theme: 'market', title: '한 사람의 이름',
      prose: () => `<p>아이의 이름은 ‘연’이다. 어머니가 병들자 연은 곡식을 받으러 왔다. 하지만 관리는 그 가족이 호적에서 사라졌다고 했다.</p><p>주변 사람들은 고개를 돌린다. 자신도 다음 차례가 될 수 있다는 걸 알기 때문이다.</p><p>연이 떨리는 손으로 낡은 종이 한 장을 건넨다. 그곳에는 <strong>관리의 붉은 인장 아래 도려낸 이름</strong>이 남아 있다.</p>`,
      dialogue: '“저 하나를 도와주셔도, 내일은 다른 사람이 지워질 거예요.”',
      question: '사람들 앞에서 무엇을 할까?',
      choices: [
        { title: '주변 상인들에게 함께 증언해 달라고 청한다', sub: '두려움을 나눌 사람을 모은다', next: 'hideout', effects: { solidarity: 1 }, flag: 'market_witnesses' },
        { title: '연의 종이를 들고 관아의 명령을 추궁한다', sub: '눈앞의 부당함을 공개적으로 고발한다', next: 'hideout', effects: { evidence: 1, anger: 1 }, item: 'letter', flag: 'public_protest' }
      ]
    },
    market_chase: {
      chapter: 2, section: '두 번째 장 · 뒷골목', art: '影', theme: 'market', title: '침묵의 값',
      prose: () => `<p>보자기 속에는 관아 문서와 비밀 출입패가 있었다. 관리는 길동에게 들키자 담벼락에 주저앉는다.</p><p>그는 수령의 명령을 받아 가난한 집의 이름을 호적에서 지웠다고 털어놓는다. 이름이 지워진 수만큼 배급 곡식은 권세가에게 흘러간다.</p>`,
      dialogue: '“저도 시키는 대로 하지 않으면 가족이 쫓겨납니다.”',
      question: '겁먹은 관리에게 어떻게 답할까?',
      choices: [
        { title: '그의 가족을 지켜주겠다고 약속한다', sub: '침묵을 깨는 데 필요한 것은 보호다', next: 'hideout', effects: { solidarity: 2, evidence: 1 }, item: 'witness', flag: 'protected_clerk' },
        { title: '명령서만 빼앗고 그를 보내준다', sub: '진상을 밝힐 기록을 먼저 확보한다', next: 'hideout', effects: { evidence: 2, anger: 1 }, item: 'letter', flag: 'took_order' }
      ]
    },
    hideout: {
      chapter: 3, section: '세 번째 장 · 활빈당 은신처', art: '義', theme: 'archive', title: '정의는 누구의 것인가',
      prose: () => `<p>활빈당 동료들이 지도 위에 등불을 놓는다. 가난한 사람의 이름을 지우고 곡식을 빼돌리는 수령. 그러나 손에 든 기록만으로는 모든 진실을 입증하기 어렵다.</p><p>${flag('helped_child') ? '연의 얼굴이 자꾸 떠오른다. 한 사람의 굶주림은 장부 밖에서 시작되지 않았다.' : '도망친 관리의 눈빛이 자꾸 떠오른다. 악한 명령 아래에서도 누군가는 두려움에 떨고 있었다.'}</p><p>관아의 <strong>곡물 장부</strong>가 보관된 서고와 거짓 문서를 쓴 <strong>하급 서리</strong>가 갇힌 옥사. 둘 중 한 곳만 먼저 갈 수 있다.</p>`,
      dialogue: '“기록을 구해야 할까요, 기록을 쓴 사람을 구해야 할까요?”',
      question: '어디로 향할까?',
      choices: [
        { title: '서고로 잠입해 장부를 찾는다', sub: '권력의 거짓을 숫자와 기록으로 증명한다', next: 'archive', effects: { evidence: 1 }, flag: 'archive_route' },
        { title: '옥사로 가서 서리의 증언을 듣는다', sub: '진실을 아는 사람을 먼저 지킨다', next: 'jail', effects: { solidarity: 1 }, flag: 'jail_route' }
      ]
    },
    archive: {
      chapter: 4, section: '네 번째 장 · 관아 서고', art: '錄', theme: 'archive', title: '숫자 속의 비명',
      prose: () => `<p>촛불 아래 펼친 장부에는 낯선 숫자가 빼곡하다. 실제로 나눠준 곡식은 적고, 관리의 친척에게 옮겨간 곡식은 많다.</p><p>서고 문밖에서 발걸음 소리가 들린다. 장부를 가져갈 시간은 짧다. 곁에는 사람들의 이름을 지운 명부도 놓여 있다.</p>`,
      dialogue: '“한 줄의 숫자가, 한 집의 겨울을 빼앗았다.”',
      question: '무엇을 먼저 지킬까?',
      choices: [
        { title: '장부를 품에 숨겨 나온다', sub: '조작된 배급과 수령의 횡령을 입증한다', next: 'assembly', effects: { evidence: 2 }, item: 'ledger', flag: 'got_ledger' },
        { title: '지워진 이름들을 옮겨 적는다', sub: '숫자보다 먼저 사람을 되찾는다', next: 'assembly', effects: { evidence: 1, solidarity: 2 }, item: 'names', flag: 'got_names' },
        { title: '서고의 봉인을 부수고 문서를 마을에 뿌린다', sub: '진실을 감추지 못하게 만들되 혼란을 감수한다', next: 'assembly', effects: { evidence: 1, anger: 2 }, item: 'letter', flag: 'broke_seal' }
      ]
    },
    jail: {
      chapter: 4, section: '네 번째 장 · 관아 옥사', art: '聲', theme: 'archive', title: '증언할 용기',
      prose: () => `<p>차가운 옥사에서 젊은 서리 ‘소담’을 만난다. 그는 양반의 명령에 따라 백성 37명의 이름을 호적에서 지웠다고 고백한다.</p><p>소담은 장부의 위치도 알고 있다. 하지만 문밖에는 감시병이 있다. 소담을 데리고 나가면 기록까지 모두 옮길 수는 없다.</p>`,
      dialogue: '“제가 진실을 말하면, 저를 지켜주실 건가요?”',
      question: '소담에게 어떤 선택을 권할까?',
      choices: [
        { title: '소담과 함께 탈출한다', sub: '살아 있는 증언자를 보호한다', next: 'assembly', effects: { solidarity: 2, evidence: 1 }, item: 'witness', flag: 'rescued_sodam' },
        { title: '소담의 증언을 기록하고 장부 조각을 챙긴다', sub: '위험하지만 결정적인 증거를 남긴다', next: 'assembly', effects: { evidence: 2 }, item: 'ledger', flag: 'recorded_sodam' },
        { title: '감시병을 위협해 감옥 문을 모두 연다', sub: '억압받은 사람들의 분노를 행동으로 옮긴다', next: 'assembly', effects: { solidarity: 1, anger: 2 }, item: 'names', flag: 'opened_jail' }
      ]
    },
    assembly: {
      chapter: 5, section: '다섯 번째 장 · 마을의 밤', art: '衆', theme: 'court', title: '혼자가 아닌 목소리',
      prose: () => `<p>밤중에 마을 사람들을 모았다. 누군가는 신분이 낮아 발언할 수 없었고, 누군가는 권력자의 보복을 두려워했다.</p><p>길동은 지금까지 얻은 ${state.items.length}개의 단서를 펼쳐 놓는다. 하지만 문서가 저절로 정의가 되지는 않는다. 그 문서를 믿고 <strong>함께 서 줄 사람</strong>이 필요하다.</p>`,
      dialogue: '“우리가 서로의 이름을 부르지 않으면, 저들은 또 우리를 지울 겁니다.”',
      question: '마을 사람들과 무엇을 약속할까?',
      choices: [
        { title: '모두의 이름을 적은 연서를 만든다', sub: '신분이 달라도 같은 목소리로 증언한다', next: 'palace', effects: { solidarity: 2, evidence: 1 }, item: 'testimony', flag: 'made_petition' },
        { title: '증거를 복사해 여러 마을에 숨긴다', sub: '진실이 한 사람과 함께 사라지지 않게 한다', next: 'palace', effects: { evidence: 2, solidarity: 1 }, flag: 'copied_evidence' },
        { title: '횃불을 들고 관아로 행진한다', sub: '더는 침묵하지 않겠다고 선언한다', next: 'bridge', effects: { anger: 2, solidarity: 1 }, flag: 'torch_march' }
      ]
    },
    palace: {
      chapter: 6, section: '여섯 번째 장 · 수령의 잔치', art: '權', theme: 'court', title: '권력의 식탁',
      prose: () => `<p>수령은 백성이 굶주린 밤에도 잔치를 연다. 흰 쌀밥과 비단 옷, 금으로 칠한 잔. 문밖의 사람들은 빈 그릇을 들고 기다린다.</p><p>수령이 길동을 알아보고 웃는다. “네가 아무리 이름을 불러도 나라의 법은 바뀌지 않는다.”</p><p>${state.evidence >= 4 ? '당신의 품에는 부정할 수 없는 기록들이 있다.' : '손에 쥔 진실은 아직 빈틈이 있지만, 거짓이라는 확신만은 분명하다.'}</p>`,
      dialogue: '“법을 가진 자가 옳은 것인가, 사람을 지키는 법이 옳은 것인가?”',
      question: '마지막 한 수를 준비하라.',
      choices: [
        { title: '수령의 인장을 빼앗고 명령서를 대조한다', sub: '부패의 결정적 연결 고리를 확보한다', next: 'finale', effects: { evidence: 2, anger: 1 }, item: 'seal', flag: 'seized_seal' },
        { title: '잔치 문을 열고 백성들의 증언을 듣게 한다', sub: '권력이 감춘 얼굴들을 세상 앞에 세운다', next: 'finale', effects: { solidarity: 2, evidence: 1 }, flag: 'opened_hall' },
        { title: '수령에게 물러날 마지막 기회를 준다', sub: '피를 흘리지 않고 책임을 묻는다', next: 'finale', effects: { evidence: 1, solidarity: 1 }, flag: 'offered_choice' }
      ]
    },
    bridge: {
      chapter: 6, section: '여섯 번째 장 · 돌다리 위', art: '火', theme: 'court', title: '불길의 방향',
      prose: () => `<p>관아로 향하는 다리 위에서 백성들이 횃불을 들어 올린다. 누군가는 잃어버린 곡식을, 누군가는 사라진 가족의 이름을 외친다.</p><p>군사들이 창을 겨눈다. 첫 돌이 날아가면 밤은 다시 돌이킬 수 없을 것이다.</p>`,
      dialogue: '“분노는 우리를 모았지만, 내일을 만들 수 있을까요?”',
      question: '횃불 앞에서 무엇을 외칠까?',
      choices: [
        { title: '창 대신 증거를 높이 들라고 외친다', sub: '분노를 공개적인 고발로 바꾼다', next: 'finale', effects: { evidence: 2, solidarity: 1 }, flag: 'raised_documents' },
        { title: '어린아이와 노인을 뒤로 보내고 행진한다', sub: '먼저 서로를 보호한다', next: 'finale', effects: { solidarity: 2, anger: 1 }, flag: 'protected_crowd' },
        { title: '관아의 문을 무너뜨린다', sub: '오늘 밤, 강제로라도 억압을 끝낸다', next: 'finale', effects: { anger: 2 }, flag: 'stormed_gate' }
      ]
    },
    finale: {
      chapter: 7, section: '마지막 장 · 이름의 새벽', art: '名', theme: 'ending', title: '당신이 남길 이름',
      prose: () => `<p>동이 트기 직전, 사람들의 시선이 길동에게 모인다.</p><p>증거는 <strong>${state.evidence}</strong>, 함께 서는 사람들의 힘은 <strong>${state.solidarity}</strong>, 분노의 불길은 <strong>${state.anger}</strong>.</p><p>어떤 길에는 충분한 준비가 필요하다. 지금까지 해 온 선택이 마지막 선택의 가능성을 바꾸었다. 그러나 <strong>무엇을 정의라고 부를지는 당신의 몫</strong>이다.</p>`,
      dialogue: '“길동아. 네 이름이 아니라, 우리 이름을 남겨다오.”',
      question: '당신은 어떤 결말을 선택할 것인가?',
      choices: [
        { title: '공개 재판을 열어 호적을 바로잡는다', sub: '증거 4 · 연대 4 이상 필요', next: 'reform', enabled: () => state.evidence >= 4 && state.solidarity >= 4, lock: '증거 4, 연대 4가 필요합니다.' },
        { title: '백성들 스스로 새 명부를 만든다', sub: '연대 5 이상 필요', next: 'community', enabled: () => state.solidarity >= 5, lock: '연대 5가 필요합니다.' },
        { title: '활빈당과 함께 관아를 무너뜨린다', sub: '분노 4 이상 필요', next: 'uprising', enabled: () => state.anger >= 4, lock: '분노 4가 필요합니다.' },
        { title: '증거를 세상에 퍼뜨리고 수령을 고발한다', sub: '증거 3 이상 필요', next: 'exposure', enabled: () => state.evidence >= 3, lock: '증거 3이 필요합니다.' },
        { title: '수령과 거래하여 당장의 굶주림을 멈춘다', sub: '언제든 선택 가능 · 대가가 따른다', next: 'bargain' }
      ]
    }
  };

  const ENDINGS = {
    reform: { number: 'ENDING 01 / 05', name: '지워진 이름을 되찾은 새벽', art: '春', quote: '“나라의 주인은 기록을 지우는 자가 아니라, 서로의 이름을 지키는 사람이다.”',
      text: `<p>길동은 백성들의 연서와 확보한 증거를 들고 공개 재판을 요구한다. 수령의 횡령이 드러나고, 호적에서 지워진 이름들이 하나씩 복구된다.</p><p>모든 차별이 하루 만에 사라지지는 않는다. 그러나 이제 누구도 신분만으로 증언을 빼앗기지 않도록 마을 사람들이 감시 모임을 세운다.</p><p><strong>영웅 한 사람의 승리보다 오래가는 것은, 함께 만든 제도와 약속이다.</strong></p>`, result: '제도를 바꾸는 일은 증거와 연대가 함께할 때 가능했다.', theme: '제도적 정의 · 연대 · 사회적 책임' },
    community: { number: 'ENDING 02 / 05', name: '우리가 쓰는 호적', art: '同', quote: '“종이에 적히지 않았어도, 우리는 서로를 안다.”',
      text: `<p>길동과 백성들은 관아의 허락을 기다리지 않는다. 마을의 빈 창고를 열어 식량을 나누고, 신분을 묻지 않는 새 명부를 만든다.</p><p>수령은 여전히 높은 자리에 있지만, 사람들이 서로의 존재를 증명하기 시작하자 그의 명령은 예전만큼 통하지 않는다.</p><p><strong>큰 권력이 움직이지 않을 때에도, 작은 공동체는 변화를 시작할 수 있다.</strong></p>`, result: '가장 튼튼한 기록은 서로를 기억하는 사람들이었다.', theme: '공동체 · 상호 돌봄 · 아래로부터의 변화' },
    uprising: { number: 'ENDING 03 / 05', name: '불타는 관아, 남겨진 질문', art: '焰', quote: '“문은 무너졌다. 그러나 그다음 문을 누가 세울 것인가?”',
      text: `<p>활빈당의 함성과 함께 관아의 문이 무너진다. 수령은 달아나고 곡식 창고가 열려 사람들은 처음으로 배불리 먹는다.</p><p>하지만 혼란 속에서 일부 기록도 사라진다. 분노가 가라앉자 백성들은 묻기 시작한다. 누가 다음 결정을 내릴 것인가. 권력은 다시 누구에게 모일 것인가.</p><p><strong>불의에 맞서는 용기는 필요하다. 그러나 정의를 지켜 낼 규칙은 또 다른 노력으로 만들어야 한다.</strong></p>`, result: '억압을 끝낸 힘이 새 억압이 되지 않도록 경계해야 했다.', theme: '저항 · 권력의 순환 · 책임' },
    exposure: { number: 'ENDING 04 / 05', name: '성문 밖으로 퍼진 진실', art: '文', quote: '“한 장의 문서가 바람을 타고 여러 사람의 입이 되었다.”',
      text: `<p>길동은 수령의 장부와 증언을 여러 고을에 퍼뜨린다. 관아는 문서를 거짓이라 주장하지만, 같은 일을 겪은 사람들이 곳곳에서 나타난다.</p><p>수령의 처벌은 아직 정해지지 않았다. 호적도 모두 복구되지는 못했다. 그래도 이제 진실은 한 사람의 손에서 빼앗아 없앨 수 없게 되었다.</p><p><strong>부패를 드러내는 일은 정의의 끝이 아니라, 정의를 요구할 출발점이다.</strong></p>`, result: '진실은 밝혀졌지만 그 이후를 바꿀 연대가 더 필요했다.', theme: '고발 · 언론과 기록 · 시민의 감시' },
    bargain: { number: 'ENDING 05 / 05', name: '반쪽짜리 아침', art: '半', quote: '“오늘은 배불렀다. 그러나 내일의 이름은 누가 지킬까?”',
      text: `<p>수령은 빼돌린 곡식의 일부를 돌려주고, 길동은 당장의 약속을 받아들인다. 굶주린 아이들은 밥을 먹는다. 사람들은 잠시 안도한다.</p><p>하지만 이름을 지운 명령과 차별의 규칙은 그대로다. 수령의 자리를 지키는 대가로 일부 진실이 봉인된다.</p><p><strong>눈앞의 고통을 줄이는 선택에도 의미는 있다. 다만 잘못된 구조를 남겨 두면 같은 고통은 되풀이될 수 있다.</strong></p>`, result: '당장의 구원과 오래가는 정의 사이의 어려운 선택이 남았다.', theme: '타협 · 구조적 문제 · 장기적 책임' }
  };

  // MBTI처럼 선택 결과를 요약하는 이야기 속 신분 유형 (실제 신분 판정이 아닙니다).

  const ARTWORK = {
    intro: { src: 'assets/scene_intro.jpg', label: 'MOONLIT CITY · 시작의 밤' },
    gate: { src: 'assets/scene_market.jpg', label: 'GATE OF NAMES · 지워진 이름' },
    market_help: { src: 'assets/scene_market.jpg', label: 'RATIONS · 배급과 차별' },
    market_chase: { src: 'assets/scene_market.jpg', label: 'RATIONS · 배급과 차별' },
    hideout: { src: 'assets/scene_intro.jpg', label: 'HIDEOUT · 숨겨진 결심' },
    archive: { src: 'assets/scene_archive.jpg', label: 'ARCHIVE · 감춰진 기록' },
    jail: { src: 'assets/scene_archive.jpg', label: 'TESTIMONY · 증언의 밤' },
    assembly: { src: 'assets/scene_confrontation.jpg', label: 'ASSEMBLY · 함께 서는 사람들' },
    palace: { src: 'assets/scene_confrontation.jpg', label: 'PALACE · 권력의 식탁' },
    bridge: { src: 'assets/scene_confrontation.jpg', label: 'BRIDGE · 저항의 문턱' },
    finale: { src: 'assets/scene_confrontation.jpg', label: 'FINAL CHOICE · 이름의 새벽' },
    reform: { src: 'assets/scene_hope.jpg', label: 'NEW DAWN · 바뀐 세상' },
    community: { src: 'assets/scene_hope.jpg', label: 'COMMUNITY · 함께 쓴 명부' },
    uprising: { src: 'assets/scene_confrontation.jpg', label: 'UPRISING · 불타는 질문' },
    exposure: { src: 'assets/scene_archive.jpg', label: 'EXPOSURE · 퍼져 나간 진실' },
    bargain: { src: 'assets/scene_market.jpg', label: 'BARGAIN · 반쪽짜리 아침' },
  };

  const IDENTITIES = {
    reform: { code: 'JUSTICE', title: '새 시대를 여는 개혁가', role: '정의로운 시민', symbol: '⚖', summary: '당신은 눈앞의 승리보다 모두에게 적용되는 공정한 규칙을 택했습니다.', strengths: ['원칙을 지키는 용기', '증거로 설득하는 힘', '함께 바꾸는 리더십'], caution: '좋은 제도도 사람들이 계속 감시해야 지켜집니다.' },
    community: { code: 'SOLIDARITY', title: '사람을 지키는 공동체의 수호자', role: '선량한 시민', symbol: '✦', summary: '당신은 높은 자리의 허락을 기다리기보다 곁에 있는 사람의 손을 잡았습니다.', strengths: ['따뜻한 연대', '실천하는 배려', '모두를 품는 태도'], caution: '서로를 돌보면서도 차별의 근본적인 규칙을 고치는 일을 잊지 마세요.' },
    uprising: { code: 'RESISTANCE', title: '불의를 깨뜨리는 저항가', role: '용감한 의적', symbol: '🔥', summary: '당신은 부당한 권력 앞에서 물러서지 않고 변화를 위해 행동했습니다.', strengths: ['두려움 없는 용기', '빠른 결단', '불의에 맞서는 행동력'], caution: '무너뜨린 권력 자리에 또 다른 억압이 들어서지 않도록 살펴야 합니다.' },
    exposure: { code: 'TRUTH', title: '침묵을 깨는 진실의 기록자', role: '깨어 있는 시민', symbol: '✎', summary: '당신은 지워진 목소리를 모아 누구도 숨길 수 없는 진실로 만들었습니다.', strengths: ['날카로운 관찰', '흔들리지 않는 양심', '진실을 전하는 힘'], caution: '진실을 알리는 일 다음에는 실제 변화를 만드는 연대가 필요합니다.' },
    bargain: { code: 'COMPROMISE', title: '권력의 그늘에 머문 생존자', role: '권력에 얽매인 백성', symbol: '◈', summary: '당신은 당장의 굶주림을 해결했지만, 권력이 만든 신분의 벽을 허물지는 못했습니다.', strengths: ['현실을 읽는 눈', '위기를 넘기는 판단', '눈앞의 고통에 대한 공감'], caution: '살아남기 위한 타협은 이해할 수 있지만, 침묵이 길어지면 지배가 굳어질 수 있습니다.' }
  };

  state = load();

  function safeStr(v) { return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function sceneArt(symbol, theme = '', key = state.scene) {
    const art = ARTWORK[key] || ARTWORK.intro;
    return `<figure class="scene-art art-${theme}" aria-hidden="true"><img class="scene-illustration" src="${art.src}" alt=""><div class="scene-art-copy"><div><span class="art-small">${art.label}</span><div class="hero-caption">신분과 권력에 맞서는 이야기</div></div><span class="art-symbol">${symbol}</span><span class="art-stamp">活貧</span></div></figure>`;
  }
  function renderIntro() {
    const canResume = state.played && state.scene !== 'intro';
    return `${sceneArt('洪', '', 'intro')}<div class="scene-body intro-copy game-view-enter"><div class="scene-kicker"><span class="eyebrow">INTERACTIVE STORY · 조선의 또 다른 밤</span></div><h1 class="scene-title">홍길동전:<br>지워진 이름들</h1><div class="intro-quote">“아버지를 아버지라 부르지 못하던 시대,
이제는 백성이 자신의 이름마저 부르지 못한다.”</div><div class="scene-prose"><p>신분과 권력 때문에 삶을 빼앗긴 사람들 사이에서, 당신은 홍길동이 되어 지워진 이름들을 다시 불러내야 합니다.</p><p>누군가를 먼저 구할지, 진실의 단서를 먼저 붙잡을지에 따라 이야기와 결말이 달라집니다.</p></div><div class="intro-meta"><span>⏳ 약 5–8분</span><span>◆ 선택형 스토리</span><span>◇ 다섯 가지 신분 결과</span></div><div class="intro-tip">상단의 <b>음악 끄기/켜기</b> 버튼으로 배경 음악을 조절할 수 있어요. 모바일에서는 첫 터치 후 음악이 재생됩니다.</div><div class="intro-actions"><button class="primary-btn" type="button" data-action="start">${canResume ? '새로운 이야기 시작하기' : '이야기 시작하기'} &nbsp; →</button>${canResume ? '<button class="secondary-btn" type="button" data-action="resume">이어서 플레이</button>' : ''}</div><p class="save-note">진행 상황은 이 기기에 자동 저장됩니다.</p></div>`;
  }
  function renderScene(scene) {
    const buttons = scene.choices.map((choice, index) => {
      const enabled = !choice.enabled || choice.enabled();
      const subtitle = enabled ? choice.sub : choice.lock;
      return `<button class="choice-btn" type="button" data-choice="${index}" ${enabled ? '' : 'disabled'}><span class="choice-index">${String(index + 1).padStart(2, '0')}</span><span class="choice-copy"><strong>${safeStr(choice.title)}</strong><small>${safeStr(subtitle || '')}</small></span><span class="choice-arrow" aria-hidden="true">↗</span></button>`;
    }).join('');
    const showStatus = state.scene === 'finale' ? `<div class="tag-row"><span class="tag">◈ 증거 ${state.evidence}</span><span class="tag">✦ 연대 ${state.solidarity}</span><span class="tag">✧ 분노 ${state.anger}</span></div>` : '';
    return `${sceneArt(scene.art, scene.theme)}<div class="scene-body game-view-enter"><div class="scene-kicker"><span class="eyebrow">${scene.section}</span></div><h1 class="scene-title">${scene.title}</h1><div class="scene-prose">${scene.prose()}</div><div class="dialogue">${scene.dialogue}</div>${showStatus}<div class="chapter-question">${scene.question}</div><div class="choices">${buttons}</div></div>`;
  }
  function renderEnding(ending) {
    const identity = IDENTITIES[state.scene];
    const inventory = state.items.length ? state.items.map(id => ITEMS[id]?.name).filter(Boolean).join(' · ') : '기록하지 못한 단서들';
    const turns = state.history.length;
    const traits = identity.strengths.map(t => `<span class="identity-trait"># ${t}</span>`).join('');
    return `${sceneArt(ending.art, 'ending')}<div class="scene-body game-view-enter">
      <section class="identity-card" aria-label="나의 신분 유형 결과">
        <div class="identity-top"><span>나의 신분 결과 · PERSONALITY RESULT</span><span>${ending.number}</span></div>
        <div class="identity-symbol" aria-hidden="true">${identity.symbol}</div>
        <p class="identity-prefix">당신의 신분은</p>
        <h1 class="identity-role">${identity.role}<span>입니다.</span></h1>
        <p class="identity-title">「${identity.title}」</p>
        <p class="identity-summary">${identity.summary}</p>
        <div class="identity-traits">${traits}</div>
        <div class="identity-caution"><b>당신에게 남은 질문</b><p>${identity.caution}</p></div>
        <p class="identity-foot">당신의 선택을 바탕으로 한 이야기 속 유형입니다. 현실의 신분이나 인격을 평가하지 않습니다.</p>
      </section>
      <div class="ending-mark">${ending.number}</div><h2 class="scene-title ending-title">${ending.name}</h2><p class="ending-subtitle">${ending.quote}</p><div class="scene-prose">${ending.text}</div><div class="ending-result"><h3>당신의 이야기 기록</h3><p>총 ${turns}번의 선택 · 발견한 단서 ${state.items.length}개<br>증거 ${state.evidence} / 연대 ${state.solidarity} / 분노 ${state.anger}<br>주요 단서: ${safeStr(inventory)}</p><p><strong>${ending.result}</strong></p></div><div class="reflection">생각해 보기 · 오늘날에도 누군가의 목소리가 신분, 돈, 권력 때문에 지워진다면 우리는 무엇을 할 수 있을까요?</div><div class="ending-actions"><button class="primary-btn" type="button" data-action="restart">다른 신분 만나보기 ↺</button><button class="secondary-btn" type="button" data-action="share">나의 신분 공유하기 ↗</button></div></div>`;
  }

  function render() {
    const onIntro = state.scene === 'intro' || homePreview;
    const ending = ENDINGS[state.scene];
    const scene = SCENES[state.scene];
    view.innerHTML = onIntro ? renderIntro() : ending ? renderEnding(ending) : scene ? renderScene(scene) : renderIntro();
    const chapter = onIntro ? 0 : ending ? 7 : scene.chapter;
    $('chapterEyebrow').textContent = onIntro ? '서막 · 선택의 시작' : ending ? '종장 · 당신이 만든 결말' : scene.section;
    $('chapterNumber').textContent = `${String(chapter).padStart(2, '0')} / 07`;
    $('progressFill').style.width = `${(chapter / 7) * 100}%`;
    $('clueCount').textContent = state.items.length;
    for (const [key, id, barId] of [['evidence','evidenceValue','evidenceBar'], ['solidarity','solidarityValue','solidarityBar'], ['anger','angerValue','angerBar']]) {
      $(id).textContent = state[key];
      $(barId).style.width = `${(state[key] / MAX_SCORE) * 100}%`;
    }
    $('bottomHint').textContent = ending ? '다른 선택으로 다시 플레이하면 또 다른 결말을 만날 수 있습니다.' : onIntro ? '하나의 QR, 여러 갈래의 이야기. 당신의 선택으로 진행됩니다.' : '선택은 되돌릴 수 없지만, 이야기는 언제든 다시 시작할 수 있습니다.';
    $('railNote').textContent = ending ? '“당신은 어떤 세상을 남겼나요?”' : state.solidarity >= 4 ? '“함께 서는 사람이 늘어나면 역사가 움직인다.”' : state.anger >= 4 ? '“분노는 불씨가 되고, 선택은 불길의 방향이 된다.”' : '“영웅은 혼자 이름을 남기지 않는다.”';
    if (onIntro) $('storyPanel').setAttribute('aria-label', '게임 시작 화면');
    else $('storyPanel').setAttribute('aria-label', ending ? '게임 결말' : `게임 ${chapter}장`);
  }
  function start() { state = defaultState(); state.scene = 'gate'; state.played = true; homePreview = false; save(); ensureMusic(); playClick(); render(); scrollToTop(); }
  function choose(index) {
    const scene = SCENES[state.scene];
    if (!scene || !Number.isInteger(index) || !scene.choices[index]) return;
    const choice = scene.choices[index];
    if (choice.enabled && !choice.enabled()) return;
    for (const [stat, change] of Object.entries(choice.effects || {})) if (['evidence','solidarity','anger'].includes(stat)) state[stat] = clamp(state[stat] + change);
    if (choice.item && !has(choice.item)) state.items.push(choice.item);
    if (choice.flag && !flag(choice.flag)) state.flags.push(choice.flag);
    state.history.push({ scene: state.scene, choice: choice.title });
    state.scene = choice.next;
    save(); ensureMusic(); playClick(); render(); scrollToTop();
    if (choice.item) toast(`새 단서: ${ITEMS[choice.item].name}`);
  }
  function scrollToTop() { if (window.scrollY > 70) window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  function restart() { if (confirm('지금까지의 선택을 지우고 처음부터 다시 시작할까요?')) start(); }
  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600); }

  function openJournal() {
    const entries = state.items.map((id, index) => {
      const item = ITEMS[id];
      if (!item) return '';
      return `<article class="journal-entry"><span class="item-number">CLUE ${String(index + 1).padStart(2,'0')}</span><h3>${item.name}</h3><p>${item.desc}</p></article>`;
    }).join('');
    $('journalItems').innerHTML = entries || '<div class="empty-journal">아직 발견한 단서가 없습니다.<br>이야기 속 사람들과 기록을 살펴보세요.</div>';
    $('journalModal').hidden = false;
    $('closeJournal').focus();
    document.body.style.overflow = 'hidden';
  }
  function closeJournal() { $('journalModal').hidden = true; document.body.style.overflow = ''; $('journalButton').focus(); }

  async function ensureMusic() {
    if (!bgm || !soundOn) return;
    try {
      bgm.volume = 0.48;
      bgm.loop = true;
      await bgm.play();
    } catch (_) { /* 모바일 브라우저 정책상 첫 제스처 이후 재생 */ }
  }
  function stopMusic() { if (bgm) bgm.pause(); }
  function syncSoundButton() {
    const btn = $('soundButton');
    if (!btn) return;
    btn.classList.toggle('muted', !soundOn);
    btn.setAttribute('aria-label', soundOn ? '배경 음악 끄기' : '배경 음악 켜기');
    btn.title = soundOn ? '배경 음악 켜짐' : '배경 음악 꺼짐';
    const label = btn.querySelector('.label');
    if (label) label.textContent = soundOn ? '음악 끄기' : '음악 켜기';
  }
  function playClick() {
    if (!soundOn) return;
    try {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtor) return;
      audioContext ||= new AudioCtor();
      if (audioContext.state === 'suspended') audioContext.resume();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(470, audioContext.currentTime); osc.frequency.exponentialRampToValueAtTime(650, audioContext.currentTime + .07);
      gain.gain.setValueAtTime(.045, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .12);
      osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + .13);
    } catch (_) { /* 오디오를 지원하지 않는 브라우저 */ }
  }
  function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) { ensureMusic(); playClick(); } else { stopMusic(); }
    syncSoundButton();
  }
  async function shareEnding() {
    const ending = ENDINGS[state.scene]; if (!ending) return;
    const text = `《홍길동전: 지워진 이름들》\n당신의 신분은 ${IDENTITIES[state.scene].role}입니다!\n${IDENTITIES[state.scene].summary}\n나의 결말: ${ending.name}\n증거 ${state.evidence} · 연대 ${state.solidarity} · 분노 ${state.anger}\n${ending.result}${location.protocol.startsWith('http') ? '\n' + location.href : ''}`;
    if (navigator.share) { try { await navigator.share({title: '홍길동전: 지워진 이름들', text}); return; } catch (e) { if (e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(text); toast('결말이 복사되었습니다!'); }
    catch (_) { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); t.remove(); toast(ok ? '결말이 복사되었습니다!' : '이 브라우저에서는 공유할 수 없습니다.'); }
  }

  view.addEventListener('click', event => {
    const option = event.target.closest('[data-choice]');
    if (option) { choose(Number(option.dataset.choice)); return; }
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (action === 'start') { if (state.played && state.scene !== 'intro' && !confirm('저장된 진행 상황을 지우고 새로운 이야기를 시작할까요?')) return; start(); }
    else if (action === 'resume') { homePreview = false; ensureMusic(); playClick(); render(); }
    else if (action === 'restart') restart();
    else if (action === 'share') shareEnding();
  });
  $('journalButton').addEventListener('click', openJournal);
  $('closeJournal').addEventListener('click', closeJournal);
  $('journalModal').addEventListener('click', e => { if (e.target === $('journalModal')) closeJournal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('journalModal').hidden) closeJournal(); });
  $('resetButton').addEventListener('click', restart);
  $('soundButton').addEventListener('click', toggleSound);
  $('homeLink').addEventListener('click', e => { e.preventDefault(); homePreview = true; render(); scrollToTop(); });
  syncSoundButton();
  render();
})();

