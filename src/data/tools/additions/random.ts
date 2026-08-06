import type { AdditionalToolProfile } from '../localizedContent';
import type { Language } from '../types';
import type { AdditionalToolSpec } from './types';

const ladderProfiles: Record<Language, AdditionalToolProfile> = {
  ko: { name: '사다리타기', input: '참가자 이름과 결과 항목', output: '무작위 사다리를 따라 정해진 참가자별 결과', example: '참가자 4명 + 당첨 1개 → 당첨자 추첨', limitation: '브라우저 난수를 사용하므로 법적 효력이 필요한 추첨에는 적합하지 않습니다.' },
  en: { name: 'Ladder Game (Ghost Leg)', input: 'participant names and result labels', output: 'a random ladder assignment for every participant', example: '4 players + 1 winner slot → one winner drawn', limitation: 'Browser randomness is not certified for regulated lotteries.' },
  ja: { name: 'あみだくじ', input: '参加者名と結果の項目', output: 'ランダムなあみだくじで決まる参加者ごとの結果', example: '参加者4人 + 当たり1つ → 当選者を抽選', limitation: 'ブラウザの乱数を使用するため、法的効力が必要な抽選には適しません。' },
  'zh-CN': { name: '画鬼脚（阶梯抽签）', input: '参与者姓名和结果条目', output: '随机阶梯为每位参与者分配的结果', example: '4 名参与者 + 1 个中奖位 → 抽出一名中奖者', limitation: '使用浏览器随机数，不适用于需要法律效力的抽奖。' },
  'zh-TW': { name: '畫鬼腳（階梯抽籤）', input: '參與者姓名和結果項目', output: '隨機階梯為每位參與者分配的結果', example: '4 名參與者 + 1 個中獎位 → 抽出一名中獎者', limitation: '使用瀏覽器隨機數，不適用於需要法律效力的抽獎。' },
  es: { name: 'Sorteo de escalera (Amidakuji)', input: 'nombres de participantes y etiquetas de resultado', output: 'una asignación aleatoria de resultados para cada participante', example: '4 jugadores + 1 premio → se sortea un ganador', limitation: 'La aleatoriedad del navegador no está certificada para sorteos regulados.' },
  pt: { name: 'Sorteio de escada (Amidakuji)', input: 'nomes dos participantes e rótulos de resultado', output: 'uma atribuição aleatória de resultados para cada participante', example: '4 jogadores + 1 prêmio → um vencedor sorteado', limitation: 'A aleatoriedade do navegador não é certificada para sorteios regulamentados.' },
  de: { name: 'Leiterlos (Amidakuji)', input: 'Teilnehmernamen und Ergebnisfelder', output: 'eine zufällige Leiter-Zuordnung für jeden Teilnehmer', example: '4 Spieler + 1 Gewinnfeld → ein Gewinner wird gezogen', limitation: 'Browser-Zufallszahlen sind nicht für regulierte Verlosungen zertifiziert.' },
  fr: { name: "Tirage à l'échelle (Amidakuji)", input: 'les noms des participants et les libellés de résultat', output: 'une attribution aléatoire de résultat pour chaque participant', example: '4 joueurs + 1 lot → un gagnant tiré au sort', limitation: "L'aléa du navigateur n'est pas certifié pour les tirages réglementés." },
  it: { name: 'Sorteggio a scala (Amidakuji)', input: 'nomi dei partecipanti ed etichette dei risultati', output: "un'assegnazione casuale dei risultati per ogni partecipante", example: '4 giocatori + 1 premio → viene estratto un vincitore', limitation: 'La casualità del browser non è certificata per estrazioni regolamentate.' },
  id: { name: 'Undian tangga (Amidakuji)', input: 'nama peserta dan label hasil', output: 'penetapan hasil acak untuk setiap peserta', example: '4 pemain + 1 slot pemenang → satu pemenang diundi', limitation: 'Keacakan browser tidak tersertifikasi untuk undian resmi.' },
  hi: { name: 'सीढ़ी लॉटरी (अमिदाकुजी)', input: 'प्रतिभागियों के नाम और परिणाम लेबल', output: 'हर प्रतिभागी के लिए यादृच्छिक सीढ़ी से तय परिणाम', example: '4 खिलाड़ी + 1 विजेता स्थान → एक विजेता चुना जाता है', limitation: 'ब्राउज़र की यादृच्छिकता विनियमित लॉटरी के लिए प्रमाणित नहीं है।' },
};

export const additionalTools: AdditionalToolSpec[] = [
  {
    slug: 'ladder-game',
    icon: '🪜',
    category: 'random',
    component: 'LadderGameTool',
    related: ['coin-flip', 'dice'],
    profiles: ladderProfiles,
  },
];
