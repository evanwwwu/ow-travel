/**
 * DIVE TEAM 2026 — Google Apps Script
 *
 * 設定步驟：
 * 1. 開啟 Google 試算表 → 選單「擴充功能」→「Apps Script」
 * 2. 將此檔案全部內容貼入編輯器（取代預設內容），存檔
 * 3. 點選「部署」→「新增部署作業」
 *    - 類型：網頁應用程式
 *    - 執行身分：我（你的 Google 帳戶）
 *    - 存取權：所有人（Anyone）
 * 4. 按「部署」→ 複製「網頁應用程式 URL」
 * 5. 將 URL 貼入 js/register.js 的 APPS_SCRIPT_URL 變數
 *
 * 重新部署後記得點「管理部署作業」→「編輯」→ 版本選「新版本」→ 部署
 */

const SHEET_NAME = 'registrations';

// ── POST：新增報名 ──────────────────────────────────────────
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    const data  = JSON.parse(e.postData.contents);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['提交時間', '姓名', '手機號碼', 'Email', '報名人數', '備註']);
      sheet.setFrozenRows(1);
      const h = sheet.getRange(1, 1, 1, 6);
      h.setBackground('#1a3d6b');
      h.setFontColor('#ffffff');
      h.setFontWeight('bold');
    }

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('zh-TW'),
      data.name  || '',
      data.phone || '',
      data.email || '',
      data.count || '',
      data.notes || '',
    ]);

    return jsonResponse({ result: 'success' });

  } catch (err) {
    return jsonResponse({ result: 'error', message: err.toString() });
  }
}

// ── GET：回傳統計資料 ───────────────────────────────────────
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const total = Math.max(0, sheet.getLastRow() - 1);

    return jsonResponse({
      total,
      updatedAt: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    });

  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ── 工具函式 ───────────────────────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
