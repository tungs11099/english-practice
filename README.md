# 英文闖關樂園

給國小三年級學生使用的純前端英文練習系統。使用 HTML、CSS、JavaScript、瀏覽器 localStorage 和 SpeechSynthesis，沒有後端、帳號、付費 API、廣告或追蹤服務。所有內建內容均為「示範資料，非特定課本正式內容」。

## 啟動

直接開啟 `index.html`，或在專案目錄執行：

```sh
python3 -m http.server 8000
```

瀏覽 `http://localhost:8000`。不需安裝相依套件。

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
