/ 1. Web App ekata Sheet eke thiyena Tabs 4ma Data yawanna (GET Request)
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Tabs 4ma data ganeema
    var rawSheet = ss.getSheetByName("Raw Materials");
    var prodSheet = ss.getSheetByName("Products");
    var recipeSheet = ss.getSheetByName("Recipes");
    var logSheet = ss.getSheetByName("Production Logs");
    
    var rawMaterials = rawSheet ? rawSheet.getDataRange().getValues() : [];
    var products = prodSheet ? prodSheet.getDataRange().getValues() : [];
    var recipes = recipeSheet ? recipeSheet.getDataRange().getValues() : [];
    var logs = logSheet ? logSheet.getDataRange().getValues() : [];
    
    var response = {
      status: "success",
      rawMaterials: formatSheetData(rawMaterials),
      products: formatSheetData(products),
      recipes: formatSheetData(recipes),
      logs: formatSheetData(logs)
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. Production Log ekak daddi Sheets update kireema (POST Request)
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var logSheet = ss.getSheetByName("Production Logs");
    var recipeSheet = ss.getSheetByName("Recipes");
    var materialSheet = ss.getSheetByName("Raw Materials");
    
    var data = JSON.parse(e.postData.contents);
    
    var target = parseFloat(data.targetQty) || 0;
    var good = parseFloat(data.goodQty) || 0;
    var scrap = parseFloat(data.scrapQty) || 0;
    var totalProduced = good + scrap;
    var yieldPct = target > 0 ? (good / target) : 0;
    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
    
    // A. Production Log eka save kireema
    logSheet.appendRow([
      today,
      data.shift,
      data.product,
      target,
      good,
      scrap,
      data.scrapReason,
      yieldPct
    ]);
    
    var lastRow = logSheet.getLastRow();
    logSheet.getRange(lastRow, 8).setNumberFormat("0.0%");
    
    // B. Recipe balala Raw Material stock deduct kireema
    var recipeData = recipeSheet.getDataRange().getValues();
    var materialData = materialSheet.getDataRange().getValues();
    
    for (var i = 1; i < recipeData.length; i++) {
      var recipeProduct = recipeData[i][0];
      var materialName = recipeData[i][1];
      var qtyPerUnit = parseFloat(recipeData[i][2]) || 0;
      
      if (recipeProduct.toString().trim().toLowerCase() === data.product.toString().trim().toLowerCase()) {
        var totalDeduction = qtyPerUnit * totalProduced;
        
        for (var j = 1; j < materialData.length; j++) {
          if (materialData[j][0].toString().trim().toLowerCase() === materialName.toString().trim().toLowerCase()) {
            var currentStock = parseFloat(materialData[j][1]) || 0;
            var newStock = Math.max(0, currentStock - totalDeduction);
            
            // Raw Material tab eke Current Stock (Column B) update kireema
            materialSheet.getRange(j + 1, 2).setValue(newStock);
            break;
          }
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Batch logged and stocks deducted!" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Data Array eka clean JSON array ekak karana helper function eka
function formatSheetData(rows) {
  if (!rows || rows.length < 2) return [];
  var headers = rows[0];
  var list = [];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (row.join("").trim() === "") continue;
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j].toString().trim();
      if (key) obj[key] = row[j];
    }
    list.push(obj);
  }
  return list;
}
