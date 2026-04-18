# 🇪🇺 Schengen Document Tracker (EuroPath)

> A lightning-fast, offline-first Progressive Web App (PWA) designed to simplify and gamify your Schengen Visa preparation.

Whether you are applying for a European apprenticeship, updating your CV for cross-border opportunities, or just planning the ultimate itinerary across the Schengen zone, tracking your visa documents shouldn't be the hardest part of the journey. 

This minimalist tracker ensures you have every personal document, flight ticket, and financial statement securely checked off—right from your device, even without an internet connection.

## ✨ Key Features

* **✈️ 100% Offline Capable:** Built as a Progressive Web App (PWA) with Service Workers. Install it on your phone or desktop and use it anywhere, zero internet required.
* 🎮 **Gamified Progress:** Watch your progress bar fill up and your rank upgrade from *Beginner* to *Euro Bound!* as you secure your documents.
* 🌗 **Adaptive Dark Mode:** Seamlessly switch between light and dark themes. The UI and custom checkboxes adapt automatically.
* 💶 **Insurance Currency Converter:** Instantly view the mandatory €30,000 Schengen insurance coverage requirement converted into IDR, USD, and MYR.
* ⚡ **Ultra-Lightweight:** Zero dependencies. Built purely with Vanilla HTML, CSS, and JavaScript. Your checklist state is saved locally via `localStorage`.

## 📸 Sneak Peek

*(Add your screenshots here by dragging and dropping them into the GitHub editor!)*
* `[Light Mode Screenshot]`
* `[Dark Mode Screenshot]`

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (CSS Variables, Flexbox, Grid)
* **Logic:** Vanilla JavaScript (ES6+)
* **Storage:** Window `localStorage` API
* **PWA Features:** `manifest.json`, Service Workers (`sw.js`)

## 🚀 How to Run Locally

If you want to clone this repository and test it yourself:

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/sigidpam/schengen-document-tracker.git](https://github.com/sigidpam/schengen-document-tracker.git)

2. Open the project folder:

```bash
cd schengen-document-tracker 

Using VS Code: Install the Live Server extension and click "Go Live".
Using Python: Run python3 -m http.server 5500 in your terminal.


Install the App:
Open your browser (e.g., http://127.0.0.1:5500), click the install icon in the URL bar, and add it to your home screen!

🤝 Contributing
Contributions, issues, and feature requests are welcome! If you have ideas to add more visa categories or improve the gamification, feel free to fork the repository and submit a Pull Request.

📄 License
This project is licensed under the GPL-3.0 License.
