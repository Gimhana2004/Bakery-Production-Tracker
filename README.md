# 🍞 Sri Lankan Bakery Management System

A production and inventory management web application for local bakeries. Built with an HTML5/Tailwind frontend and powered by Google Sheets + Google Apps Script as a serverless database backend.

## 🚀 Live Demo
Visit the live dashboard: [https://gimhana2004.github.io/Bakery-Production-Tracker/](https://gimhana2004.github.io/Bakery-Production-Tracker/)

---

## 📁 Repository Structure
* `index.html`: Complete single-page frontend application dashboard.
* `Code.gs`: Google Apps Script backend API handling data retrieval, batch logging, and inventory deduction.
* `sheet-template.csv`: Database schema showing required tabs and column headers.
* `README.md`: Setup instructions and developer guide.

---

## 🛠️ Setup Guide for Collaborators

Want to deploy your own instance? Follow these steps:

### 1. Create the Google Sheet Database
Create a Google Sheet with these exact 4 tabs (reference `sheet-template.csv`):
* **Raw Materials**: `Material Name`, `Current Stock (Kg)`, `Min Stock Level (Kg)`
* **Products**: `Product Name`, `Unit Price`
* **Recipes**: `Product Name`, `Material Name`, `Quantity Required (Kg)`
* **Production Logs**: `Date`, `Shift`, `Product Name`, `Target Qty`, `Good Qty`, `Scrap Qty`, `Scrap Reason`, `Yield %`

### 2. Deploy the Apps Script Backend
1. In your sheet, go to **Extensions** > **Apps Script**.
2. Replace the editor contents with the code from `Code.gs`.
3. Click **Deploy** > **New deployment**.
4. Select type **Web app**.
5. Set **Execute as**: `Me` and **Who has access**: `Anyone`.
6. Click **Deploy**, approve permissions, and copy the generated **Web App URL**.

### 3. Connect the Frontend
1. Fork or clone this repository.
2. Open `index.html` and find the line:
   ```javascript
   const API_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
