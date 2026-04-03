<div align="center">

# 🧺 Miele Appliance Custom Card

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/Eugen417/miele-appliance-card?style=for-the-badge)](https://github.com/Eugen417/miele-appliance-card/releases)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-custom%20card-blue.svg?style=for-the-badge)](https://www.home-assistant.io/)

[🇷🇺 Русский](#-русский) | [🇬🇧 English](#-english) | [🇩🇪 Deutsch](#-deutsch)

</div>

---

## 🇬🇧 English

Interactive custom card for Miele washing and drying machines (W1/T1 models) with a built-in visual editor right in Home Assistant!

### ✨ Features
* **No YAML:** Full GUI configuration for colors, scales, and coordinates.
* **Smart UI:** Automatically adapts to a washer (shows TwinDos, Water) or a dryer (shows filter).
* **Progress Ring:** Dynamic wash progress ring around the door with adjustable coordinates and size.
* **Multilingual:** Built-in RU, EN, and DE support (selected automatically or manually).
* **Custom Sensors:** Support for any non-standard sensors via entity search in the editor.

### 📸 Gallery

<p align="center">
  <img src="https://github.com/user-attachments/assets/29341433-ca36-4ca4-9977-08c9b2eead91" alt="Drying machine" width="300" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/cc5950b1-ae12-4361-9c6a-acf60bd06a51" alt="Drying machine" width="300" />
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/94deb7b8-79f9-4da6-873d-b5f7e0752e4e" alt="Card Visual Editor" width="600" />
</p>

### 🚀 Installation via HACS (Recommended)


[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Eugen417&repository=miele-appliance-card&category=plugin)

1. Open **HACS** -> **Frontend**.
2. Click the 3 dots in the top right corner -> **Custom repositories**.
3. Paste the link to this repository: `https://github.com/Eugen417/miele-appliance-card`, select the **Lovelace** category, and click Add.
4. Find the card in HACS search and click **Download**.

### 🖼 Image Configuration (Important!)
By default, the card uses images directly from GitHub. To prevent the card from breaking if offline, it is recommended to save them locally:

1. Create a `miele` folder at `config/www/miele/`.
2. Download `washer.webp` and `dryer.webp` from this repository (or use your own).
3. Place them in the folder.
4. In the card settings, specify the local path to the image: `/local/miele/washer.webp` (or `dryer.webp`).

### 🏁 Final Steps
1. Clear your browser cache (`Ctrl + F5`).
2. Go to your dashboard, enter edit mode, click "Add Card," and search for **Miele Appliance**.

---

## 🇷🇺 Русский

Интерактивная кастомная карточка для стиральных и сушильных машин Miele (модели W1/T1) со встроенным визуальным редактором прямо в Home Assistant!

### ✨ Возможности
* **Никакого YAML:** Полная настройка цветов, масштабов и координат через удобный визуальный интерфейс (GUI).
* **Умный интерфейс:** Автоматически подстраивается под стиральную (показывает TwinDos, Воду) или сушильную машину (показывает фильтр).
* **Кольцо прогресса:** Динамическая индикация прогресса стирки вокруг люка с возможностью изменения координат и размера кольца.
* **Мультиязычность:** Встроена поддержка русского, английского и немецкого языков (выбирается автоматически или вручную).
* **Кастомные сенсоры:** Поддержка любых нестандартных сенсоров через поиск сущностей в редакторе.

### 🚀 Установка через HACS (Рекомендуется)


[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Eugen417&repository=miele-appliance-card&category=plugin)

1. Откройте **HACS** -> **Frontend**.
2. Нажмите 3 точки в правом верхнем углу -> **Custom repositories (Пользовательские репозитории)**.
3. Вставьте ссылку на этот репозиторий: `https://github.com/Eugen417/miele-appliance-card`, выберите категорию **Lovelace** и нажмите Добавить.
4. Найдите карточку в поиске HACS и нажмите **Скачать**.

### 🖼 Настройка картинок (Важно!)
По умолчанию в карточке используются изображения по ссылкам с GitHub. Чтобы карточка не сломалась при отсутствии интернета, рекомендуется сохранить их локально:

1. Создайте папку `miele` по пути `config/www/miele/`.
2. Скачайте картинки `washer.webp` и `dryer.webp` из этого репозитория (или используйте свои).
3. Положите их в созданную папку. 
4. В настройках карточки укажите локальный путь к изображению: `/local/miele/washer.webp` (или `dryer.webp`).

### 🏁 Финал
1. Очистите кэш браузера (`Ctrl + F5`).
2. Зайдите на дашборд, перейдите в режим редактирования, нажмите "Добавить карточку" и найдите **Miele Appliance**.

---

## 🇩🇪 Deutsch

Interaktive benutzerdefinierte Karte für Miele Waschmaschinen und Trockner (W1/T1 Modelle) mit integriertem visuellen Editor direkt in Home Assistant!

### ✨ Funktionen
* **Kein YAML:** Vollständige GUI-Konfiguration für Farben, Skalierungen und Koordinaten.
* **Intelligente Benutzeroberfläche:** Passt sich automatisch an eine Waschmaschine (zeigt TwinDos, Wasser) oder einen Trockner (zeigt Filter) an.
* **Fortschrittsring:** Dynamischer Waschfortschrittsring um das Bullauge mit anpassbaren Koordinaten und Größe.
* **Mehrsprachig:** Eingebaute Unterstützung für RU, EN und DE (automatisch oder manuell ausgewählt).
* **Benutzerdefinierte Sensoren:** Unterstützung für beliebige nicht standardmäßige Sensoren über die Entitätssuche im Editor.

### 🚀 Installation über HACS (Empfohlen)


[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Eugen417&repository=miele-appliance-card&category=plugin)

1. Öffnen Sie **HACS** -> **Frontend**.
2. Klicken Sie auf die 3 Punkte in der oberen rechten Ecke -> **Custom repositories**.
3. Fügen Sie den Link zu diesem Repository ein: `https://github.com/Eugen417/miele-appliance-card`, wählen Sie die Kategorie **Lovelace** und klicken Sie auf Hinzufügen.
4. Suchen Sie die Karte in der HACS-Suche und klicken Sie auf **Herunterladen**.

### 🖼 Bildeinstellungen (Wichtig!)
Standardmäßig verwendet die Karte Bilder direkt von GitHub. Damit die Karte nicht fehlerhaft angezeigt wird, falls sie offline ist, wird empfohlen, sie lokal zu speichern:

1. Erstellen Sie einen Ordner `miele` unter `config/www/miele/`.
2. Laden Sie `washer.webp` und `dryer.webp` aus diesem Repository herunter (oder verwenden Sie eigene).
3. Legen Sie diese in den Ordner.
4. Geben Sie in den Karteneinstellungen den lokalen Pfad zum Bild an: `/local/miele/washer.webp` (oder `dryer.webp`).

### 🏁 Letzte Schritte
1. Leeren Sie Ihren Browser-Cache (`Strg + F5`).
2. Gehen Sie zu Ihrem Dashboard, wechseln Sie in den Bearbeitungsmodus, klicken Sie auf "Karte hinzufügen" und suchen Sie nach **Miele Appliance**.

---
<div align="center">
  👨‍💻 Developed by <a href="https://github.com/Eugen417">Eugen417</a>
</div>
