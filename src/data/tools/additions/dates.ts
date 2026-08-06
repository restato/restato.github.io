import type { AdditionalToolProfile } from '../localizedContent';
import type { Language } from '../types';
import type { AdditionalToolSpec } from './types';

const lunarSolarProfiles: Record<Language, AdditionalToolProfile> = {
  ko: { name: '음력 양력 변환기', input: '변환할 양력 또는 음력 날짜', output: '윤달과 간지까지 표시된 변환 날짜', example: '양력 2025-01-29 → 음력 2025-01-01 (설날, 을사년)', limitation: '한국 음력 데이터 범위인 1000년부터 2050년까지만 변환할 수 있습니다.' },
  en: { name: 'Lunar-Solar Calendar Converter', input: 'a solar or Korean lunar date to convert', output: 'the converted date with leap-month and sexagenary year details', example: 'solar 2025-01-29 → lunar 2025-01-01 (Korean New Year)', limitation: 'Conversion covers the Korean lunar data range from year 1000 to 2050.' },
  ja: { name: '旧暦・新暦変換器', input: '変換する新暦または韓国旧暦の日付', output: '閏月と干支を含む変換された日付', example: '新暦 2025-01-29 → 旧暦 2025-01-01（旧正月）', limitation: '変換は韓国旧暦データの範囲である1000年から2050年までです。' },
  'zh-CN': { name: '农历公历转换器', input: '要转换的公历或韩国农历日期', output: '包含闰月和干支信息的转换日期', example: '公历 2025-01-29 → 农历 2025-01-01（春节）', limitation: '转换范围为韩国农历数据的 1000 年至 2050 年。' },
  'zh-TW': { name: '農曆國曆轉換器', input: '要轉換的國曆或韓國農曆日期', output: '包含閏月和干支資訊的轉換日期', example: '國曆 2025-01-29 → 農曆 2025-01-01（春節）', limitation: '轉換範圍為韓國農曆資料的 1000 年至 2050 年。' },
  es: { name: 'Conversor de calendario lunar-solar', input: 'una fecha solar o lunar coreana a convertir', output: 'la fecha convertida con detalles de mes intercalar y año sexagenario', example: 'solar 2025-01-29 → lunar 2025-01-01 (Año Nuevo coreano)', limitation: 'La conversión cubre los datos lunares coreanos del año 1000 al 2050.' },
  pt: { name: 'Conversor de calendário lunar-solar', input: 'uma data solar ou lunar coreana para converter', output: 'a data convertida com mês intercalar e ano sexagenário', example: 'solar 2025-01-29 → lunar 2025-01-01 (Ano Novo coreano)', limitation: 'A conversão cobre os dados lunares coreanos do ano 1000 a 2050.' },
  de: { name: 'Mond-Sonnenkalender-Umrechner', input: 'ein umzurechnendes Sonnen- oder koreanisches Monddatum', output: 'das umgerechnete Datum mit Schaltmonat und Sexagesimaljahr', example: 'Sonnenkalender 2025-01-29 → Mondkalender 2025-01-01 (koreanisches Neujahr)', limitation: 'Die Umrechnung deckt die koreanischen Monddaten von Jahr 1000 bis 2050 ab.' },
  fr: { name: 'Convertisseur calendrier lunaire-solaire', input: 'une date solaire ou lunaire coréenne à convertir', output: 'la date convertie avec mois intercalaire et année sexagésimale', example: 'solaire 2025-01-29 → lunaire 2025-01-01 (Nouvel An coréen)', limitation: 'La conversion couvre les données lunaires coréennes de l’an 1000 à 2050.' },
  it: { name: 'Convertitore calendario lunare-solare', input: 'una data solare o lunare coreana da convertire', output: 'la data convertita con mese intercalare e anno sessagenario', example: 'solare 2025-01-29 → lunare 2025-01-01 (Capodanno coreano)', limitation: 'La conversione copre i dati lunari coreani dall’anno 1000 al 2050.' },
  id: { name: 'Konverter kalender lunar-solar', input: 'tanggal masehi atau lunar Korea yang akan dikonversi', output: 'tanggal hasil konversi dengan bulan kabisat dan tahun sexagenari', example: 'masehi 2025-01-29 → lunar 2025-01-01 (Tahun Baru Korea)', limitation: 'Konversi mencakup data lunar Korea dari tahun 1000 hingga 2050.' },
  hi: { name: 'चंद्र-सौर कैलेंडर परिवर्तक', input: 'बदलने के लिए सौर या कोरियाई चंद्र तिथि', output: 'अधिमास और षष्ठिवर्ष विवरण के साथ परिवर्तित तिथि', example: 'सौर 2025-01-29 → चंद्र 2025-01-01 (कोरियाई नववर्ष)', limitation: 'परिवर्तन कोरियाई चंद्र डेटा की सीमा वर्ष 1000 से 2050 तक है।' },
};

export const additionalTools: AdditionalToolSpec[] = [
  {
    slug: 'lunar-solar',
    icon: '🌙',
    category: 'converters',
    component: 'LunarSolarTool',
    related: ['age', 'dday'],
    profiles: lunarSolarProfiles,
  },
];
