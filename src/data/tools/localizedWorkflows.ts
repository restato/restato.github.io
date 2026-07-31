import type { Language } from './types';

type WorkflowAction =
  | 'enter' | 'configure' | 'upload'
  | 'generate' | 'liveGenerate' | 'liveAnalyze' | 'liveConvert' | 'livePreview'
  | 'process' | 'compare' | 'validate' | 'test' | 'decode' | 'calculate' | 'control' | 'randomize'
  | 'copy' | 'download' | 'copyOrDownload' | 'inspect' | 'save'
  | 'qrLiveUpdate' | 'qrExport'
  | 'flip' | 'inspectHistory' | 'repeatOrReset'
  | 'resizerConfigure' | 'downloadOrReset'
  | 'convertImages' | 'removeBackground' | 'generateScreenshots'
  | 'chatOpen' | 'chatShareRoomLink' | 'chatSend';

type ToolWorkflow = readonly [WorkflowAction, WorkflowAction, WorkflowAction];

const toolWorkflows = {
  'qr-code': ['enter', 'qrLiveUpdate', 'qrExport'],
  password: ['configure', 'generate', 'copy'],
  uuid: ['configure', 'generate', 'copy'],
  'lorem-ipsum': ['configure', 'generate', 'copy'],
  'color-palette': ['configure', 'liveGenerate', 'copy'],
  hash: ['enter', 'liveAnalyze', 'copy'],
  color: ['enter', 'liveConvert', 'copy'],
  unit: ['configure', 'liveConvert', 'inspect'],
  base64: ['configure', 'liveConvert', 'copy'],
  'image-converter': ['upload', 'convertImages', 'download'],
  'text-counter': ['enter', 'liveAnalyze', 'inspect'],
  markdown: ['enter', 'livePreview', 'copy'],
  diff: ['enter', 'compare', 'inspect'],
  json: ['enter', 'validate', 'copy'],
  regex: ['configure', 'test', 'inspect'],
  'url-encoder': ['configure', 'liveConvert', 'copy'],
  'jwt-decoder': ['enter', 'decode', 'copy'],
  cron: ['configure', 'liveGenerate', 'copy'],
  timestamp: ['configure', 'liveConvert', 'copy'],
  'llm-cost': ['configure', 'calculate', 'inspect'],
  gradient: ['configure', 'livePreview', 'copy'],
  'box-shadow': ['configure', 'livePreview', 'copy'],
  'image-resizer': ['upload', 'resizerConfigure', 'downloadOrReset'],
  exif: ['upload', 'liveAnalyze', 'inspect'],
  'background-remover': ['upload', 'removeBackground', 'download'],
  'image-metadata': ['upload', 'liveAnalyze', 'inspect'],
  'appstore-screenshot': ['upload', 'generateScreenshots', 'download'],
  utm: ['configure', 'liveGenerate', 'copy'],
  timer: ['configure', 'control', 'inspect'],
  pomodoro: ['configure', 'control', 'inspect'],
  'world-clock': ['configure', 'liveAnalyze', 'inspect'],
  percent: ['configure', 'calculate', 'inspect'],
  discount: ['configure', 'calculate', 'inspect'],
  bmi: ['configure', 'calculate', 'inspect'],
  age: ['configure', 'calculate', 'inspect'],
  dday: ['configure', 'calculate', 'save'],
  'dutch-pay': ['configure', 'calculate', 'inspect'],
  'coin-flip': ['flip', 'inspectHistory', 'repeatOrReset'],
  dice: ['configure', 'randomize', 'inspect'],
  'kor-eng': ['configure', 'liveConvert', 'copy'],
  'anonymous-chat': ['chatOpen', 'chatShareRoomLink', 'chatSend'],
  'pdf-merge': ['upload', 'process', 'download'],
  'pdf-split': ['upload', 'configure', 'download'],
  'pdf-rotate': ['upload', 'configure', 'download'],
  'images-to-pdf': ['upload', 'process', 'download'],
  'pdf-to-images': ['upload', 'process', 'download'],
  'csv-json': ['configure', 'liveConvert', 'copy'],
  'text-cleaner': ['configure', 'liveConvert', 'copy'],
  'seo-generator': ['configure', 'liveGenerate', 'copy'],
  'modern-image-converter': ['upload', 'process', 'download'],
  'exif-remover': ['upload', 'process', 'download'],
  'favicon-generator': ['upload', 'process', 'download'],
  'loan-calculator': ['configure', 'calculate', 'inspect'],
  'audio-trimmer': ['upload', 'configure', 'download'],
} satisfies Record<string, ToolWorkflow>;

export function getToolWorkflow(slug: string): ToolWorkflow {
  const workflow = toolWorkflows[slug as keyof typeof toolWorkflows];
  if (!workflow) throw new Error(`Missing workflow for ${slug}`);
  return workflow;
}

interface WorkflowValues {
  name: string;
  input: string;
  output: string;
}

type WorkflowFormatter = (values: WorkflowValues) => string;
type WorkflowLanguagePack = Record<WorkflowAction, WorkflowFormatter>;
const f = (template: (name: string, input: string, output: string) => string): WorkflowFormatter =>
  ({ name, input, output }) => template(name, input, output);

