import type { Language } from './types';

type WorkflowAction =
  | 'enter' | 'configure' | 'upload'
  | 'generate' | 'liveGenerate' | 'liveAnalyze' | 'liveConvert' | 'livePreview'
  | 'process' | 'compare' | 'validate' | 'test' | 'decode' | 'calculate' | 'control' | 'randomize'
  | 'copy' | 'download' | 'copyOrDownload' | 'inspect' | 'save'
  | 'chatOpen' | 'chatShareRoomLink' | 'chatSend';

type ToolWorkflow = readonly [WorkflowAction, WorkflowAction, WorkflowAction];

const toolWorkflows = {
  'qr-code': ['enter', 'generate', 'copyOrDownload'],
  password: ['configure', 'generate', 'copy'],
  uuid: ['configure', 'generate', 'copy'],
  'lorem-ipsum': ['configure', 'generate', 'copy'],
  'color-palette': ['configure', 'liveGenerate', 'copy'],
  hash: ['enter', 'liveAnalyze', 'copy'],
  color: ['enter', 'liveConvert', 'copy'],
  unit: ['configure', 'liveConvert', 'inspect'],
  base64: ['configure', 'liveConvert', 'copy'],
  'image-converter': ['upload', 'process', 'download'],
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
  'image-resizer': ['upload', 'process', 'download'],
  exif: ['upload', 'liveAnalyze', 'inspect'],
  'background-remover': ['upload', 'process', 'download'],
  'image-metadata': ['upload', 'liveAnalyze', 'inspect'],
  'appstore-screenshot': ['upload', 'process', 'download'],
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
  'coin-flip': ['configure', 'randomize', 'inspect'],
  dice: ['configure', 'randomize', 'inspect'],
  'kor-eng': ['configure', 'liveConvert', 'copy'],
  'anonymous-chat': ['chatOpen', 'chatShareRoomLink', 'chatSend'],
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
    enter: f((n, i) => `${n} 화면에서 ${i} 값을 입력합니다.`), configure: f((n, i) => `${n} 화면에서 ${i} 설정을 선택합니다.`), upload: f((n, i) => `${i} 파일을 ${n}에 추가합니다.`),
    generate: f((_n, _i, o) => `생성 버튼을 눌러 ${o} 항목을 만듭니다.`), liveGenerate: f((_n, _i, o) => `설정을 조정하면서 ${o} 항목이 갱신되는지 확인합니다.`), liveAnalyze: f((_n, _i, o) => `입력을 바꾸며 ${o} 항목을 실시간으로 확인합니다.`), liveConvert: f((_n, _i, o) => `값이나 모드를 바꾸며 ${o} 항목이 변환되는지 확인합니다.`), livePreview: f((_n, _i, o) => `설정을 조정하며 ${o} 미리보기를 확인합니다.`),
    process: f((n) => `처리 옵션을 정한 뒤 ${n} 실행 버튼을 누릅니다.`), compare: f((_n, _i, o) => `두 입력을 비교해 ${o} 항목을 확인합니다.`), validate: f(() => '서식 지정·축소·검증 중 필요한 작업을 실행합니다.'), test: f((_n, _i, o) => `패턴과 플래그를 적용해 ${o} 항목을 확인합니다.`), decode: f((_n, _i, o) => `토큰을 입력해 ${o} 항목을 확인합니다.`), calculate: f((_n, _i, o) => `계산 버튼을 누르거나 값을 조정해 ${o} 항목을 확인합니다.`), control: f((n) => `시작·일시정지·재설정 버튼으로 ${n} 상태를 제어합니다.`), randomize: f((_n, _i, o) => `실행 버튼을 눌러 ${o} 항목을 새로 만듭니다.`),
    copy: f((_n, _i, o) => `${o} 항목에서 복사 버튼을 누릅니다.`), download: f((_n, _i, o) => `${o} 파일을 다운로드합니다.`), copyOrDownload: f((_n, _i, o) => `${o} 항목을 복사하거나 PNG 파일로 다운로드합니다.`), inspect: f((_n, _i, o) => `${o} 항목을 검토하고 필요한 값을 확인합니다.`), save: f((_n, _i, o) => `이름과 날짜를 저장한 뒤 ${o} 항목을 다시 확인합니다.`),
    chatOpen: f(() => '새 방을 열거나 받은 방 링크로 연결을 시작합니다.'), chatShareRoomLink: f(() => '상대방에게 전달할 방 링크만 복사해 공유합니다.'), chatSend: f(() => '연결되면 메시지를 입력하고 전송 버튼을 눌러 대화합니다.'),
  },
  en: {
    enter: f((n, i) => `Enter ${i} in ${n}.`), configure: f((n, i) => `Choose ${i} settings in ${n}.`), upload: f((n, i) => `Add ${i} to ${n}.`),
    generate: f((_n, _i, o) => `Select Generate to create ${o}.`), liveGenerate: f((_n, _i, o) => `Adjust the settings and watch ${o} update.`), liveAnalyze: f((_n, _i, o) => `Change the input and review ${o} in real time.`), liveConvert: f((_n, _i, o) => `Change the value or mode and review ${o}.`), livePreview: f((_n, _i, o) => `Adjust the settings while reviewing the ${o} preview.`),
    process: f((n) => `Choose the processing options, then run ${n}.`), compare: f((_n, _i, o) => `Compare both inputs and inspect ${o}.`), validate: f(() => 'Run Format, Minify, or Validate for the required JSON operation.'), test: f((_n, _i, o) => `Apply the pattern and flags, then inspect ${o}.`), decode: f((_n, _i, o) => `Enter the token and inspect ${o}.`), calculate: f((_n, _i, o) => `Run the calculation or adjust the values to update ${o}.`), control: f((n) => `Use Start, Pause, and Reset to control ${n}.`), randomize: f((_n, _i, o) => `Use the action button to produce new ${o}.`),
    copy: f((_n, _i, o) => `Use Copy beside ${o}.`), download: f((_n, _i, o) => `Download the ${o} file.`), copyOrDownload: f((_n, _i, o) => `Copy ${o} or download it as a PNG file.`), inspect: f((_n, _i, o) => `Review ${o} and confirm the values you need.`), save: f((_n, _i, o) => `Save the name and date, then review ${o} again.`),
    chatOpen: f(() => 'Open a new room or connect with a received room link.'), chatShareRoomLink: f(() => 'Copy only the room link and share it with the intended peer.'), chatSend: f(() => 'Once connected, type a message and select Send to chat.'),
  },
  ja: {
    enter: f((n, i) => `${n} に ${i} を入力します。`), configure: f((n, i) => `${n} で ${i} の設定を選びます。`), upload: f((n, i) => `${i} を ${n} に追加します。`),
    generate: f((_n, _i, o) => `生成ボタンを押して ${o} を作成します。`), liveGenerate: f((_n, _i, o) => `設定を調整しながら ${o} の更新を確認します。`), liveAnalyze: f((_n, _i, o) => `入力を変更し、${o} をリアルタイムで確認します。`), liveConvert: f((_n, _i, o) => `値またはモードを変更して ${o} を確認します。`), livePreview: f((_n, _i, o) => `設定を調整しながら ${o} のプレビューを確認します。`),
    process: f((n) => `処理オプションを選び、${n} を実行します。`), compare: f((_n, _i, o) => `2つの入力を比較して ${o} を確認します。`), validate: f(() => '必要に応じて整形、圧縮、検証を実行します。'), test: f((_n, _i, o) => `パターンとフラグを適用して ${o} を確認します。`), decode: f((_n, _i, o) => `トークンを入力して ${o} を確認します。`), calculate: f((_n, _i, o) => `計算を実行するか値を調整して ${o} を更新します。`), control: f((n) => `開始、一時停止、リセットで ${n} を操作します。`), randomize: f((_n, _i, o) => `実行ボタンを押して新しい ${o} を生成します。`),
    copy: f((_n, _i, o) => `${o} の横にあるコピーボタンを押します。`), download: f((_n, _i, o) => `${o} のファイルをダウンロードします。`), copyOrDownload: f((_n, _i, o) => `${o} をコピーするか PNG ファイルでダウンロードします。`), inspect: f((_n, _i, o) => `${o} を確認し、必要な値を検証します。`), save: f((_n, _i, o) => `名前と日付を保存して ${o} を再確認します。`),
    chatOpen: f(() => '新しいルームを開くか、受け取ったルームリンクで接続します。'), chatShareRoomLink: f(() => '相手に渡すルームリンクだけをコピーして共有します。'), chatSend: f(() => '接続後にメッセージを入力し、送信ボタンを押します。'),
  },
  'zh-CN': {
    enter: f((n, i) => `在 ${n} 中输入${i}。`), configure: f((n, i) => `在 ${n} 中选择${i}设置。`), upload: f((n, i) => `将${i}添加到 ${n}。`),
    generate: f((_n, _i, o) => `点击生成按钮创建${o}。`), liveGenerate: f((_n, _i, o) => `调整设置并观察${o}更新。`), liveAnalyze: f((_n, _i, o) => `更改输入并实时查看${o}。`), liveConvert: f((_n, _i, o) => `更改数值或模式并查看${o}。`), livePreview: f((_n, _i, o) => `调整设置并查看${o}预览。`),
    process: f((n) => `选择处理选项，然后运行 ${n}。`), compare: f((_n, _i, o) => `比较两项输入并查看${o}。`), validate: f(() => '根据需要运行格式化、压缩或验证。'), test: f((_n, _i, o) => `应用模式和标志并查看${o}。`), decode: f((_n, _i, o) => `输入令牌并查看${o}。`), calculate: f((_n, _i, o) => `执行计算或调整数值以更新${o}。`), control: f((n) => `使用开始、暂停和重置控制 ${n}。`), randomize: f((_n, _i, o) => `点击操作按钮生成新的${o}。`),
    copy: f((_n, _i, o) => `点击${o}旁的复制按钮。`), download: f((_n, _i, o) => `下载${o}文件。`), copyOrDownload: f((_n, _i, o) => `复制${o}或下载 PNG 文件。`), inspect: f((_n, _i, o) => `检查${o}并确认所需数值。`), save: f((_n, _i, o) => `保存名称和日期，然后再次检查${o}。`),
    chatOpen: f(() => '创建新房间或使用收到的房间链接连接。'), chatShareRoomLink: f(() => '只复制房间链接并分享给对方。'), chatSend: f(() => '连接后输入消息并点击发送。'),
  },
  'zh-TW': {
    enter: f((n, i) => `在 ${n} 輸入${i}。`), configure: f((n, i) => `在 ${n} 選擇${i}設定。`), upload: f((n, i) => `將${i}加入 ${n}。`),
    generate: f((_n, _i, o) => `按下產生按鈕建立${o}。`), liveGenerate: f((_n, _i, o) => `調整設定並觀察${o}更新。`), liveAnalyze: f((_n, _i, o) => `變更輸入並即時查看${o}。`), liveConvert: f((_n, _i, o) => `變更數值或模式並查看${o}。`), livePreview: f((_n, _i, o) => `調整設定並查看${o}預覽。`),
    process: f((n) => `選擇處理選項，然後執行 ${n}。`), compare: f((_n, _i, o) => `比較兩項輸入並查看${o}。`), validate: f(() => '依需要執行格式化、壓縮或驗證。'), test: f((_n, _i, o) => `套用模式與旗標並查看${o}。`), decode: f((_n, _i, o) => `輸入權杖並查看${o}。`), calculate: f((_n, _i, o) => `執行計算或調整數值以更新${o}。`), control: f((n) => `使用開始、暫停與重設控制 ${n}。`), randomize: f((_n, _i, o) => `按下操作按鈕產生新的${o}。`),
    copy: f((_n, _i, o) => `按下${o}旁的複製按鈕。`), download: f((_n, _i, o) => `下載${o}檔案。`), copyOrDownload: f((_n, _i, o) => `複製${o}或下載 PNG 檔案。`), inspect: f((_n, _i, o) => `檢查${o}並確認所需數值。`), save: f((_n, _i, o) => `儲存名稱與日期，然後再次檢查${o}。`),
    chatOpen: f(() => '建立新房間或使用收到的房間連結連線。'), chatShareRoomLink: f(() => '只複製房間連結並分享給對方。'), chatSend: f(() => '連線後輸入訊息並按下傳送。'),
  },
  es: {
    enter: f((n, i) => `Introduce ${i} en ${n}.`), configure: f((n, i) => `Configura ${i} en ${n}.`), upload: f((n, i) => `Añade ${i} a ${n}.`),
    generate: f((_n, _i, o) => `Pulsa Generar para crear el resultado: ${o}.`), liveGenerate: f((_n, _i, o) => `Ajusta la configuración y observa cómo se actualiza el resultado: ${o}.`), liveAnalyze: f((_n, _i, o) => `Cambia la entrada y revisa en tiempo real el resultado: ${o}.`), liveConvert: f((_n, _i, o) => `Cambia el valor o el modo y revisa el resultado: ${o}.`), livePreview: f((_n, _i, o) => `Ajusta la configuración mientras revisas la vista previa del resultado: ${o}.`),
    process: f((n) => `Elige las opciones de procesamiento y ejecuta ${n}.`), compare: f((_n, _i, o) => `Compara ambas entradas y revisa el resultado: ${o}.`), validate: f(() => 'Ejecuta Formatear, Minimizar o Validar según la operación necesaria.'), test: f((_n, _i, o) => `Aplica el patrón y las opciones, y revisa el resultado: ${o}.`), decode: f((_n, _i, o) => `Introduce el token y revisa el resultado: ${o}.`), calculate: f((_n, _i, o) => `Ejecuta el cálculo o ajusta los valores para actualizar el resultado: ${o}.`), control: f((n) => `Usa Iniciar, Pausar y Reiniciar para controlar ${n}.`), randomize: f((_n, _i, o) => `Pulsa el botón de acción para obtener un nuevo resultado: ${o}.`),
    copy: f((_n, _i, o) => `Pulsa Copiar junto al resultado: ${o}.`), download: f((_n, _i, o) => `Descarga el archivo del resultado: ${o}.`), copyOrDownload: f((_n, _i, o) => `Copia el resultado o descarga el archivo PNG: ${o}.`), inspect: f((_n, _i, o) => `Revisa el resultado y confirma los valores necesarios: ${o}.`), save: f((_n, _i, o) => `Guarda el nombre y la fecha, y vuelve a revisar el resultado: ${o}.`),
    chatOpen: f(() => 'Abre una sala nueva o conéctate con un enlace de la sala recibido.'), chatShareRoomLink: f(() => 'Copia solo el enlace de la sala y compártelo con la otra persona.'), chatSend: f(() => 'Cuando se conecte, escribe un mensaje y pulsa Enviar.'),
  },
  pt: {
    enter: f((n, i) => `Insira ${i} em ${n}.`), configure: f((n, i) => `Configure ${i} em ${n}.`), upload: f((n, i) => `Adicione ${i} a ${n}.`),
    generate: f((_n, _i, o) => `Selecione Gerar para criar o resultado: ${o}.`), liveGenerate: f((_n, _i, o) => `Ajuste as configurações e acompanhe a atualização do resultado: ${o}.`), liveAnalyze: f((_n, _i, o) => `Altere a entrada e confira em tempo real o resultado: ${o}.`), liveConvert: f((_n, _i, o) => `Altere o valor ou modo e confira o resultado: ${o}.`), livePreview: f((_n, _i, o) => `Ajuste as configurações enquanto confere a prévia do resultado: ${o}.`),
    process: f((n) => `Escolha as opções de processamento e execute ${n}.`), compare: f((_n, _i, o) => `Compare as duas entradas e confira o resultado: ${o}.`), validate: f(() => 'Execute Formatar, Minimizar ou Validar conforme a operação necessária.'), test: f((_n, _i, o) => `Aplique o padrão e as opções e confira o resultado: ${o}.`), decode: f((_n, _i, o) => `Insira o token e confira o resultado: ${o}.`), calculate: f((_n, _i, o) => `Execute o cálculo ou ajuste os valores para atualizar o resultado: ${o}.`), control: f((n) => `Use Iniciar, Pausar e Redefinir para controlar ${n}.`), randomize: f((_n, _i, o) => `Use o botão de ação para obter um novo resultado: ${o}.`),
    copy: f((_n, _i, o) => `Selecione Copiar ao lado do resultado: ${o}.`), download: f((_n, _i, o) => `Baixe o arquivo do resultado: ${o}.`), copyOrDownload: f((_n, _i, o) => `Copie o resultado ou baixe o arquivo PNG: ${o}.`), inspect: f((_n, _i, o) => `Confira o resultado e confirme os valores necessários: ${o}.`), save: f((_n, _i, o) => `Salve o nome e a data e confira novamente o resultado: ${o}.`),
    chatOpen: f(() => 'Abra uma nova sala ou conecte-se com um link da sala recebido.'), chatShareRoomLink: f(() => 'Copie apenas o link da sala e compartilhe com a outra pessoa.'), chatSend: f(() => 'Após a conexão, digite uma mensagem e selecione Enviar.'),
  },
  de: {
    enter: f((n, i) => `Geben Sie ${i} in ${n} ein.`), configure: f((n, i) => `Legen Sie ${i} in ${n} fest.`), upload: f((n, i) => `Fügen Sie ${i} zu ${n} hinzu.`),
    generate: f((_n, _i, o) => `Wählen Sie Erzeugen, um ${o} zu erstellen.`), liveGenerate: f((_n, _i, o) => `Ändern Sie die Einstellungen und beobachten Sie die Aktualisierung von ${o}.`), liveAnalyze: f((_n, _i, o) => `Ändern Sie die Eingabe und prüfen Sie ${o} in Echtzeit.`), liveConvert: f((_n, _i, o) => `Ändern Sie Wert oder Modus und prüfen Sie ${o}.`), livePreview: f((_n, _i, o) => `Passen Sie die Einstellungen an und prüfen Sie die Vorschau von ${o}.`),
    process: f((n) => `Wählen Sie die Verarbeitungsoptionen und starten Sie ${n}.`), compare: f((_n, _i, o) => `Vergleichen Sie beide Eingaben und prüfen Sie ${o}.`), validate: f(() => 'Führen Sie je nach Bedarf Formatieren, Minimieren oder Validieren aus.'), test: f((_n, _i, o) => `Wenden Sie Muster und Optionen an und prüfen Sie ${o}.`), decode: f((_n, _i, o) => `Geben Sie das Token ein und prüfen Sie ${o}.`), calculate: f((_n, _i, o) => `Starten Sie die Berechnung oder ändern Sie Werte, um ${o} zu aktualisieren.`), control: f((n) => `Steuern Sie ${n} mit Start, Pause und Zurücksetzen.`), randomize: f((_n, _i, o) => `Betätigen Sie die Aktion, um neue ${o} zu erzeugen.`),
    copy: f((_n, _i, o) => `Wählen Sie Kopieren neben ${o}.`), download: f((_n, _i, o) => `Laden Sie die Datei für ${o} herunter.`), copyOrDownload: f((_n, _i, o) => `Kopieren Sie ${o} oder laden Sie die PNG-Datei herunter.`), inspect: f((_n, _i, o) => `Prüfen Sie ${o} und bestätigen Sie die benötigten Werte.`), save: f((_n, _i, o) => `Speichern Sie Name und Datum und prüfen Sie ${o} erneut.`),
    chatOpen: f(() => 'Öffnen Sie einen neuen Raum oder verbinden Sie sich über einen erhaltenen Raumlink.'), chatShareRoomLink: f(() => 'Kopieren Sie nur den Raumlink und teilen Sie ihn mit der anderen Person.'), chatSend: f(() => 'Geben Sie nach der Verbindung eine Nachricht ein und wählen Sie Senden.'),
  },
  fr: {
    enter: f((n, i) => `Saisissez ${i} dans ${n}.`), configure: f((n, i) => `Configurez ${i} dans ${n}.`), upload: f((n, i) => `Ajoutez ${i} à ${n}.`),
    generate: f((_n, _i, o) => `Choisissez Générer pour créer le résultat : ${o}.`), liveGenerate: f((_n, _i, o) => `Ajustez les réglages et observez la mise à jour du résultat : ${o}.`), liveAnalyze: f((_n, _i, o) => `Modifiez la saisie et examinez en direct le résultat : ${o}.`), liveConvert: f((_n, _i, o) => `Modifiez la valeur ou le mode et examinez le résultat : ${o}.`), livePreview: f((_n, _i, o) => `Ajustez les réglages tout en examinant l’aperçu du résultat : ${o}.`),
    process: f((n) => `Choisissez les options de traitement, puis lancez ${n}.`), compare: f((_n, _i, o) => `Comparez les deux saisies et examinez le résultat : ${o}.`), validate: f(() => 'Exécutez Formater, Réduire ou Valider selon l’opération nécessaire.'), test: f((_n, _i, o) => `Appliquez le motif et les options, puis examinez le résultat : ${o}.`), decode: f((_n, _i, o) => `Saisissez le jeton et examinez le résultat : ${o}.`), calculate: f((_n, _i, o) => `Lancez le calcul ou ajustez les valeurs pour actualiser le résultat : ${o}.`), control: f((n) => `Utilisez Démarrer, Pause et Réinitialiser pour contrôler ${n}.`), randomize: f((_n, _i, o) => `Utilisez le bouton d’action pour obtenir un nouveau résultat : ${o}.`),
    copy: f((_n, _i, o) => `Choisissez Copier à côté du résultat : ${o}.`), download: f((_n, _i, o) => `Téléchargez le fichier du résultat : ${o}.`), copyOrDownload: f((_n, _i, o) => `Copiez le résultat ou téléchargez le fichier PNG : ${o}.`), inspect: f((_n, _i, o) => `Examinez le résultat et confirmez les valeurs nécessaires : ${o}.`), save: f((_n, _i, o) => `Enregistrez le nom et la date, puis examinez à nouveau le résultat : ${o}.`),
    chatOpen: f(() => 'Ouvrez un nouveau salon ou connectez-vous avec un lien du salon reçu.'), chatShareRoomLink: f(() => 'Copiez uniquement le lien du salon et partagez-le avec l’autre personne.'), chatSend: f(() => 'Une fois connecté, saisissez un message et choisissez Envoyer.'),
  },
  it: {
    enter: f((n, i) => `Inserisci ${i} in ${n}.`), configure: f((n, i) => `Configura ${i} in ${n}.`), upload: f((n, i) => `Aggiungi ${i} a ${n}.`),
    generate: f((_n, _i, o) => `Seleziona Genera per creare il risultato: ${o}.`), liveGenerate: f((_n, _i, o) => `Regola le impostazioni e osserva l’aggiornamento del risultato: ${o}.`), liveAnalyze: f((_n, _i, o) => `Modifica l’input e controlla in tempo reale il risultato: ${o}.`), liveConvert: f((_n, _i, o) => `Modifica il valore o la modalità e controlla il risultato: ${o}.`), livePreview: f((_n, _i, o) => `Regola le impostazioni mentre controlli l’anteprima del risultato: ${o}.`),
    process: f((n) => `Scegli le opzioni di elaborazione e avvia ${n}.`), compare: f((_n, _i, o) => `Confronta i due input e controlla il risultato: ${o}.`), validate: f(() => 'Esegui Formatta, Riduci o Convalida secondo l’operazione richiesta.'), test: f((_n, _i, o) => `Applica il modello e le opzioni e controlla il risultato: ${o}.`), decode: f((_n, _i, o) => `Inserisci il token e controlla il risultato: ${o}.`), calculate: f((_n, _i, o) => `Esegui il calcolo o regola i valori per aggiornare il risultato: ${o}.`), control: f((n) => `Usa Avvia, Pausa e Reimposta per controllare ${n}.`), randomize: f((_n, _i, o) => `Usa il pulsante di azione per ottenere un nuovo risultato: ${o}.`),
    copy: f((_n, _i, o) => `Seleziona Copia accanto al risultato: ${o}.`), download: f((_n, _i, o) => `Scarica il file del risultato: ${o}.`), copyOrDownload: f((_n, _i, o) => `Copia il risultato o scarica il file PNG: ${o}.`), inspect: f((_n, _i, o) => `Controlla il risultato e conferma i valori necessari: ${o}.`), save: f((_n, _i, o) => `Salva il nome e la data, quindi controlla di nuovo il risultato: ${o}.`),
    chatOpen: f(() => 'Apri una nuova stanza o collegati con un link della stanza ricevuto.'), chatShareRoomLink: f(() => 'Copia soltanto il link della stanza e condividilo con l’altra persona.'), chatSend: f(() => 'Dopo la connessione, scrivi un messaggio e seleziona Invia.'),
  },
  id: {
    enter: f((n, i) => `Masukkan ${i} di ${n}.`), configure: f((n, i) => `Atur ${i} di ${n}.`), upload: f((n, i) => `Tambahkan ${i} ke ${n}.`),
    generate: f((_n, _i, o) => `Pilih Buat untuk menghasilkan ${o}.`), liveGenerate: f((_n, _i, o) => `Sesuaikan pengaturan dan amati pembaruan ${o}.`), liveAnalyze: f((_n, _i, o) => `Ubah masukan dan periksa ${o} secara langsung.`), liveConvert: f((_n, _i, o) => `Ubah nilai atau mode dan periksa ${o}.`), livePreview: f((_n, _i, o) => `Sesuaikan pengaturan sambil memeriksa pratinjau ${o}.`),
    process: f((n) => `Pilih opsi pemrosesan lalu jalankan ${n}.`), compare: f((_n, _i, o) => `Bandingkan kedua masukan dan periksa ${o}.`), validate: f(() => 'Jalankan Format, Minimalkan, atau Validasi sesuai kebutuhan.'), test: f((_n, _i, o) => `Terapkan pola dan opsi lalu periksa ${o}.`), decode: f((_n, _i, o) => `Masukkan token lalu periksa ${o}.`), calculate: f((_n, _i, o) => `Jalankan perhitungan atau sesuaikan nilai untuk memperbarui ${o}.`), control: f((n) => `Gunakan Mulai, Jeda, dan Atur Ulang untuk mengontrol ${n}.`), randomize: f((_n, _i, o) => `Gunakan tombol aksi untuk memperoleh ${o} baru.`),
    copy: f((_n, _i, o) => `Pilih Salin di samping ${o}.`), download: f((_n, _i, o) => `Unduh berkas ${o}.`), copyOrDownload: f((_n, _i, o) => `Salin ${o} atau unduh berkas PNG.`), inspect: f((_n, _i, o) => `Periksa ${o} dan pastikan nilai yang diperlukan.`), save: f((_n, _i, o) => `Simpan nama dan tanggal, lalu periksa kembali ${o}.`),
    chatOpen: f(() => 'Buka ruang baru atau hubungkan dengan tautan ruang yang diterima.'), chatShareRoomLink: f(() => 'Salin hanya tautan ruang lalu bagikan kepada pengguna tujuan.'), chatSend: f(() => 'Setelah terhubung, ketik pesan lalu pilih Kirim.'),
  },
  hi: {
    enter: f((n, i) => `${n} में ${i} दर्ज करें।`), configure: f((n, i) => `${n} में ${i} की सेटिंग चुनें।`), upload: f((n, i) => `${i} को ${n} में जोड़ें।`),
    generate: f((_n, _i, o) => `${o} बनाने के लिए जनरेट चुनें।`), liveGenerate: f((_n, _i, o) => `सेटिंग बदलें और ${o} का अपडेट देखें।`), liveAnalyze: f((_n, _i, o) => `इनपुट बदलें और ${o} को तुरंत जाँचें।`), liveConvert: f((_n, _i, o) => `मान या मोड बदलें और ${o} जाँचें।`), livePreview: f((_n, _i, o) => `सेटिंग बदलते हुए ${o} का पूर्वावलोकन जाँचें।`),
    process: f((n) => `प्रोसेसिंग विकल्प चुनें और ${n} चलाएँ।`), compare: f((_n, _i, o) => `दोनों इनपुट की तुलना करके ${o} जाँचें।`), validate: f(() => 'ज़रूरत के अनुसार फ़ॉर्मैट, मिनिफ़ाई या वैलिडेट चलाएँ।'), test: f((_n, _i, o) => `पैटर्न और विकल्प लागू करके ${o} जाँचें।`), decode: f((_n, _i, o) => `टोकन दर्ज करके ${o} जाँचें।`), calculate: f((_n, _i, o) => `गणना चलाएँ या मान बदलकर ${o} अपडेट करें।`), control: f((n) => `शुरू, रोकें और रीसेट से ${n} नियंत्रित करें।`), randomize: f((_n, _i, o) => `नया ${o} पाने के लिए कार्रवाई बटन दबाएँ।`),
    copy: f((_n, _i, o) => `${o} के पास कॉपी चुनें।`), download: f((_n, _i, o) => `${o} की फ़ाइल डाउनलोड करें।`), copyOrDownload: f((_n, _i, o) => `${o} कॉपी करें या PNG फ़ाइल डाउनलोड करें।`), inspect: f((_n, _i, o) => `${o} जाँचें और आवश्यक मानों की पुष्टि करें।`), save: f((_n, _i, o) => `नाम और तारीख सहेजें, फिर ${o} दोबारा जाँचें।`),
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
