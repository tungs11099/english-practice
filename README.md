# 英文闖關樂園

給國小三年級學生使用的純前端英文練習系統。使用 HTML、CSS、JavaScript、瀏覽器 localStorage 和 SpeechSynthesis，沒有後端、帳號、付費 API、廣告或追蹤服務。所有內建內容均為「示範資料，非特定課本正式內容」。

## 啟動

直接開啟 `index.html` 可使用一般功能，但瀏覽器不會在 `file://` 啟用 PWA。要測試 PWA，請在專案目錄執行：

```sh
python3 -m http.server 8000
```

瀏覽 `http://localhost:8000`。不需安裝相依套件。

## PWA 安裝與離線使用

本網站支援安裝至 Android、桌面 Chromium 系瀏覽器，以及可加入主畫面的 iOS/iPadOS Safari。必須透過 HTTPS，或在同一台電腦上的 `http://localhost` 開啟；一般 HTTP 網站及 `file://` 不會啟用 Service Worker。安裝的應用程式名稱為「國小三年級英文闖關樂園」。

### Ubuntu 本機測試

```sh
cd /path/to/english-practice
python3 -m http.server 8000
```

在 Chrome/Chromium 開啟 `http://localhost:8000`。初次載入需在線上完成一次，待 Service Worker 安裝後可在開發者工具的 Application 面板確認 manifest、圖示與 Cache Storage。可使用瀏覽器離線模式重新載入，確認首頁、單字學習、闖關、錯題、紀錄、教材管理及本機 CSV 都可開啟。語音播放仰賴裝置內建的 SpeechSynthesis 語音引擎；離線可用與否取決於裝置是否已有英文語音。

離線驗證步驟：開啟網站並等待安裝完成，先瀏覽主要頁面；在 DevTools → Network 勾選 Offline，再重新載入及操作；解除 Offline 後重新載入。檢查 Console 無資源 404，並以 320px 寬度或裝置工具列檢查手機版按鈕可操作。可至 Application → Service Workers 點擊 Update 驗證更新提示；按「立即更新」後會切換版本並重新載入。每次發佈資源後，請將 `sw.js` 的 `CACHE_NAME` 版本號加一。

### HTTPS 部署

將整個專案目錄（包含 `index.html`、`manifest.webmanifest`、`sw.js`、`js/`、`data/`、`icons/`）原樣上傳至 HTTPS 靜態網站主機。部署到網域根目錄或子目錄皆可，例如 `https://example.com/english/`；不要把 `sw.js` 放到應用程式目錄以外。伺服器應以 `application/manifest+json`（或 `application/json`）提供 manifest，以正確 MIME type 提供 JavaScript、CSS、SVG、PNG，並讓 `sw.js` 可重新驗證或設定短期快取，避免部署新版本後舊 worker 一直拿到舊的 worker 檔。部署後直接開啟子目錄首頁，確認 Service Worker scope 位於該子目錄且圖示、樣式與教材皆成功載入。

### 安裝步驟

- **Android 手機／平板（Chrome）**：以 HTTPS 網址開啟網站並先載入一次；點頁面上的「安裝」，或 Chrome ⋮ →「安裝應用程式／加入主畫面」，再確認。若沒有安裝提示，請先重新整理並確認網站已透過 HTTPS 載入。
- **iPhone／iPad**：在 Safari 開啟 HTTPS 網址，點「分享」按鈕 →「加入主畫面」→「加入」。iOS/iPadOS 的加入主畫面不依賴頁面內的瀏覽器安裝提示。
- **不支援安裝提示的瀏覽器**：使用瀏覽器的分享或選單，選「加入主畫面」或「建立捷徑」。

### 離線與資料限制

Service Worker 預先快取應用程式外殼、程式、樣式、圖示及內建範例 CSV；完成首次線上載入後，這些主要功能可離線使用。從未載入過的外部網址不會離線提供。使用者匯入的教材與學習紀錄存在該瀏覽器的 localStorage，不會放進共用快取，也不會自動跨裝置、瀏覽器或網站網址同步。清除網站資料或使用無痕模式可能移除資料；請透過教材管理定期匯出 JSON 並自行保管，再於其他裝置還原。語音使用系統 SpeechSynthesis，特定英文語音可能需要網路或先行安裝語音包。

## 檔案

- `index.html`：首頁及功能頁面
- `style.css`：響應式樣式、觸控尺寸及減少動態效果設定
- `js/words.js`：示範教材資料
- `js/storage.js`：教材、統計、錯題及關卡紀錄的 localStorage 管理
- `js/quiz.js`：共用洗牌、選項去重、題目產生和門檻
- `js/speech.js`：瀏覽器英文語音播放
- `js/import-export.js`：安全 CSV 解析及 CSV 範例下載
- `js/app.js`：頁面互動和畫面呈現
- `data/sample-words.csv`：可供匯入的 CSV 範例
- `manifest.webmanifest`、`sw.js`、`js/pwa.js`：PWA 安裝資訊、離線快取與更新提示
- `icons/`：SVG 與 192、512 像素 PNG 應用程式圖示（含 maskable 圖示）

## 使用教材

首頁「課本單元」可檢視目前教材。「教材管理」可以下載 CSV 範例，填入下列欄位後匯入：

```csv
english,chinese,example,exampleChinese,category,semester,lesson
apple,蘋果,"I eat an apple.",我吃一顆蘋果。,水果,上學期,第1課
```

CSV 支援雙引號包住含逗號的欄位，以及以 `""` 表示欄位中的雙引號。匯入前會列出逐列預覽與錯誤；相同英文、學期和課次會略過。教材管理可停用或刪除單字。程式只解析 CSV 文字，不會執行匯入內容。

新增內建單字請編輯 `js/words.js` 的 `SAMPLE_WORDS` 陣列，欄位格式為 `{id, english, chinese, example, exampleChinese, category, semester, lesson, image, phonetic, enabled}`。

## 備份及紀錄

「教材管理」可匯出 JSON 備份，還原時會先確認並檢查教材欄位及識別碼。紀錄含回合、答題、熟悉度、錯題、星星、關卡、單元練習次數和最後練習時間。localStorage 只屬於目前瀏覽器／網站來源；清除瀏覽器網站資料、使用無痕模式、換裝置或瀏覽器不會同步。容量有限，瀏覽器拒絕儲存時無法持續記錄，建議定期下載 JSON 備份。`file://` 下各瀏覽器行為不同，遇到儲存問題請用本機伺服器啟動。

## 功能狀態

已實作：首頁進度、星星與關卡統計、單字篩選及熟悉度、單字和例句發音、四種 4 選 1 題型、最多 10 題且題目不重複、答題回饋、80% 通關、每關首次三顆星、錯題複習、紀錄、CSV 匯入預覽與管理、JSON 備份還原、手機版版面。

測試方式：

```sh
node --check js/app.js
node --check js/storage.js
node --check js/quiz.js
node --check js/import-export.js
```

瀏覽器操作檢查：首頁逐一開啟導覽項目；以不同模式完成一回合並檢查分數與錯題；闖關先以 8/10 答對測通關，再重玩確認星星不增加；匯入 `data/sample-words.csv` 並檢查管理清單；匯出 JSON 後還原；縮小視窗檢查手機排版。瀏覽器語音需裝置支援，且有些瀏覽器需要由使用者點擊才可播放。