const workflowPacks: Record<Language, WorkflowLanguagePack> = {
  ko: {
    enter: f((n, i) => `${n} 화면에서 ${i} 값을 입력합니다.`), configure: f((n, i) => `${n} 화면에서 ${i} 설정을 선택합니다.`), upload: f(() => '원본 파일을 선택한 뒤 표시되는 옵션을 설정합니다.'),
    generate: f((_n, _i, o) => `생성 버튼을 눌러 ${o} 항목을 만듭니다.`), liveGenerate: f((_n, _i, o) => `설정을 조정하면서 ${o} 항목이 갱신되는지 확인합니다.`), liveAnalyze: f((_n, _i, o) => `입력을 바꾸며 ${o} 항목을 실시간으로 확인합니다.`), liveConvert: f((_n, _i, o) => `값이나 모드를 바꾸며 ${o} 항목이 변환되는지 확인합니다.`), livePreview: f(() => '설정을 조정하며 실시간 미리보기를 확인합니다.'),
    process: f((n) => `처리 옵션을 정한 뒤 ${n} 실행 버튼을 누릅니다.`), compare: f((_n, _i, o) => `두 입력을 비교해 ${o} 항목을 확인합니다.`), validate: f(() => '서식 지정·축소·검증 중 필요한 작업을 실행합니다.'), test: f((_n, _i, o) => `패턴과 플래그를 적용해 ${o} 항목을 확인합니다.`), decode: f((_n, _i, o) => `토큰을 입력해 ${o} 항목을 확인합니다.`), calculate: f((_n, _i, o) => `계산 버튼을 누르거나 값을 조정해 ${o} 항목을 확인합니다.`), control: f((n) => `시작·일시정지·재설정 버튼으로 ${n} 상태를 제어합니다.`), randomize: f((_n, _i, o) => `실행 버튼을 눌러 ${o} 항목을 새로 만듭니다.`),
    copy: f(() => '복사 버튼으로 결과를 복사합니다.'), download: f(() => '다운로드 버튼으로 결과를 저장합니다.'), copyOrDownload: f(() => '결과를 복사하거나 PNG 파일로 다운로드합니다.'), inspect: f((_n, _i, o) => `${o} 항목을 검토하고 필요한 값을 확인합니다.`), save: f((_n, _i, o) => `이름과 날짜를 저장한 뒤 ${o} 항목을 다시 확인합니다.`),
    qrLiveUpdate: f(() => '텍스트나 크기를 바꾸며 QR 코드가 자동으로 갱신되는지 확인합니다.'), qrExport: f(() => '복사 버튼을 누르거나 PNG 다운로드 버튼으로 저장합니다.'),
    flip: f(() => '동전 던지기 버튼을 한 번 누릅니다.'), inspectHistory: f(() => '앞면·뒷면 결과와 최근 기록을 확인합니다.'), repeatOrReset: f(() => '다시 던지거나 초기화 버튼으로 통계와 기록을 지웁니다.'),
    resizerConfigure: f(() => '자르기 영역, 크기 또는 프리셋을 조정하며 실시간 미리보기를 확인합니다.'), downloadOrReset: f(() => '다운로드 버튼으로 저장하거나 초기화 버튼으로 다시 시작합니다.'),
    convertImages: f(() => '출력 형식과 품질을 정하면 이미지가 변환되며, 변경 후에는 다시 변환을 누릅니다.'), removeBackground: f(() => '배경 제거 버튼을 누르고 결과 미리보기를 확인합니다.'), generateScreenshots: f(() => '기기·크기·방향·자르기를 정한 뒤 모두 처리 버튼을 누릅니다.'),
    chatOpen: f(() => '새 방을 열거나 받은 방 링크로 연결을 시작합니다.'), chatShareRoomLink: f(() => '상대방에게 전달할 방 링크만 복사해 공유합니다.'), chatSend: f(() => '연결되면 메시지를 입력하고 전송 버튼을 눌러 대화합니다.'),
  },
  en: {
    enter: f((n, i) => `Enter ${i} in ${n}.`), configure: f((n, i) => `Choose ${i} settings in ${n}.`), upload: f(() => 'Select the source file, then choose any available options.'),
    generate: f((_n, _i, o) => `Select Generate to create ${o}.`), liveGenerate: f((_n, _i, o) => `Adjust the settings and watch ${o} update.`), liveAnalyze: f((_n, _i, o) => `Change the input and review ${o} in real time.`), liveConvert: f((_n, _i, o) => `Change the value or mode and review ${o}.`), livePreview: f(() => 'Adjust the settings while reviewing the live preview.'),
    process: f((n) => `Choose the processing options, then run ${n}.`), compare: f((_n, _i, o) => `Compare both inputs and inspect ${o}.`), validate: f(() => 'Run Format, Minify, or Validate for the required JSON operation.'), test: f((_n, _i, o) => `Apply the pattern and flags, then inspect ${o}.`), decode: f((_n, _i, o) => `Enter the token and inspect ${o}.`), calculate: f((_n, _i, o) => `Run the calculation or adjust the values to update ${o}.`), control: f((n) => `Use Start, Pause, and Reset to control ${n}.`), randomize: f((_n, _i, o) => `Use the action button to produce new ${o}.`),
    copy: f(() => 'Use the Copy button to copy the result.'), download: f(() => 'Use the Download button to save the result.'), copyOrDownload: f(() => 'Copy the result or download it as a PNG file.'), inspect: f((_n, _i, o) => `Review ${o} and confirm the values you need.`), save: f((_n, _i, o) => `Save the name and date, then review ${o} again.`),
    qrLiveUpdate: f(() => 'Change the text or size and confirm that the QR code updates automatically.'), qrExport: f(() => 'Use Copy or Download PNG to save the QR code.'),
    flip: f(() => 'Select Flip Coin once.'), inspectHistory: f(() => 'Review the heads-or-tails result and recent history.'), repeatOrReset: f(() => 'Flip again, or use Reset to clear the statistics and history.'),
    resizerConfigure: f(() => 'Adjust the crop, dimensions, or preset while reviewing the live preview.'), downloadOrReset: f(() => 'Use Download to save the result, or Reset to start over.'),
    convertImages: f(() => 'Choose the output format and quality; after changes, select Re-convert.'), removeBackground: f(() => 'Select Remove Background and review the result preview.'), generateScreenshots: f(() => 'Set the device, size, orientation, and crop, then select Process All.'),
    chatOpen: f(() => 'Open a new room or connect with a received room link.'), chatShareRoomLink: f(() => 'Copy only the room link and share it with the intended peer.'), chatSend: f(() => 'Once connected, type a message and select Send to chat.'),
  },
  ja: {
    enter: f((n, i) => `${n} に ${i} を入力します。`), configure: f((n, i) => `${n} で ${i} の設定を選びます。`), upload: f(() => '元のファイルを選択し、表示されたオプションを設定します。'),
    generate: f((_n, _i, o) => `生成ボタンを押して ${o} を作成します。`), liveGenerate: f((_n, _i, o) => `設定を調整しながら ${o} の更新を確認します。`), liveAnalyze: f((_n, _i, o) => `入力を変更し、${o} をリアルタイムで確認します。`), liveConvert: f((_n, _i, o) => `値またはモードを変更して ${o} を確認します。`), livePreview: f(() => '設定を調整しながらライブプレビューを確認します。'),
    process: f((n) => `処理オプションを選び、${n} を実行します。`), compare: f((_n, _i, o) => `2つの入力を比較して ${o} を確認します。`), validate: f(() => '必要に応じて整形、圧縮、検証を実行します。'), test: f((_n, _i, o) => `パターンとフラグを適用して ${o} を確認します。`), decode: f((_n, _i, o) => `トークンを入力して ${o} を確認します。`), calculate: f((_n, _i, o) => `計算を実行するか値を調整して ${o} を更新します。`), control: f((n) => `開始、一時停止、リセットで ${n} を操作します。`), randomize: f((_n, _i, o) => `実行ボタンを押して新しい ${o} を生成します。`),
    copy: f(() => 'コピーボタンで結果をコピーします。'), download: f(() => 'ダウンロードボタンで結果を保存します。'), copyOrDownload: f(() => '結果をコピーするか PNG ファイルでダウンロードします。'), inspect: f((_n, _i, o) => `${o} を確認し、必要な値を検証します。`), save: f((_n, _i, o) => `名前と日付を保存して ${o} を再確認します。`),
    qrLiveUpdate: f(() => 'テキストまたはサイズを変え、QRコードが自動更新されることを確認します。'), qrExport: f(() => 'コピーまたは「PNGをダウンロード」でQRコードを保存します。'),
    flip: f(() => '「コインを投げる」を一度押します。'), inspectHistory: f(() => '表裏の結果と最近の履歴を確認します。'), repeatOrReset: f(() => 'もう一度投げるか、リセットで統計と履歴を消去します。'),
    resizerConfigure: f(() => '切り抜き、寸法、プリセットを調整し、ライブプレビューを確認します。'), downloadOrReset: f(() => 'ダウンロードで保存するか、リセットで最初からやり直します。'),
    convertImages: f(() => '出力形式と品質を選び、変更後は「再変換」を押します。'), removeBackground: f(() => '「背景を削除」を押して結果プレビューを確認します。'), generateScreenshots: f(() => '端末、サイズ、向き、切り抜きを設定し、「すべて処理」を押します。'),
    chatOpen: f(() => '新しいルームを開くか、受け取ったルームリンクで接続します。'), chatShareRoomLink: f(() => '相手に渡すルームリンクだけをコピーして共有します。'), chatSend: f(() => '接続後にメッセージを入力し、送信ボタンを押します。'),
  },
  'zh-CN': {
    enter: f((n, i) => `在 ${n} 中输入${i}。`), configure: f((n, i) => `在 ${n} 中选择${i}设置。`), upload: f(() => '选择源文件，然后设置页面中提供的选项。'),
    generate: f((_n, _i, o) => `点击生成按钮创建${o}。`), liveGenerate: f((_n, _i, o) => `调整设置并观察${o}更新。`), liveAnalyze: f((_n, _i, o) => `更改输入并实时查看${o}。`), liveConvert: f((_n, _i, o) => `更改数值或模式并查看${o}。`), livePreview: f(() => '调整设置并查看实时预览。'),
    process: f((n) => `选择处理选项，然后运行 ${n}。`), compare: f((_n, _i, o) => `比较两项输入并查看${o}。`), validate: f(() => '根据需要运行格式化、压缩或验证。'), test: f((_n, _i, o) => `应用模式和标志并查看${o}。`), decode: f((_n, _i, o) => `输入令牌并查看${o}。`), calculate: f((_n, _i, o) => `执行计算或调整数值以更新${o}。`), control: f((n) => `使用开始、暂停和重置控制 ${n}。`), randomize: f((_n, _i, o) => `点击操作按钮生成新的${o}。`),
    copy: f(() => '点击复制按钮复制结果。'), download: f(() => '点击下载按钮保存结果。'), copyOrDownload: f(() => '复制结果或下载 PNG 文件。'), inspect: f((_n, _i, o) => `检查${o}并确认所需数值。`), save: f((_n, _i, o) => `保存名称和日期，然后再次检查${o}。`),
    qrLiveUpdate: f(() => '更改文字或尺寸，并确认 QR 码会自动更新。'), qrExport: f(() => '使用复制或下载 PNG 保存 QR 码。'),
    flip: f(() => '点击一次抛硬币按钮。'), inspectHistory: f(() => '查看正反面结果和最近记录。'), repeatOrReset: f(() => '再次抛掷，或点击重置清除统计和记录。'),
    resizerConfigure: f(() => '调整裁剪、尺寸或预设，同时查看实时预览。'), downloadOrReset: f(() => '点击下载保存结果，或点击重置重新开始。'),
    convertImages: f(() => '选择输出格式和质量；更改后点击重新转换。'), removeBackground: f(() => '点击移除背景并查看结果预览。'), generateScreenshots: f(() => '设置设备、尺寸、方向和裁剪，然后点击全部处理。'),
    chatOpen: f(() => '创建新房间或使用收到的房间链接连接。'), chatShareRoomLink: f(() => '只复制房间链接并分享给对方。'), chatSend: f(() => '连接后输入消息并点击发送。'),
  },
  'zh-TW': {
    enter: f((n, i) => `在 ${n} 輸入${i}。`), configure: f((n, i) => `在 ${n} 選擇${i}設定。`), upload: f(() => '選擇來源檔案，然後設定頁面提供的選項。'),
    generate: f((_n, _i, o) => `按下產生按鈕建立${o}。`), liveGenerate: f((_n, _i, o) => `調整設定並觀察${o}更新。`), liveAnalyze: f((_n, _i, o) => `變更輸入並即時查看${o}。`), liveConvert: f((_n, _i, o) => `變更數值或模式並查看${o}。`), livePreview: f(() => '調整設定並查看即時預覽。'),
    process: f((n) => `選擇處理選項，然後執行 ${n}。`), compare: f((_n, _i, o) => `比較兩項輸入並查看${o}。`), validate: f(() => '依需要執行格式化、壓縮或驗證。'), test: f((_n, _i, o) => `套用模式與旗標並查看${o}。`), decode: f((_n, _i, o) => `輸入權杖並查看${o}。`), calculate: f((_n, _i, o) => `執行計算或調整數值以更新${o}。`), control: f((n) => `使用開始、暫停與重設控制 ${n}。`), randomize: f((_n, _i, o) => `按下操作按鈕產生新的${o}。`),
    copy: f(() => '按下複製按鈕複製結果。'), download: f(() => '按下下載按鈕儲存結果。'), copyOrDownload: f(() => '複製結果或下載 PNG 檔案。'), inspect: f((_n, _i, o) => `檢查${o}並確認所需數值。`), save: f((_n, _i, o) => `儲存名稱與日期，然後再次檢查${o}。`),
    qrLiveUpdate: f(() => '變更文字或尺寸，並確認 QR 碼會自動更新。'), qrExport: f(() => '使用複製或下載 PNG 儲存 QR 碼。'),
    flip: f(() => '按一次擲硬幣按鈕。'), inspectHistory: f(() => '查看正反面結果與最近記錄。'), repeatOrReset: f(() => '再次擲硬幣，或按下重設清除統計與記錄。'),
    resizerConfigure: f(() => '調整裁切、尺寸或預設，同時查看即時預覽。'), downloadOrReset: f(() => '按下載儲存結果，或按重設重新開始。'),
    convertImages: f(() => '選擇輸出格式與品質；變更後按下重新轉換。'), removeBackground: f(() => '按下移除背景並查看結果預覽。'), generateScreenshots: f(() => '設定裝置、尺寸、方向與裁切，然後按下全部處理。'),
    chatOpen: f(() => '建立新房間或使用收到的房間連結連線。'), chatShareRoomLink: f(() => '只複製房間連結並分享給對方。'), chatSend: f(() => '連線後輸入訊息並按下傳送。'),
  },
  es: {
    enter: f((n, i) => `Introduce ${i} en ${n}.`), configure: f((n, i) => `Configura ${i} en ${n}.`), upload: f(() => 'Selecciona el archivo de origen y configura las opciones disponibles.'),
    generate: f((_n, _i, o) => `Pulsa Generar para crear el resultado: ${o}.`), liveGenerate: f((_n, _i, o) => `Ajusta la configuración y observa cómo se actualiza el resultado: ${o}.`), liveAnalyze: f((_n, _i, o) => `Cambia la entrada y revisa en tiempo real el resultado: ${o}.`), liveConvert: f((_n, _i, o) => `Cambia el valor o el modo y revisa el resultado: ${o}.`), livePreview: f(() => 'Ajusta la configuración mientras revisas la vista previa en tiempo real.'),
    process: f((n) => `Elige las opciones de procesamiento y ejecuta ${n}.`), compare: f((_n, _i, o) => `Compara ambas entradas y revisa el resultado: ${o}.`), validate: f(() => 'Ejecuta Formatear, Minimizar o Validar según la operación necesaria.'), test: f((_n, _i, o) => `Aplica el patrón y las opciones, y revisa el resultado: ${o}.`), decode: f((_n, _i, o) => `Introduce el token y revisa el resultado: ${o}.`), calculate: f((_n, _i, o) => `Ejecuta el cálculo o ajusta los valores para actualizar el resultado: ${o}.`), control: f((n) => `Usa Iniciar, Pausar y Reiniciar para controlar ${n}.`), randomize: f((_n, _i, o) => `Pulsa el botón de acción para obtener un nuevo resultado: ${o}.`),
    copy: f(() => 'Pulsa Copiar para copiar el resultado.'), download: f(() => 'Pulsa Descargar para guardar el resultado.'), copyOrDownload: f(() => 'Copia el resultado o descárgalo como archivo PNG.'), inspect: f((_n, _i, o) => `Revisa el resultado y confirma los valores necesarios: ${o}.`), save: f((_n, _i, o) => `Guarda el nombre y la fecha, y vuelve a revisar el resultado: ${o}.`),
    qrLiveUpdate: f(() => 'Cambia el texto o el tamaño y comprueba que el código QR se actualiza automáticamente.'), qrExport: f(() => 'Usa Copiar o Descargar PNG para guardar el código QR.'),
    flip: f(() => 'Pulsa Lanzar moneda una vez.'), inspectHistory: f(() => 'Revisa el resultado de cara o cruz y el historial reciente.'), repeatOrReset: f(() => 'Vuelve a lanzar o pulsa Reiniciar para borrar las estadísticas y el historial.'),
    resizerConfigure: f(() => 'Ajusta el recorte, las dimensiones o el preajuste mientras revisas la vista previa.'), downloadOrReset: f(() => 'Pulsa Descargar para guardar el resultado o Reiniciar para empezar de nuevo.'),
    convertImages: f(() => 'Elige el formato y la calidad de salida; después de cambiarlos, pulsa Volver a convertir.'), removeBackground: f(() => 'Pulsa Eliminar fondo y revisa la vista previa del resultado.'), generateScreenshots: f(() => 'Configura el dispositivo, el tamaño, la orientación y el recorte; después pulsa Procesar todo.'),
    chatOpen: f(() => 'Abre una sala nueva o conéctate con un enlace de la sala recibido.'), chatShareRoomLink: f(() => 'Copia solo el enlace de la sala y compártelo con la otra persona.'), chatSend: f(() => 'Cuando se conecte, escribe un mensaje y pulsa Enviar.'),
  },
  pt: {
    enter: f((n, i) => `Insira ${i} em ${n}.`), configure: f((n, i) => `Configure ${i} em ${n}.`), upload: f(() => 'Selecione o arquivo de origem e configure as opções disponíveis.'),
    generate: f((_n, _i, o) => `Selecione Gerar para criar o resultado: ${o}.`), liveGenerate: f((_n, _i, o) => `Ajuste as configurações e acompanhe a atualização do resultado: ${o}.`), liveAnalyze: f((_n, _i, o) => `Altere a entrada e confira em tempo real o resultado: ${o}.`), liveConvert: f((_n, _i, o) => `Altere o valor ou modo e confira o resultado: ${o}.`), livePreview: f(() => 'Ajuste as configurações enquanto confere a prévia em tempo real.'),
    process: f((n) => `Escolha as opções de processamento e execute ${n}.`), compare: f((_n, _i, o) => `Compare as duas entradas e confira o resultado: ${o}.`), validate: f(() => 'Execute Formatar, Minimizar ou Validar conforme a operação necessária.'), test: f((_n, _i, o) => `Aplique o padrão e as opções e confira o resultado: ${o}.`), decode: f((_n, _i, o) => `Insira o token e confira o resultado: ${o}.`), calculate: f((_n, _i, o) => `Execute o cálculo ou ajuste os valores para atualizar o resultado: ${o}.`), control: f((n) => `Use Iniciar, Pausar e Redefinir para controlar ${n}.`), randomize: f((_n, _i, o) => `Use o botão de ação para obter um novo resultado: ${o}.`),
    copy: f(() => 'Selecione Copiar para copiar o resultado.'), download: f(() => 'Selecione Baixar para salvar o resultado.'), copyOrDownload: f(() => 'Copie o resultado ou baixe-o como arquivo PNG.'), inspect: f((_n, _i, o) => `Confira o resultado e confirme os valores necessários: ${o}.`), save: f((_n, _i, o) => `Salve o nome e a data e confira novamente o resultado: ${o}.`),
    qrLiveUpdate: f(() => 'Altere o texto ou tamanho e confirme que o código QR é atualizado automaticamente.'), qrExport: f(() => 'Use Copiar ou Baixar PNG para salvar o código QR.'),
    flip: f(() => 'Selecione Jogar moeda uma vez.'), inspectHistory: f(() => 'Confira o resultado de cara ou coroa e o histórico recente.'), repeatOrReset: f(() => 'Jogue novamente ou use Redefinir para limpar as estatísticas e o histórico.'),
    resizerConfigure: f(() => 'Ajuste o recorte, as dimensões ou a predefinição enquanto confere a prévia.'), downloadOrReset: f(() => 'Use Baixar para salvar o resultado ou Redefinir para recomeçar.'),
    convertImages: f(() => 'Escolha o formato e a qualidade de saída; após alterações, selecione Converter novamente.'), removeBackground: f(() => 'Selecione Remover fundo e confira a prévia do resultado.'), generateScreenshots: f(() => 'Defina o dispositivo, o tamanho, a orientação e o recorte; depois selecione Processar tudo.'),
    chatOpen: f(() => 'Abra uma nova sala ou conecte-se com um link da sala recebido.'), chatShareRoomLink: f(() => 'Copie apenas o link da sala e compartilhe com a outra pessoa.'), chatSend: f(() => 'Após a conexão, digite uma mensagem e selecione Enviar.'),
  },
  de: {
    enter: f((n, i) => `Geben Sie ${i} in ${n} ein.`), configure: f((n, i) => `Legen Sie ${i} in ${n} fest.`), upload: f(() => 'Wählen Sie die Quelldatei und legen Sie die verfügbaren Optionen fest.'),
    generate: f((_n, _i, o) => `Wählen Sie Erzeugen, um ${o} zu erstellen.`), liveGenerate: f((_n, _i, o) => `Ändern Sie die Einstellungen und beobachten Sie die Aktualisierung von ${o}.`), liveAnalyze: f((_n, _i, o) => `Ändern Sie die Eingabe und prüfen Sie ${o} in Echtzeit.`), liveConvert: f((_n, _i, o) => `Ändern Sie Wert oder Modus und prüfen Sie ${o}.`), livePreview: f(() => 'Passen Sie die Einstellungen an und prüfen Sie die Live-Vorschau.'),
    process: f((n) => `Wählen Sie die Verarbeitungsoptionen und starten Sie ${n}.`), compare: f((_n, _i, o) => `Vergleichen Sie beide Eingaben und prüfen Sie ${o}.`), validate: f(() => 'Führen Sie je nach Bedarf Formatieren, Minimieren oder Validieren aus.'), test: f((_n, _i, o) => `Wenden Sie Muster und Optionen an und prüfen Sie ${o}.`), decode: f((_n, _i, o) => `Geben Sie das Token ein und prüfen Sie ${o}.`), calculate: f((_n, _i, o) => `Starten Sie die Berechnung oder ändern Sie Werte, um ${o} zu aktualisieren.`), control: f((n) => `Steuern Sie ${n} mit Start, Pause und Zurücksetzen.`), randomize: f((_n, _i, o) => `Betätigen Sie die Aktion, um neue ${o} zu erzeugen.`),
    copy: f(() => 'Wählen Sie Kopieren, um das Ergebnis zu kopieren.'), download: f(() => 'Wählen Sie Herunterladen, um das Ergebnis zu speichern.'), copyOrDownload: f(() => 'Kopieren Sie das Ergebnis oder laden Sie es als PNG-Datei herunter.'), inspect: f((_n, _i, o) => `Prüfen Sie ${o} und bestätigen Sie die benötigten Werte.`), save: f((_n, _i, o) => `Speichern Sie Name und Datum und prüfen Sie ${o} erneut.`),
    qrLiveUpdate: f(() => 'Ändern Sie Text oder Größe und prüfen Sie, ob sich der QR-Code automatisch aktualisiert.'), qrExport: f(() => 'Speichern Sie den QR-Code mit Kopieren oder PNG herunterladen.'),
    flip: f(() => 'Wählen Sie einmal Münze werfen.'), inspectHistory: f(() => 'Prüfen Sie das Ergebnis Kopf oder Zahl und den bisherigen Verlauf.'), repeatOrReset: f(() => 'Werfen Sie erneut oder löschen Sie Statistik und Verlauf mit Zurücksetzen.'),
    resizerConfigure: f(() => 'Passen Sie Zuschnitt, Abmessungen oder Vorlage an und prüfen Sie dabei die Live-Vorschau.'), downloadOrReset: f(() => 'Speichern Sie das Ergebnis mit Herunterladen oder beginnen Sie mit Zurücksetzen neu.'),
    convertImages: f(() => 'Wählen Sie Ausgabeformat und Qualität; wählen Sie nach Änderungen Erneut konvertieren.'), removeBackground: f(() => 'Wählen Sie Hintergrund entfernen und prüfen Sie die Ergebnisvorschau.'), generateScreenshots: f(() => 'Legen Sie Gerät, Größe, Ausrichtung und Zuschnitt fest und wählen Sie dann Alle verarbeiten.'),
    chatOpen: f(() => 'Öffnen Sie einen neuen Raum oder verbinden Sie sich über einen erhaltenen Raumlink.'), chatShareRoomLink: f(() => 'Kopieren Sie nur den Raumlink und teilen Sie ihn mit der anderen Person.'), chatSend: f(() => 'Geben Sie nach der Verbindung eine Nachricht ein und wählen Sie Senden.'),
  },
  fr: {
    enter: f((n, i) => `Saisissez ${i} dans ${n}.`), configure: f((n, i) => `Configurez ${i} dans ${n}.`), upload: f(() => 'Sélectionnez le fichier source, puis configurez les options disponibles.'),
    generate: f((_n, _i, o) => `Choisissez Générer pour créer le résultat : ${o}.`), liveGenerate: f((_n, _i, o) => `Ajustez les réglages et observez la mise à jour du résultat : ${o}.`), liveAnalyze: f((_n, _i, o) => `Modifiez la saisie et examinez en direct le résultat : ${o}.`), liveConvert: f((_n, _i, o) => `Modifiez la valeur ou le mode et examinez le résultat : ${o}.`), livePreview: f(() => 'Ajustez les réglages tout en examinant l’aperçu en direct.'),
    process: f((n) => `Choisissez les options de traitement, puis lancez ${n}.`), compare: f((_n, _i, o) => `Comparez les deux saisies et examinez le résultat : ${o}.`), validate: f(() => 'Exécutez Formater, Réduire ou Valider selon l’opération nécessaire.'), test: f((_n, _i, o) => `Appliquez le motif et les options, puis examinez le résultat : ${o}.`), decode: f((_n, _i, o) => `Saisissez le jeton et examinez le résultat : ${o}.`), calculate: f((_n, _i, o) => `Lancez le calcul ou ajustez les valeurs pour actualiser le résultat : ${o}.`), control: f((n) => `Utilisez Démarrer, Pause et Réinitialiser pour contrôler ${n}.`), randomize: f((_n, _i, o) => `Utilisez le bouton d’action pour obtenir un nouveau résultat : ${o}.`),
    copy: f(() => 'Choisissez Copier pour copier le résultat.'), download: f(() => 'Choisissez Télécharger pour enregistrer le résultat.'), copyOrDownload: f(() => 'Copiez le résultat ou téléchargez-le au format PNG.'), inspect: f((_n, _i, o) => `Examinez le résultat et confirmez les valeurs nécessaires : ${o}.`), save: f((_n, _i, o) => `Enregistrez le nom et la date, puis examinez à nouveau le résultat : ${o}.`),
    qrLiveUpdate: f(() => 'Modifiez le texte ou la taille et vérifiez que le code QR se met à jour automatiquement.'), qrExport: f(() => 'Utilisez Copier ou Télécharger le PNG pour enregistrer le code QR.'),
    flip: f(() => 'Choisissez Lancer la pièce une fois.'), inspectHistory: f(() => 'Examinez le résultat pile ou face et l’historique récent.'), repeatOrReset: f(() => 'Relancez la pièce ou utilisez Réinitialiser pour effacer les statistiques et l’historique.'),
    resizerConfigure: f(() => 'Ajustez le recadrage, les dimensions ou le préréglage tout en examinant l’aperçu.'), downloadOrReset: f(() => 'Utilisez Télécharger pour enregistrer le résultat ou Réinitialiser pour recommencer.'),
    convertImages: f(() => 'Choisissez le format et la qualité de sortie ; après une modification, sélectionnez Reconvertir.'), removeBackground: f(() => 'Choisissez Supprimer l’arrière-plan et examinez l’aperçu du résultat.'), generateScreenshots: f(() => 'Réglez l’appareil, la taille, l’orientation et le recadrage, puis choisissez Tout traiter.'),
    chatOpen: f(() => 'Ouvrez un nouveau salon ou connectez-vous avec un lien du salon reçu.'), chatShareRoomLink: f(() => 'Copiez uniquement le lien du salon et partagez-le avec l’autre personne.'), chatSend: f(() => 'Une fois connecté, saisissez un message et choisissez Envoyer.'),
  },
  it: {
    enter: f((n, i) => `Inserisci ${i} in ${n}.`), configure: f((n, i) => `Configura ${i} in ${n}.`), upload: f(() => 'Seleziona il file sorgente e configura le opzioni disponibili.'),
    generate: f((_n, _i, o) => `Seleziona Genera per creare il risultato: ${o}.`), liveGenerate: f((_n, _i, o) => `Regola le impostazioni e osserva l’aggiornamento del risultato: ${o}.`), liveAnalyze: f((_n, _i, o) => `Modifica l’input e controlla in tempo reale il risultato: ${o}.`), liveConvert: f((_n, _i, o) => `Modifica il valore o la modalità e controlla il risultato: ${o}.`), livePreview: f(() => 'Regola le impostazioni mentre controlli l’anteprima in tempo reale.'),
    process: f((n) => `Scegli le opzioni di elaborazione e avvia ${n}.`), compare: f((_n, _i, o) => `Confronta i due input e controlla il risultato: ${o}.`), validate: f(() => 'Esegui Formatta, Riduci o Convalida secondo l’operazione richiesta.'), test: f((_n, _i, o) => `Applica il modello e le opzioni e controlla il risultato: ${o}.`), decode: f((_n, _i, o) => `Inserisci il token e controlla il risultato: ${o}.`), calculate: f((_n, _i, o) => `Esegui il calcolo o regola i valori per aggiornare il risultato: ${o}.`), control: f((n) => `Usa Avvia, Pausa e Reimposta per controllare ${n}.`), randomize: f((_n, _i, o) => `Usa il pulsante di azione per ottenere un nuovo risultato: ${o}.`),
    copy: f(() => 'Seleziona Copia per copiare il risultato.'), download: f(() => 'Seleziona Scarica per salvare il risultato.'), copyOrDownload: f(() => 'Copia il risultato o scaricalo come file PNG.'), inspect: f((_n, _i, o) => `Controlla il risultato e conferma i valori necessari: ${o}.`), save: f((_n, _i, o) => `Salva il nome e la data, quindi controlla di nuovo il risultato: ${o}.`),
    qrLiveUpdate: f(() => 'Modifica il testo o le dimensioni e verifica che il codice QR si aggiorni automaticamente.'), qrExport: f(() => 'Usa Copia o Scarica PNG per salvare il codice QR.'),
    flip: f(() => 'Seleziona Lancia moneta una volta.'), inspectHistory: f(() => 'Controlla il risultato testa o croce e la cronologia recente.'), repeatOrReset: f(() => 'Lancia di nuovo o usa Reimposta per cancellare statistiche e cronologia.'),
    resizerConfigure: f(() => 'Regola ritaglio, dimensioni o preimpostazione mentre controlli l’anteprima.'), downloadOrReset: f(() => 'Usa Scarica per salvare il risultato o Reimposta per ricominciare.'),
    convertImages: f(() => 'Scegli formato e qualità di uscita; dopo una modifica, seleziona Riconverti.'), removeBackground: f(() => 'Seleziona Rimuovi sfondo e controlla l’anteprima del risultato.'), generateScreenshots: f(() => 'Imposta dispositivo, dimensioni, orientamento e ritaglio, quindi seleziona Elabora tutto.'),
    chatOpen: f(() => 'Apri una nuova stanza o collegati con un link della stanza ricevuto.'), chatShareRoomLink: f(() => 'Copia soltanto il link della stanza e condividilo con l’altra persona.'), chatSend: f(() => 'Dopo la connessione, scrivi un messaggio e seleziona Invia.'),
  },
  id: {
    enter: f((n, i) => `Masukkan ${i} di ${n}.`), configure: f((n, i) => `Atur ${i} di ${n}.`), upload: f(() => 'Pilih berkas sumber, lalu atur opsi yang tersedia.'),
    generate: f((_n, _i, o) => `Pilih Buat untuk menghasilkan ${o}.`), liveGenerate: f((_n, _i, o) => `Sesuaikan pengaturan dan amati pembaruan ${o}.`), liveAnalyze: f((_n, _i, o) => `Ubah masukan dan periksa ${o} secara langsung.`), liveConvert: f((_n, _i, o) => `Ubah nilai atau mode dan periksa ${o}.`), livePreview: f(() => 'Sesuaikan pengaturan sambil memeriksa pratinjau langsung.'),
    process: f((n) => `Pilih opsi pemrosesan lalu jalankan ${n}.`), compare: f((_n, _i, o) => `Bandingkan kedua masukan dan periksa ${o}.`), validate: f(() => 'Jalankan Format, Minimalkan, atau Validasi sesuai kebutuhan.'), test: f((_n, _i, o) => `Terapkan pola dan opsi lalu periksa ${o}.`), decode: f((_n, _i, o) => `Masukkan token lalu periksa ${o}.`), calculate: f((_n, _i, o) => `Jalankan perhitungan atau sesuaikan nilai untuk memperbarui ${o}.`), control: f((n) => `Gunakan Mulai, Jeda, dan Atur Ulang untuk mengontrol ${n}.`), randomize: f((_n, _i, o) => `Gunakan tombol aksi untuk memperoleh ${o} baru.`),
    copy: f(() => 'Pilih Salin untuk menyalin hasil.'), download: f(() => 'Pilih Unduh untuk menyimpan hasil.'), copyOrDownload: f(() => 'Salin hasil atau unduh sebagai berkas PNG.'), inspect: f((_n, _i, o) => `Periksa ${o} dan pastikan nilai yang diperlukan.`), save: f((_n, _i, o) => `Simpan nama dan tanggal, lalu periksa kembali ${o}.`),
    qrLiveUpdate: f(() => 'Ubah teks atau ukuran dan pastikan kode QR diperbarui secara otomatis.'), qrExport: f(() => 'Gunakan Salin atau Unduh PNG untuk menyimpan kode QR.'),
    flip: f(() => 'Pilih Lempar koin sekali.'), inspectHistory: f(() => 'Periksa hasil gambar atau angka dan riwayat terbaru.'), repeatOrReset: f(() => 'Lempar lagi atau gunakan Atur Ulang untuk menghapus statistik dan riwayat.'),
    resizerConfigure: f(() => 'Sesuaikan pangkasan, dimensi, atau preset sambil memeriksa pratinjau.'), downloadOrReset: f(() => 'Gunakan Unduh untuk menyimpan hasil atau Atur Ulang untuk memulai lagi.'),
    convertImages: f(() => 'Pilih format dan kualitas keluaran; setelah perubahan, pilih Konversi ulang.'), removeBackground: f(() => 'Pilih Hapus latar belakang dan periksa pratinjau hasil.'), generateScreenshots: f(() => 'Atur perangkat, ukuran, orientasi, dan pangkasan, lalu pilih Proses semua.'),
    chatOpen: f(() => 'Buka ruang baru atau hubungkan dengan tautan ruang yang diterima.'), chatShareRoomLink: f(() => 'Salin hanya tautan ruang lalu bagikan kepada pengguna tujuan.'), chatSend: f(() => 'Setelah terhubung, ketik pesan lalu pilih Kirim.'),
  },
  hi: {
    enter: f((n, i) => `${n} में ${i} दर्ज करें।`), configure: f((n, i) => `${n} में ${i} की सेटिंग चुनें।`), upload: f(() => 'स्रोत फ़ाइल चुनें, फिर उपलब्ध विकल्प सेट करें।'),
    generate: f((_n, _i, o) => `${o} बनाने के लिए जनरेट चुनें।`), liveGenerate: f((_n, _i, o) => `सेटिंग बदलें और ${o} का अपडेट देखें।`), liveAnalyze: f((_n, _i, o) => `इनपुट बदलें और ${o} को तुरंत जाँचें।`), liveConvert: f((_n, _i, o) => `मान या मोड बदलें और ${o} जाँचें।`), livePreview: f(() => 'सेटिंग बदलते हुए लाइव पूर्वावलोकन जाँचें।'),
    process: f((n) => `प्रोसेसिंग विकल्प चुनें और ${n} चलाएँ।`), compare: f((_n, _i, o) => `दोनों इनपुट की तुलना करके ${o} जाँचें।`), validate: f(() => 'ज़रूरत के अनुसार फ़ॉर्मैट, मिनिफ़ाई या वैलिडेट चलाएँ।'), test: f((_n, _i, o) => `पैटर्न और विकल्प लागू करके ${o} जाँचें।`), decode: f((_n, _i, o) => `टोकन दर्ज करके ${o} जाँचें।`), calculate: f((_n, _i, o) => `गणना चलाएँ या मान बदलकर ${o} अपडेट करें।`), control: f((n) => `शुरू, रोकें और रीसेट से ${n} नियंत्रित करें।`), randomize: f((_n, _i, o) => `नया ${o} पाने के लिए कार्रवाई बटन दबाएँ।`),
    copy: f(() => 'नतीजा कॉपी करने के लिए कॉपी बटन चुनें।'), download: f(() => 'नतीजा सहेजने के लिए डाउनलोड बटन चुनें।'), copyOrDownload: f(() => 'नतीजा कॉपी करें या उसे PNG फ़ाइल के रूप में डाउनलोड करें।'), inspect: f((_n, _i, o) => `${o} जाँचें और आवश्यक मानों की पुष्टि करें।`), save: f((_n, _i, o) => `नाम और तारीख सहेजें, फिर ${o} दोबारा जाँचें।`),
    qrLiveUpdate: f(() => 'टेक्स्ट या आकार बदलें और पुष्टि करें कि QR कोड अपने आप अपडेट होता है।'), qrExport: f(() => 'QR कोड सहेजने के लिए कॉपी या PNG डाउनलोड चुनें।'),
    flip: f(() => 'सिक्का उछालें बटन एक बार चुनें।'), inspectHistory: f(() => 'चित या पट का नतीजा और हाल का इतिहास जाँचें।'), repeatOrReset: f(() => 'फिर से उछालें या आँकड़े और इतिहास मिटाने के लिए रीसेट चुनें।'),
    resizerConfigure: f(() => 'लाइव पूर्वावलोकन देखते हुए क्रॉप, आयाम या प्रीसेट बदलें।'), downloadOrReset: f(() => 'नतीजा सहेजने के लिए डाउनलोड या फिर से शुरू करने के लिए रीसेट चुनें।'),
    convertImages: f(() => 'आउटपुट फ़ॉर्मैट और गुणवत्ता चुनें; बदलाव के बाद फिर से कन्वर्ट चुनें।'), removeBackground: f(() => 'पृष्ठभूमि हटाएँ चुनें और नतीजे का पूर्वावलोकन जाँचें।'), generateScreenshots: f(() => 'डिवाइस, आकार, ओरिएंटेशन और क्रॉप सेट करें, फिर सभी प्रोसेस करें चुनें।'),
    chatOpen: f(() => 'नया रूम खोलें या मिले हुए रूम लिंक से जुड़ें।'), chatShareRoomLink: f(() => 'केवल रूम लिंक कॉपी करके संबंधित व्यक्ति से साझा करें।'), chatSend: f(() => 'जुड़ने के बाद संदेश लिखें और भेजें चुनें।'),
  },
};

export function buildLocalizedWorkflow(
  slug: string,
  lang: Language,
  values: WorkflowValues,
): string[] {
  return getToolWorkflow(slug).map(action => workflowPacks[lang][action](values));
}
