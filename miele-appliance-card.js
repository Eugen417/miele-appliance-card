// =====================================================================================
// РЕДАКТОР КАРТОЧКИ (VISUAL EDITOR ДЛЯ HOME ASSISTANT)
// =====================================================================================

const DEFAULT_WASHER_IMG = 'https://raw.githubusercontent.com/Eugen417/miele-appliance-card/main/washer.webp';
const DEFAULT_DRYER_IMG = 'https://raw.githubusercontent.com/Eugen417/miele-appliance-card/main/dryer.webp';

class MieleApplianceCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  set hass(hass) {
    const oldLang = this._hass?.language;
    this._hass = hass;
    if (oldLang !== hass.language) {
      this.render(); // Перерисовываем меню, если язык HA изменился
    }
  }

  render() {
    // ЗАЩИТА: Дожидаемся загрузки и конфигурации, и системного объекта hass
    if (!this._config || !this._hass) return;

    // Безопасное определение системного языка
    const sysLang = this._hass.language ? this._hass.language.substring(0, 2) : 'en';
    
    const editorStrings = {
      ru: {
        basic: "🛠️ Основные настройки", type: "Тип устройства", lang: "Язык (Language)", auto: "Авто (Системный)",
        washer: "Стиральная машина", dryer: "Сушильная машина", entity: "Базовый сенсор (Entity)",
        img: "Путь к картинке (URL)", design: "🎨 Дизайн и Размеры", themeColor: "Цвет кольца прогресса",
        iconScale: "Масштаб значков (1.0 = 100%)",
        pos: "📍 Координаты элементов (%)", drumXY: "Барабан (Текст) X / Y", waterXY: "Расход воды X / Y",
        energyXY: "Расход энергии X / Y", powerXY: "Кнопка Питание X / Y", startXY: "Кнопка Старт X / Y",
        ringXY: "Барабан (Кольцо) X / Y", ringSize: "Размер кольца (%)",
        adv: "⚙️ Продвинутые: Переопределение сенсоров", advHint: "Оставьте пустым для авто-генерации. Начните вводить текст для поиска."
      },
      en: {
        basic: "🛠️ Basic Settings", type: "Appliance Type", lang: "Language", auto: "Auto (System)",
        washer: "Washer", dryer: "Dryer", entity: "Base Entity",
        img: "Image URL", design: "🎨 Design & Sizes", themeColor: "Progress Ring Color",
        iconScale: "Icon Scale (1.0 = 100%)",
        pos: "📍 Element Coordinates (%)", drumXY: "Drum (Text) X / Y", waterXY: "Water X / Y",
        energyXY: "Energy X / Y", powerXY: "Power Button X / Y", startXY: "Start Button X / Y",
        ringXY: "Drum (Ring) X / Y", ringSize: "Ring Size (%)",
        adv: "⚙️ Advanced: Sensor Overrides", advHint: "Leave blank for auto-generation. Start typing to search."
      },
      de: {
        basic: "🛠️ Grundeinstellungen", type: "Gerätetyp", lang: "Sprache", auto: "Auto (System)",
        washer: "Waschmaschine", dryer: "Trockner", entity: "Basis-Entität",
        img: "Bild-URL", design: "🎨 Design & Größen", themeColor: "Farbe des Fortschrittsrings",
        iconScale: "Symbolmaßstab (1.0 = 100%)",
        pos: "📍 Elementkoordinaten (%)", drumXY: "Trommel (Text) X / Y", waterXY: "Wasser X / Y",
        energyXY: "Energie X / Y", powerXY: "Ein/Aus-Taste X / Y", startXY: "Start-Taste X / Y",
        ringXY: "Trommel (Ring) X / Y", ringSize: "Ringgröße (%)",
        adv: "⚙️ Erweitert: Sensorüberschreibungen", advHint: "Für automatische Generierung leer lassen. Tippen Sie zur Suche."
      }
    };

    const t = editorStrings[sysLang] || editorStrings['en'];

    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      
      // Создаем нативный список для автодополнения сенсоров
      let optionsHtml = '';
      if (this._hass && this._hass.states) {
          optionsHtml = Object.keys(this._hass.states).map(ent => `<option value="${ent}"></option>`).join('');
      }

      this.shadowRoot.innerHTML = `
        <style>
          .editor-container { font-family: var(--paper-font-body1_-_font-family); color: var(--primary-text-color); padding-bottom: 20px; }
          .section-title { font-weight: bold; font-size: 15px; margin: 16px 0 8px 0; color: var(--primary-color); border-bottom: 1px solid var(--divider-color); padding-bottom: 4px; }
          .form-row { margin-bottom: 12px; display: flex; flex-direction: column; }
          label { font-size: 12px; margin-bottom: 4px; color: var(--secondary-text-color); }
          input, select { padding: 8px; border: 1px solid var(--divider-color); border-radius: 4px; background: var(--card-background-color); color: var(--primary-text-color); font-size: 13px; width: 100%; box-sizing: border-box; }
          input:focus, select:focus { outline: none; border-color: var(--primary-color); }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .coord-group { display: flex; gap: 5px; }
          details { margin-top: 15px; border: 1px solid var(--divider-color); border-radius: 4px; padding: 10px; }
          summary { font-weight: bold; cursor: pointer; outline: none; color: var(--primary-color); font-size: 14px; }
          ha-entity-picker { margin-top: 8px; }
        </style>

        <datalist id="entities">${optionsHtml}</datalist>

        <div class="editor-container">
          
          <div class="section-title" id="lbl_basic"></div>
          <div class="grid-2">
              <div class="form-row">
                <label id="lbl_type"></label>
                <select id="appliance_type" class="config-item">
                    <option value="washer" id="opt_washer"></option>
                    <option value="dryer" id="opt_dryer"></option>
                </select>
              </div>
              <div class="form-row">
                <label id="lbl_lang"></label>
                <select id="lang" class="config-item">
                    <option value="auto" id="opt_auto"></option>
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                </select>
              </div>
          </div>

          <div class="form-row" style="margin-top: 4px;">
            <label id="lbl_entity"></label>
            <input type="text" id="entity" class="config-item" list="entities" placeholder="sensor.stiralnaia_mashina">
          </div>
          
          <div class="form-row">
            <label id="lbl_img"></label>
            <input type="text" id="image" class="config-item">
          </div>

          <div class="section-title" id="lbl_design"></div>
          <div class="grid-2">
              <div class="form-row">
                <label id="lbl_themeColor"></label>
                <input type="color" id="theme_color" class="config-item" style="height: 34px; padding: 2px;">
              </div>
              <div class="form-row">
                <label id="lbl_iconScale"></label>
                <input type="number" step="0.05" id="icon_scale" class="config-item">
              </div>
          </div>

          <details>
            <summary id="lbl_pos"></summary>
            <div class="grid-2" style="margin-top: 10px;">
              <div class="form-row"><label id="lbl_ringSize"></label>
                <input type="number" step="1" id="ring_size" class="config-item" placeholder="55">
              </div>
              <div class="form-row"><label id="lbl_ringXY"></label>
                <div class="coord-group">
                  <input type="number" id="ring_x" class="config-item" placeholder="50">
                  <input type="number" id="ring_y" class="config-item" placeholder="43">
                </div>
              </div>
              <div class="form-row"><label id="lbl_drumXY"></label>
                <div class="coord-group">
                  <input type="number" id="drum_x" class="config-item" placeholder="50">
                  <input type="number" id="drum_y" class="config-item" placeholder="43">
                </div>
              </div>
              <div class="form-row"><label id="lbl_waterXY"></label>
                <div class="coord-group">
                  <input type="number" id="water_x" class="config-item" placeholder="20">
                  <input type="number" id="water_y" class="config-item" placeholder="87">
                </div>
              </div>
              <div class="form-row"><label id="lbl_energyXY"></label>
                <div class="coord-group">
                  <input type="number" id="energy_x" class="config-item" placeholder="90">
                  <input type="number" id="energy_y" class="config-item" placeholder="20">
                </div>
              </div>
              <div class="form-row"><label id="lbl_powerXY"></label>
                <div class="coord-group">
                  <input type="number" id="power_x" class="config-item" placeholder="81.5">
                  <input type="number" id="power_y" class="config-item" placeholder="5.5">
                </div>
              </div>
              <div class="form-row"><label id="lbl_startXY"></label>
                <div class="coord-group">
                  <input type="number" id="start_x" class="config-item" placeholder="61">
                  <input type="number" id="start_y" class="config-item" placeholder="5.5">
                </div>
              </div>
            </div>
          </details>

          <details>
            <summary id="lbl_adv"></summary>
            <p style="font-size: 11px; color: var(--secondary-text-color); margin-top: 5px;" id="lbl_advHint"></p>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              
              <!-- Универсальные сенсоры -->
              <div class="grid-2">
                <div class="form-row"><label>Power (switch)</label><input type="text" id="power_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Door (binary)</label><input type="text" id="door_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Energy (sensor)</label><input type="text" id="energy_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Energy Forecast (%)</label><input type="text" id="energy_forecast_entity" class="config-item" list="entities"></div>
              </div>

              <!-- Только для стиралки -->
              <div class="grid-2" id="washer_sensors">
                <div class="form-row"><label>Water Cons.</label><input type="text" id="water_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Water Forecast (%)</label><input type="text" id="water_forecast_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Target Temp.</label><input type="text" id="temp_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>TwinDos 1</label><input type="text" id="td1_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>TwinDos 2</label><input type="text" id="td2_entity" class="config-item" list="entities"></div>
              </div>

              <!-- Только для сушилки -->
              <div class="grid-2" id="dryer_sensors">
                <div class="form-row"><label>Drying Step</label><input type="text" id="drying_step_entity" class="config-item" list="entities"></div>
                <div class="form-row"><label>Problem (binary)</label><input type="text" id="problem_entity" class="config-item" list="entities"></div>
              </div>

            </div>
          </details>
        </div>
      `;

      this.shadowRoot.querySelectorAll('.config-item').forEach(el => {
        el.addEventListener('change', (ev) => this.valueChanged(ev.target.id, ev.target.value));
        el.addEventListener('input', (ev) => {
          if (ev.target.type === 'number' || ev.target.type === 'color') {
            this.valueChanged(ev.target.id, ev.target.value);
          }
        });
        
        // Умное автозаполнение координат при использовании стрелок (клавиатура или мышь), если поле пустое
        if (el.type === 'number') {
          const handleEmptyStep = (isUp) => {
            if (!el.value && el.placeholder) {
              const step = parseFloat(el.step) || 1;
              const base = parseFloat(el.placeholder);
              el.value = base + (isUp ? step : -step);
              this.valueChanged(el.id, el.value);
              return true;
            }
            return false;
          };

          el.addEventListener('keydown', (ev) => {
            if (ev.key === 'ArrowUp') {
              if (handleEmptyStep(true)) ev.preventDefault();
            } else if (ev.key === 'ArrowDown') {
              if (handleEmptyStep(false)) ev.preventDefault();
            }
          });

          el.addEventListener('mousedown', (ev) => {
            // Если кликаем в правой части инпута (где находятся стрелочки spin buttons)
            if (!el.value && el.placeholder && ev.offsetX > el.offsetWidth - 24) {
              el.value = el.placeholder;
              this.valueChanged(el.id, el.value);
            }
          });
        }
      });
    }

    // Динамическое обновление локализации
    const setText = (id, text) => {
        const el = this.shadowRoot.getElementById(id);
        if (el && el.innerText !== text) el.innerText = text;
    };
    setText('lbl_basic', t.basic);
    setText('lbl_type', t.type);
    setText('lbl_lang', t.lang);
    setText('lbl_entity', t.entity);
    setText('opt_auto', t.auto);
    setText('opt_washer', t.washer);
    setText('opt_dryer', t.dryer);
    setText('lbl_img', t.img);
    setText('lbl_design', t.design);
    setText('lbl_themeColor', t.themeColor);
    setText('lbl_iconScale', t.iconScale);
    setText('lbl_pos', t.pos);
    setText('lbl_drumXY', t.drumXY);
    setText('lbl_waterXY', t.waterXY);
    setText('lbl_energyXY', t.energyXY);
    setText('lbl_powerXY', t.powerXY);
    setText('lbl_startXY', t.startXY);
    setText('lbl_ringXY', t.ringXY);
    setText('lbl_ringSize', t.ringSize);
    setText('lbl_adv', t.adv);
    setText('lbl_advHint', t.advHint);

    // Обновление значений в полях ввода
    const setVal = (id, val) => {
        const el = this.shadowRoot.getElementById(id);
        if (el && el.value !== val) el.value = val;
    };
    
    const appType = this._config.appliance_type || 'washer';
    setVal('appliance_type', appType);
    setVal('lang', this._config.lang || 'auto');
    setVal('entity', this._config.entity || '');
    setVal('image', this._config.image || DEFAULT_WASHER_IMG);
    setVal('theme_color', this._config.theme_color || '#ff8c00');
    setVal('icon_scale', this._config.icon_scale || '1.0');

    ['ring_x', 'ring_y', 'ring_size', 'drum_x', 'drum_y', 'water_x', 'water_y', 'energy_x', 'energy_y', 'power_x', 'power_y', 'start_x', 'start_y',
     'power_entity', 'door_entity', 'water_entity', 'water_forecast_entity', 'energy_entity', 'energy_forecast_entity',
     'td1_entity', 'td2_entity', 'drying_step_entity', 'problem_entity', 'temp_entity'].forEach(id => {
      setVal(id, this._config[id] || '');
    });

    // Управление видимостью сенсоров в зависимости от типа устройства
    const washerGroup = this.shadowRoot.getElementById('washer_sensors');
    const dryerGroup = this.shadowRoot.getElementById('dryer_sensors');
    if (washerGroup) washerGroup.style.display = appType === 'washer' ? 'grid' : 'none';
    if (dryerGroup) dryerGroup.style.display = appType === 'dryer' ? 'grid' : 'none';

    // Умные плейсхолдеры для продвинутых сенсоров
    const base = this._config.entity || ''; 
    const devName = base.includes('.') ? base.split('.')[1] : base;
    
    const setPlaceholder = (id, text) => {
        const el = this.shadowRoot.getElementById(id);
        if (el) el.placeholder = text;
    };
    
    setPlaceholder('power_entity', devName ? `switch.${devName}_power` : '');
    setPlaceholder('door_entity', devName ? `binary_sensor.${devName}_door` : '');
    setPlaceholder('temp_entity', base ? `${base}_target_temperature` : '');
    setPlaceholder('water_entity', base ? `${base}_water_consumption` : '');
    setPlaceholder('water_forecast_entity', base ? `${base}_water_forecast` : '');
    setPlaceholder('energy_entity', base ? `${base}_energy_consumption` : '');
    setPlaceholder('energy_forecast_entity', base ? `${base}_energy_forecast` : '');
    setPlaceholder('td1_entity', base ? `${base}_twindos_1_level` : '');
    setPlaceholder('td2_entity', base ? `${base}_twindos_2_level` : '');
    setPlaceholder('drying_step_entity', base ? `${base}_drying_step` : '');
    setPlaceholder('problem_entity', devName ? `binary_sensor.${devName}_problem` : '');
  }

  valueChanged(id, value) {
    if (!this._config) return;
    if (this._config[id] === value) return;

    let newConfig = { ...this._config };
    
    // Умное переключение картинок по умолчанию при смене типа устройства
    if (id === 'appliance_type') {
      if (this._config.image === DEFAULT_WASHER_IMG && value === 'dryer') {
        newConfig['image'] = DEFAULT_DRYER_IMG;
      } else if (this._config.image === DEFAULT_DRYER_IMG && value === 'washer') {
        newConfig['image'] = DEFAULT_WASHER_IMG;
      }
    }

    if (value === '' || value === undefined || value === null) {
      delete newConfig[id]; 
    } else {
      newConfig[id] = value;
    }

    const event = new Event('config-changed', { bubbles: true, composed: true });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }
}
customElements.define('miele-appliance-card-editor', MieleApplianceCardEditor);


// =====================================================================================
// ОСНОВНАЯ КАРТОЧКА (FRONTEND)
// =====================================================================================
class MieleApplianceCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._showForecast = false;
    this.translations = {
      'ru': {
        'extra_dry': 'Экстра сухая', 'hand_iron_1': 'Под утюг 1', 'hand_iron_2': 'Под утюг 2', 'machine_iron': 'В гладилку',
        'normal': 'Нормальная', 'normal_plus': 'Нормальная плюс', 'slightly_dry': 'Слегка влажная', 'smoothing': 'Разглаживание',
        'not_running': 'Остановлена', 'pre_wash': 'Предв. стирка', 'main_wash': 'Основная стирка', 'rinse': 'Полоскание',
        'spin': 'Отжим', 'drain': 'Слив', 'anti_crease': 'Защита от сминания', 'cooling_down': 'Охлаждение', 'drying': 'Сушка',
        'finished': 'Завершено', 'cleaning': 'Очистка', 'freshen_up': 'Освежить', 'program_running': 'В процессе',
        'off': 'Выкл', 'on': 'Вкл', 'in_use': 'В работе', 'program_ended': 'Завершено', 'failure': 'Ошибка',
        'phase1': 'ФАЗА 1', 'phase2': 'ФАЗА 2', 'clean_filter': 'Очистите фильтр!', 'min': 'мин',
        'automatic_start': 'Автостарт', 'flex_load_active': 'FlexLoad активен', 'rinse_hold': 'Остановка с водой',
        'idle': 'Ожидание', 'program_interrupted': 'Прервана', 'waiting_to_start': 'Ожидание старта', 'not_connected': 'Отключена',
        'automatic_plus': 'Автоматическая+', 'bed_linen': 'Постельное белье', 'cool_air': 'Холодный обдув',
        'warm_air': 'Теплый обдув', 'cottonrepair': 'Восстановление хлопка', 'cottons_eco': 'Хлопок Эко',
        'curtains': 'Шторы', 'dark_jeans': 'Темные джинсы', 'down_filled_items': 'Пуховики', 'easy_care': 'Тонкое белье',
        'first_wash': 'Первая стирка', 'game_pieces': 'Спортивная экипировка', 'outdoor_garments': 'Верхняя одежда',
        'powerfresh': 'PowerFresh', 'pre_ironing': 'Предварительная глажка', 'quick_power_wash': 'QuickPowerWash',
        'rinse_out_lint': 'Смыв ворса', 'separate_rinse_starch': 'Полоскание/Крахмал', 'smartmatic': 'SmartMatic',
        'starch': 'Крахмал', 'steam_care': 'Обработка паром', 'stuffed_toys': 'Мягкие игрушки', 'trainers_refresh': 'Освежить кроссовки',
        'no_program': 'Нет программы', 'delicates': 'Деликатная', 'cottons': 'Хлопок', 'minimum_iron': 'Легкая глажка',
        'woollens': 'Шерсть', 'silks': 'Шелк', 'shirts': 'Рубашки', 'express_20': 'Экспресс 20', 'dark_garments': 'Темные вещи',
        'denim': 'Джинсы', 'outerwear': 'Верхняя одежда', 'proofing': 'Пропитка', 'sportswear': 'Спортивная',
        'trainers': 'Кроссовки', 'down_duvets': 'Пуховики', 'pillows': 'Подушки', 'cottons_hygiene': 'Хлопок Гигиена',
        'eco_40_60': 'Eco 40-60', 'drain_spin': 'Слив / Отжим', 'clean_machine': 'Очистка машины',
        'silks_handcare': 'Шелк (ручная)', 'downs_duvets': 'Пуховики', 'eco': 'Эко', 'express': 'Экспресс',
        'gentle_denim': 'Джинсы (бережная)', 'gentle_smoothing': 'Бережное разгл.', 'large_pillows': 'Большие подушки',
        'pillows_sanitize': 'Подушки (гигиена)', 'quick_hygiene': 'Быстрая гигиена', 'quick_power_dry': 'QuickPowerDry',
        'standard_pillows': 'Станд. подушки', 'woollens_handcare': 'Шерсть (ручная)', 'automatic': 'Автоматическая',
        'basket_program': 'Сушка в корзине'
      },
      'en': {
        'extra_dry': 'Extra dry', 'hand_iron_1': 'Hand iron 1', 'hand_iron_2': 'Hand iron 2', 'machine_iron': 'Machine iron',
        'normal': 'Normal', 'normal_plus': 'Normal plus', 'slightly_dry': 'Slightly dry', 'smoothing': 'Smoothing',
        'not_running': 'Stopped', 'pre_wash': 'Pre-wash', 'main_wash': 'Main wash', 'rinse': 'Rinse',
        'spin': 'Spin', 'drain': 'Drain', 'anti_crease': 'Anti-crease', 'cooling_down': 'Cooling down', 'drying': 'Drying',
        'finished': 'Finished', 'cleaning': 'Cleaning', 'freshen_up': 'Freshen up', 'program_running': 'Running',
        'off': 'Off', 'on': 'On', 'in_use': 'In use', 'program_ended': 'Finished', 'failure': 'Failure',
        'phase1': 'PHASE 1', 'phase2': 'PHASE 2', 'clean_filter': 'Clean filter!', 'min': 'min',
        'automatic_start': 'Auto start', 'flex_load_active': 'FlexLoad active', 'rinse_hold': 'Rinse hold',
        'idle': 'Idle', 'program_interrupted': 'Interrupted', 'waiting_to_start': 'Waiting to start', 'not_connected': 'Not connected',
        'automatic_plus': 'Automatic+', 'bed_linen': 'Bed linen', 'cool_air': 'Cool air',
        'warm_air': 'Warm air', 'cottonrepair': 'Cotton repair', 'cottons_eco': 'Cottons Eco',
        'curtains': 'Curtains', 'dark_jeans': 'Dark jeans', 'down_filled_items': 'Down-filled items', 'easy_care': 'Easy care',
        'first_wash': 'First wash', 'game_pieces': 'Game pieces', 'outdoor_garments': 'Outdoor garments',
        'powerfresh': 'PowerFresh', 'pre_ironing': 'Pre-ironing', 'quick_power_wash': 'QuickPowerWash',
        'rinse_out_lint': 'Rinse out lint', 'separate_rinse_starch': 'Separate rinse/starch', 'smartmatic': 'SmartMatic',
        'starch': 'Starch', 'steam_care': 'Steam care', 'stuffed_toys': 'Stuffed toys', 'trainers_refresh': 'Trainers refresh',
        'no_program': 'No program', 'delicates': 'Delicates', 'cottons': 'Cottons', 'minimum_iron': 'Minimum iron',
        'woollens': 'Woollens', 'silks': 'Silks', 'shirts': 'Shirts', 'express_20': 'Express 20', 'dark_garments': 'Dark garments',
        'denim': 'Denim', 'outerwear': 'Outerwear', 'proofing': 'Proofing', 'sportswear': 'Sportswear',
        'trainers': 'Trainers', 'down_duvets': 'Down duvets', 'pillows': 'Pillows', 'cottons_hygiene': 'Cottons hygiene',
        'eco_40_60': 'Eco 40-60', 'drain_spin': 'Drain / Spin', 'clean_machine': 'Clean machine',
        'silks_handcare': 'Silks handcare', 'downs_duvets': 'Downs duvets', 'eco': 'Eco', 'express': 'Express',
        'gentle_denim': 'Gentle denim', 'gentle_smoothing': 'Gentle smoothing', 'large_pillows': 'Large pillows',
        'pillows_sanitize': 'Pillows sanitize', 'quick_hygiene': 'Quick hygiene', 'quick_power_dry': 'Quick Power Dry',
        'standard_pillows': 'Standard pillows', 'woollens_handcare': 'Woollens handcare', 'automatic': 'Automatic',
        'basket_program': 'Basket program'
      },
      'de': {
        'extra_dry': 'Extratrocken', 'hand_iron_1': 'Bügelfeucht 1', 'hand_iron_2': 'Bügelfeucht 2', 'machine_iron': 'Mangelſeucht',
        'normal': 'Normal', 'normal_plus': 'Normal plus', 'slightly_dry': 'Leichtfeucht', 'smoothing': 'Glätten',
        'not_running': 'Gestoppt', 'pre_wash': 'Vorwäsche', 'main_wash': 'Hauptwäsche', 'rinse': 'Spülen',
        'spin': 'Schleudern', 'drain': 'Abpumpen', 'anti_crease': 'Knitterschutz', 'cooling_down': 'Abkühlen', 'drying': 'Trocknen',
        'finished': 'Fertig', 'cleaning': 'Reinigung', 'freshen_up': 'Auffrischen', 'program_running': 'In Betrieb',
        'off': 'Aus', 'on': 'An', 'in_use': 'In Betrieb', 'program_ended': 'Fertig', 'failure': 'Fehler',
        'phase1': 'PHASE 1', 'phase2': 'PHASE 2', 'clean_filter': 'Filter reinigen!', 'min': 'min',
        'automatic_start': 'Autostart', 'flex_load_active': 'FlexLoad aktiv', 'rinse_hold': 'Spülstopp',
        'idle': 'Leerlauf', 'program_interrupted': 'Unterbrochen', 'waiting_to_start': 'Wartet auf Start', 'not_connected': 'Nicht verbunden',
        'automatic_plus': 'Automatic+', 'bed_linen': 'Bettwäsche', 'cool_air': 'Lüften kalt',
        'warm_air': 'Lüften warm', 'cottonrepair': 'Baumwolle reparieren', 'cottons_eco': 'Baumwolle Eco',
        'curtains': 'Gardinen', 'dark_jeans': 'Dunkle Jeans', 'down_filled_items': 'Daunen', 'easy_care': 'Pflegeleicht',
        'first_wash': 'Neue Textilien', 'game_pieces': 'Sportausrüstung', 'outdoor_garments': 'Outdoor',
        'powerfresh': 'PowerFresh', 'pre_ironing': 'Vorbügeln', 'quick_power_wash': 'QuickPowerWash',
        'rinse_out_lint': 'Flusen ausspülen', 'separate_rinse_starch': 'Spülen/Stärken', 'smartmatic': 'SmartMatic',
        'starch': 'Stärken', 'steam_care': 'Dampfpflege', 'stuffed_toys': 'Kuscheltiere', 'trainers_refresh': 'Sportschuhe auffrischen',
        'no_program': 'Kein Programm', 'delicates': 'Feinwäsche', 'cottons': 'Baumwolle', 'minimum_iron': 'Pflegeleicht',
        'woollens': 'Wolle', 'silks': 'Seide', 'shirts': 'Oberhemden', 'express_20': 'Express 20', 'dark_garments': 'Dunkles',
        'denim': 'Jeans', 'outerwear': 'Outdoor', 'proofing': 'Imprägnieren', 'sportswear': 'Sportwäsche',
        'trainers': 'Sportschuhe', 'down_duvets': 'Daunendecken', 'pillows': 'Kopfkissen', 'cottons_hygiene': 'Baumwolle Hygiene',
        'eco_40_60': 'Eco 40-60', 'drain_spin': 'Pumpen / Schleudern', 'clean_machine': 'Maschine reinigen',
        'silks_handcare': 'Seide Handpflege', 'downs_duvets': 'Daunendecken', 'eco': 'Eco', 'express': 'Express',
        'gentle_denim': 'Jeans schonend', 'gentle_smoothing': 'Schonglätten', 'large_pillows': 'Große Kissen',
        'pillows_sanitize': 'Kissen Hygiene', 'Schnelle Hygiene': 'Schnelle Hygiene', 'quick_power_dry': 'QuickPowerDry',
        'standard_pillows': 'Standardkissen', 'woollens_handcare': 'Wolle Handpflege', 'automatic': 'Automatic',
        'basket_program': 'Korbprogramm'
      }
    };
  }

  static getConfigElement() {
    return document.createElement("miele-appliance-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      appliance_type: "washer",
      lang: "auto",
      image: DEFAULT_WASHER_IMG
    };
  }

  connectedCallback() {
    if (!this._toggleInterval) {
      this._toggleInterval = setInterval(() => {
        this._showForecast = !this._showForecast;
        if (this._hass) this.updateData();
      }, 10000);
    }
  }

  disconnectedCallback() {
    if (this._toggleInterval) {
      clearInterval(this._toggleInterval);
      this._toggleInterval = null;
    }
  }

  getColor(pct) {
    if (pct < 0) pct = 0;
    if (pct > 100) pct = 100;
    let r = pct < 50 ? Math.floor(255 * (pct / 50)) : 255;
    let g = pct > 50 ? Math.floor(255 * ((100 - pct) / 50)) : 255;
    return `rgb(${r},${g},0)`;
  }

  setConfig(config) {
    if (!config || !config.entity) throw new Error('Пожалуйста, укажите базовый сенсор (entity) в настройках карточки');
    this.config = { 
        image: DEFAULT_WASHER_IMG, 
        appliance_type: 'washer', 
        lang: 'auto',
        theme_color: '#ff8c00',
        icon_scale: 1.0,
        ...config 
    };

    // Применяем CSS переменные (Цвет кольца/кнопок и масштабы)
    this.style.setProperty('--miele-theme', this.config.theme_color);
    this.style.setProperty('--miele-icon-scale', this.config.icon_scale);

    // Применяем CSS переменные для координат X / Y
    if(this.config.drum_x) this.style.setProperty('--miele-drum-x', this.config.drum_x + '%');
    if(this.config.drum_y) this.style.setProperty('--miele-drum-y', this.config.drum_y + '%');
    
    // Координаты и размер кольца теперь полностью независимы от барабана (по умолчанию 50 / 43)
    if(this.config.ring_x) this.style.setProperty('--miele-ring-x', this.config.ring_x + '%');
    if(this.config.ring_y) this.style.setProperty('--miele-ring-y', this.config.ring_y + '%');
    if(this.config.ring_size) this.style.setProperty('--miele-ring-size', this.config.ring_size + '%');

    if(this.config.water_x) this.style.setProperty('--miele-water-x', this.config.water_x + '%');
    if(this.config.water_y) this.style.setProperty('--miele-water-y', this.config.water_y + '%');
    if(this.config.energy_x) this.style.setProperty('--miele-energy-x', this.config.energy_x + '%');
    if(this.config.energy_y) this.style.setProperty('--miele-energy-y', this.config.energy_y + '%');
    if(this.config.power_x) this.style.setProperty('--miele-power-x', this.config.power_x + '%');
    if(this.config.power_y) this.style.setProperty('--miele-power-y', this.config.power_y + '%');
    if(this.config.start_x) this.style.setProperty('--miele-start-x', this.config.start_x + '%');
    if(this.config.start_y) this.style.setProperty('--miele-start-y', this.config.start_y + '%');

    const base = this.config.entity || ''; 
    const devName = base.includes('.') ? base.split('.')[1] : base;
    this.entities = {
      base: base,
      remaining: this.config.remaining_entity || `${base}_remaining_time`,
      elapsed: this.config.elapsed_entity || `${base}_elapsed_time`,
      speed: this.config.speed_entity || `${base}_spin_speed`,
      program: this.config.program_entity || `${base}_program`,
      phase: this.config.phase_entity || `${base}_program_phase`,
      power: this.config.power_entity || `switch.${devName}_power`,
      start: this.config.start_entity || `button.${devName}_zapustit`,
      stop: this.config.stop_entity || `button.${devName}_ostanovit`,
      door: this.config.door_entity || `binary_sensor.${devName}_door`,
      temp: this.config.temp_entity || `${base}_target_temperature`,
      energy: this.config.energy_entity || `${base}_energy_consumption`,
      energy_forecast: this.config.energy_forecast_entity || `${base}_energy_forecast`,
      water: this.config.water_entity || `${base}_water_consumption`,
      water_forecast: this.config.water_forecast_entity || `${base}_water_forecast`,
      td1: this.config.td1_entity || `${base}_twindos_1_level`,
      td2: this.config.td2_entity || `${base}_twindos_2_level`,
      drying_step: this.config.drying_step_entity || `${base}_drying_step`,
      problem: this.config.problem_entity || `binary_sensor.${devName}_problem`,
      notification: this.config.notification_entity || `binary_sensor.${devName}_notification_active`
    };
  }

  set hass(hass) { 
    this._hass = hass; 
    if (!this.content) this.renderSetup(); 
    this.updateData(); 
  }

  getLang() {
    let l = this.config.lang || 'auto';
    if (l === 'auto') {
        l = (this._hass && this._hass.language) ? this._hass.language.substring(0, 2) : 'en';
    }
    if (!this.translations[l]) l = 'en'; 
    return l;
  }

  translate(val) {
    if (!val) return '';
    const lang = this.getLang();
    const key = val.toLowerCase().replace(/ /g, '_');
    return this.translations[lang]?.[key] || (val.charAt(0).toUpperCase() + val.slice(1).replace(/_/g, ' '));
  }

  openMoreInfo(entityId) { 
    if (!entityId) return; 
    const event = new Event('hass-more-info', { bubbles: true, composed: true }); 
    event.detail = { entityId }; 
    this.dispatchEvent(event); 
  }

  renderSetup() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card { background: transparent; border: none; box-shadow: none; }
        .card-container { 
            position: relative; 
            width: 100%; 
            overflow: hidden; 
            border-radius: var(--ha-card-border-radius, 12px); 
        }
        .background { width: 100%; display: block; pointer-events: none; }
        .text { position: absolute; white-space: nowrap; font-weight: bold; text-shadow: 1px 1px 3px black; transform: translate(-50%, -50%); }
        .icon { position: absolute; transform: translate(-50%, -50%); cursor: pointer; filter: drop-shadow(1px 1px 2px black); }
        .drum-info, .remaining-time, .water-container, .energy-val, .twindos { cursor: pointer; }
        
        .drum-info { 
            position: absolute; 
            top: var(--miele-drum-y, 43%); 
            left: var(--miele-drum-x, 50%); 
            transform: translate(-50%, -50%); 
            display: flex; flex-direction: column; align-items: center; justify-content: center; width: 70%; gap: 6px; 
        }
        .drum-text { white-space: nowrap; font-weight: bold; text-shadow: 1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black, 0 0 10px black; max-width: 100%; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
        
        /* Оригинальные цвета надписей Miele */
        .program-phase { color: #00ff00; font-size: clamp(10px, 2.5vw, 16px); }
        .spin-speed, .program-name { color: #ff8c00; font-size: clamp(10px, 2.5vw, 16px); }
        
        .target-temperature { display: flex; align-items: center; justify-content: center; font-size: clamp(12px, 2.5vw, 17px); font-weight: bold; text-shadow: 1px 1px 2px black, -1px -1px 2px black, 1px -1px 2px black, -1px 1px 2px black, 0 0 10px black; margin-top: 2px; }
        .temp-prefix { color: #ff8c00; font-weight: bold; margin-right: 3px; }
        .temp-value { transition: color 0.5s ease; }
        
        .drying-step { color: #00bfff; font-size: clamp(8px, 2vw, 14px); }
        .remaining-time { top: var(--miele-power-y, 5.5%); left: calc(var(--miele-drum-x, 50%) - 2%); color: #ff8c00; font-size: clamp(10px, 2.5vw, 16px); max-width: 25%; text-align: center; }
        
        .btn-startstop { top: var(--miele-start-y, 5.5%); left: var(--miele-start-x, 61%); --mdc-icon-size: calc(1.3em * var(--miele-icon-scale, 1.0)); }
        .btn-power { top: var(--miele-power-y, 5.5%); left: var(--miele-power-x, 81.5%); --mdc-icon-size: calc(1.5em * var(--miele-icon-scale, 1.0)); }
        .door-lock { top: calc(var(--miele-drum-y, 43%) - 1%); left: 18%; --mdc-icon-size: calc(1.6em * var(--miele-icon-scale, 1.0)); }
        
        .water-icon { top: var(--miele-water-y, 87%); left: var(--miele-water-x, 20%); color: #00bfff; --mdc-icon-size: calc(1.4em * var(--miele-icon-scale, 1.0)); transition: color 0.5s ease; }
        .water-val { top: calc(var(--miele-water-y, 87%) + 4%); left: var(--miele-water-x, 20%); color: #ffffff; font-size: clamp(10px, 3vw, 15px); transition: color 0.5s ease; }
        
        .energy-icon { top: var(--miele-energy-y, 20%); left: var(--miele-energy-x, 90%); color: #ff8c00; --mdc-icon-size: calc(1.4em * var(--miele-icon-scale, 1.0)); transition: color 0.5s ease; }
        .energy-val { top: calc(var(--miele-energy-y, 20%) + 4%); left: var(--miele-energy-x, 90%); color: #ffffff; font-size: clamp(10px, 3vw, 15px); transition: color 0.5s ease; }
        
        .progress-ring { 
            position: absolute; 
            top: var(--miele-ring-y, 43%); 
            left: var(--miele-ring-x, 50%); 
            width: var(--miele-ring-size, 55%); 
            height: var(--miele-ring-size, 55%); 
            transform: translate(-50%, -50%) rotate(-90deg); 
            pointer-events: none; 
        }
        .ring-bg { fill: none; stroke: rgba(150, 150, 150, 0.4); stroke-width: 6; }
        .ring-fg { fill: none; stroke: var(--miele-theme, #ff8c00); stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.5s ease; }
        
        .twindos-container { display: block; }
        .twindos { position: absolute; height: 14%; width: 20%; border-radius: 6px; overflow: hidden; background: rgba(140, 140, 140, 0.4); border: 1px solid rgba(255,255,255,0.1); box-sizing: border-box; }
        .twindos-1 { top: 79%; left: 47%; }
        .twindos-2 { top: 79%; left: 73%; }
        .twindos-fill { position: absolute; bottom: 0; left: 0; width: 100%; background: linear-gradient(to top,#00bfff,#007acc); transition: height 0.5s ease; z-index: 1; }
        .twindos-content { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-around; z-index: 2; padding: 4px 0; box-sizing: border-box;}
        .twindos-label { color: white; font-size: clamp(6px, 1.5vw, 12px); font-weight: bold; text-shadow: 1px 1px 3px black; }
        .twindos-val { color: white; font-size: clamp(10px, 2.5vw, 16px); font-weight: bold; text-shadow: 1px 1px 3px black; }
        
        .filter-alert { display: none; position: absolute; top: calc(var(--miele-water-y, 87%) - 2.5%); left: calc(var(--miele-water-x, 20%) + 7.5%); width: 41%; height: 15%; transform: translate(-50%, -50%); background: rgba(255, 0, 0, 0.7); border-radius: 8px; border: 2px solid red; color: white; font-weight: bold; font-size: clamp(10px, 2vw, 16px); display: flex; align-items: center; justify-content: center; text-align: center; text-shadow: 1px 1px 3px black; box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); animation: pulse 2s infinite; z-index: 5; cursor: pointer; }
        @keyframes pulse { 0% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); } 50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.9); } 100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.5); } }
      </style>
      <ha-card>
        <div class="card-container">
            <img class="background" src="${this.config.image}" />
            <svg class="progress-ring" viewBox="0 0 100 100">
                <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
                <circle class="ring-fg" cx="50" cy="50" r="45"></circle>
            </svg>
            <div class="drum-info">
                <div class="drum-text program-phase"></div>
                <div class="drum-text spin-speed"></div>
                <div class="drum-text program-name"></div>
                <div class="drum-text target-temperature" style="display: none;">
                    <span class="temp-prefix">t&deg;</span>
                    <span class="temp-value"></span>
                </div>
                <div class="drum-text drying-step"></div>
            </div>
            <div class="text remaining-time"></div>
            <ha-icon class="icon btn-startstop"></ha-icon>
            <ha-icon class="icon btn-power" icon="mdi:power"></ha-icon>
            <ha-icon class="icon door-lock"></ha-icon>
            <div class="water-container">
                <div class="text water-val"></div>
                <ha-icon class="icon water-icon" icon="mdi:water-outline"></ha-icon>
            </div>
            <div class="text energy-val"></div>
            <ha-icon class="icon energy-icon" icon="mdi:lightning-bolt-outline"></ha-icon>
            <div class="twindos-container">
                <div class="twindos twindos-1">
                    <div class="twindos-fill"></div>
                    <div class="twindos-content">
                        <div class="twindos-label" id="td1-lbl"></div>
                        <div class="twindos-val"></div>
                    </div>
                </div>
                <div class="twindos twindos-2">
                    <div class="twindos-fill"></div>
                    <div class="twindos-content">
                        <div class="twindos-label" id="td2-lbl"></div>
                        <div class="twindos-val"></div>
                    </div>
                </div>
            </div>
            <div class="filter-alert" id="fltr-alert">
                <ha-icon icon="mdi:alert-circle-outline" style="margin-right:5px;"></ha-icon>
                <span id="fltr-txt"></span>
            </div>
        </div>
      </ha-card>`;
    
    this.content = this.shadowRoot.querySelector('.card-container');
    
    // Основные элементы
    this.shadowRoot.querySelector('.btn-power').addEventListener('click', () => this.togglePower());
    this.shadowRoot.querySelector('.btn-startstop').addEventListener('click', () => this.toggleStartStop());
    this.shadowRoot.querySelector('.remaining-time').addEventListener('click', () => this.openMoreInfo(this.entities.remaining));
    this.shadowRoot.querySelector('.door-lock').addEventListener('click', () => this.openMoreInfo(this.entities.door));
    
    // Клик по пустому пространству барабана открывает главное устройство
    this.shadowRoot.querySelector('.drum-info').addEventListener('click', () => this.openMoreInfo(this.entities.base));
    
    // Индивидуальные клики по сенсорам внутри барабана
    const bindDrumText = (selector, entityKey) => {
        const el = this.shadowRoot.querySelector(selector);
        if (el) {
            el.addEventListener('click', (e) => {
                e.stopPropagation(); // Отменяем клик по всему барабану
                this.openMoreInfo(this.entities[entityKey]);
            });
        }
    };
    
    bindDrumText('.program-phase', 'phase');
    bindDrumText('.spin-speed', 'speed');
    bindDrumText('.program-name', 'program');
    bindDrumText('.target-temperature', 'temp');
    bindDrumText('.drying-step', 'drying_step');

    // Кнопки воды и энергии
    this.shadowRoot.querySelector('.water-container').addEventListener('click', () => {
        const ent = (this._showForecast && this._hass.states[this.entities.water_forecast]) ? this.entities.water_forecast : this.entities.water;
        this.openMoreInfo(ent);
    });
    
    const energyClick = () => {
        const ent = (this._showForecast && this._hass.states[this.entities.energy_forecast]) ? this.entities.energy_forecast : this.entities.energy;
        this.openMoreInfo(ent);
    };
    this.shadowRoot.querySelector('.energy-val').addEventListener('click', energyClick);
    this.shadowRoot.querySelector('.energy-icon').addEventListener('click', energyClick);
    
    // TwinDos и Фильтр
    this.shadowRoot.querySelector('.twindos-1').addEventListener('click', () => this.openMoreInfo(this.entities.td1));
    this.shadowRoot.querySelector('.twindos-2').addEventListener('click', () => this.openMoreInfo(this.entities.td2));
    this.shadowRoot.querySelector('.filter-alert').addEventListener('click', () => { 
        const p = this._hass.states[this.entities.problem]?.state; 
        this.openMoreInfo(p === 'on' ? this.entities.problem : this.entities.notification); 
    });
  }

  updateData() {
    const s = (e) => this._hass.states[e]?.state; 
    const inv = (v) => v === undefined || v === null || v === '' || v === 'unknown' || v === 'unavailable';
    const main = s(this.entities.base); 
    
    if (main === undefined) {
      this.setText('.program-name', 'Entity Not Found');
      this.shadowRoot.querySelector('.program-name').style.display = 'block';
      this.shadowRoot.querySelector('.program-phase').style.display = 'none';
      this.shadowRoot.querySelector('.spin-speed').style.display = 'none';
      this.shadowRoot.querySelector('.drying-step').style.display = 'none';
      this.shadowRoot.querySelector('.target-temperature').style.display = 'none';
      this.shadowRoot.querySelector('.progress-ring').style.display = 'none';
      if (this.shadowRoot.querySelector('.btn-power')) { this.shadowRoot.querySelector('.btn-power').style.color = '#ff0000'; }
      return;
    }
    
    const pwr = s(this.entities.power); 
    const isD = this.config.appliance_type === 'dryer'; 
    const on = pwr === 'on' || (main && main !== 'off' && !inv(main));
    
    this.shadowRoot.querySelector('.progress-ring').style.display = on ? 'block' : 'none';
    const ph = s(this.entities.phase); 
    const phT = (!on || ph === 'not_running') ? '' : (inv(ph) ? '-' : this.translate(ph));
    this.setText('.program-phase', phT); 
    this.shadowRoot.querySelector('.program-phase').style.display = phT ? 'block' : 'none';
    
    if (isD) {
      this.shadowRoot.querySelector('.spin-speed').style.display = 'none';
      this.shadowRoot.querySelector('.target-temperature').style.display = 'none';
    } else {
      const sp = s(this.entities.speed); 
      const spT = on ? (inv(sp) ? '-' : `${sp} rpm`) : '';
      this.setText('.spin-speed', spT); 
      this.shadowRoot.querySelector('.spin-speed').style.display = spT ? 'block' : 'none';

      // Вывод целевой температуры для стиралки с многоцветным RGB градиентом (Синий -> Желтый -> Оранжевый -> Красный)
      const tmpObj = this._hass.states[this.entities.temp];
      const tmp = tmpObj?.state;
      const uom = tmpObj?.attributes?.unit_of_measurement || '°C';
      let tmpVal = '';
      
      if (on && !inv(tmp)) {
          const val = parseFloat(tmp);
          if (!isNaN(val)) {
              tmpVal = `${Math.round(val)}${uom}`;
              let r, g, b;
              if (val <= 30) {
                  // Синий
                  r = 0; g = 191; b = 255;
              } else if (val <= 40) {
                  // Переход Синий -> Желтый (30-40)
                  let p = (val - 30) / 10;
                  r = Math.round(0 + p * 255);
                  g = Math.round(191 + p * 64);
                  b = Math.round(255 - p * 255);
              } else if (val <= 60) {
                  // Переход Желтый -> Оранжевый (40-60)
                  let p = (val - 40) / 20;
                  r = 255;
                  g = Math.round(255 - p * 115);
                  b = 0;
              } else if (val <= 80) {
                  // Переход Оранжевый -> Красный (60-80)
                  let p = (val - 60) / 20;
                  r = 255;
                  g = Math.round(140 - p * 140);
                  b = 0;
              } else {
                  // Красный
                  r = 255; g = 0; b = 0;
              }
              this.shadowRoot.querySelector('.temp-value').style.color = `rgb(${r},${g},${b})`;
          } else {
              tmpVal = `${tmp}`;
              this.shadowRoot.querySelector('.temp-value').style.color = '#ccc';
          }
      } else if (on) {
          tmpVal = '-';
          this.shadowRoot.querySelector('.temp-value').style.color = '#ccc';
      }
      
      this.setText('.temp-value', tmpVal);
      this.shadowRoot.querySelector('.target-temperature').style.display = tmpVal && tmpVal !== '-' ? 'flex' : 'none';
    }
    
    const pr = s(this.entities.program); 
    const prT = on ? (inv(pr) ? '-' : this.translate(pr)) : '';
    this.setText('.program-name', prT); 
    this.shadowRoot.querySelector('.program-name').style.display = prT ? 'block' : 'none';
    
    if (isD) {
      const ds = s(this.entities.drying_step); 
      const dsT = (on && this._hass.states[this.entities.drying_step]) ? (inv(ds) ? '-' : this.translate(ds)) : '';
      this.setText('.drying-step', dsT); 
      this.shadowRoot.querySelector('.drying-step').style.display = dsT ? 'block' : 'none';
    } else {
      this.shadowRoot.querySelector('.drying-step').style.display = 'none';
    }
    
    const rem = s(this.entities.remaining); 
    const lang = this.getLang();
    this.setText('.remaining-time', on ? (inv(rem) ? '-' : `${rem} ${this.translations[lang]['min']}`) : '');
    
    if (isD) {
      this.shadowRoot.querySelector('.water-container').style.display = 'none'; 
      this.shadowRoot.querySelector('.twindos-container').style.display = 'none';
      const prob = s(this.entities.problem) === 'on';
      this.shadowRoot.querySelector('.filter-alert').style.display = (on && prob) ? 'flex' : 'none';
      this.shadowRoot.getElementById('fltr-txt').innerText = this.translations[lang]['clean_filter'];
    } else {
      this.shadowRoot.querySelector('.water-container').style.display = 'block'; 
      const wE = this._hass.states[this.entities.water]; 
      const wF = this._hass.states[this.entities.water_forecast];
      
      if (wE || wF) { 
        this.shadowRoot.querySelector('.water-icon').style.display = 'block'; 
        
        if (this._showForecast && wF && !inv(wF.state)) {
            let val = parseFloat(wF.state) || 0;
            this.setText('.water-val', `${val}%`);
            let color = this.getColor(val);
            this.shadowRoot.querySelector('.water-val').style.color = color;
            this.shadowRoot.querySelector('.water-icon').style.color = color;
        } 
        else if (wE) {
            this.setText('.water-val', inv(wE.state) ? '-' : `${wE.state} L`); 
            this.shadowRoot.querySelector('.water-val').style.color = '#ffffff';
            this.shadowRoot.querySelector('.water-icon').style.color = '#00bfff';
        } else {
            this.setText('.water-val', '');
            this.shadowRoot.querySelector('.water-icon').style.display = 'none';
        }
      } else {
        this.shadowRoot.querySelector('.water-icon').style.display = 'none';
        this.setText('.water-val', '');
      }
      
      const t1 = s(this.entities.td1); 
      if (!this._hass.states[this.entities.td1]) {
        this.shadowRoot.querySelector('.twindos-container').style.display = 'none';
      } else {
        this.shadowRoot.querySelector('.twindos-container').style.display = 'block'; 
        const t2 = s(this.entities.td2);
        this.shadowRoot.getElementById('td1-lbl').innerText = this.translations[lang]['phase1'];
        this.shadowRoot.getElementById('td2-lbl').innerText = this.translations[lang]['phase2'];
        this.setText('.twindos-1 .twindos-val', inv(t1) ? '-' : `${parseFloat(t1) || 0}%`); 
        this.shadowRoot.querySelector('.twindos-1 .twindos-fill').style.height = inv(t1) ? '0%' : `${parseFloat(t1) || 0}%`;
        this.setText('.twindos-2 .twindos-val', inv(t2) ? '-' : `${parseFloat(t2) || 0}%`); 
        this.shadowRoot.querySelector('.twindos-2 .twindos-fill').style.height = inv(t2) ? '0%' : `${parseFloat(t2) || 0}%`;
      }
      this.shadowRoot.querySelector('.filter-alert').style.display = 'none';
    }
    
    const eE = this._hass.states[this.entities.energy]; 
    const eF = this._hass.states[this.entities.energy_forecast];
    const themeColor = this.config.theme_color || '#ff8c00';
    
    if (eE || eF) { 
        this.shadowRoot.querySelector('.energy-icon').style.display = 'block'; 
        
        if (this._showForecast && eF && !inv(eF.state)) {
            let val = parseFloat(eF.state) || 0;
            this.setText('.energy-val', `${val}%`);
            let color = this.getColor(val);
            this.shadowRoot.querySelector('.energy-val').style.color = color;
            this.shadowRoot.querySelector('.energy-icon').style.color = color;
        } else if (eE) {
            const uom = eE.attributes?.unit_of_measurement || 'kWh';
            this.setText('.energy-val', inv(eE.state) ? '-' : `${eE.state} ${uom}`); 
            this.shadowRoot.querySelector('.energy-val').style.color = '#ffffff';
            this.shadowRoot.querySelector('.energy-icon').style.color = '#ff8c00';
        } else {
            this.setText('.energy-val', '');
            this.shadowRoot.querySelector('.energy-icon').style.display = 'none';
        }
    } else {
        this.shadowRoot.querySelector('.energy-icon').style.display = 'none';
        this.setText('.energy-val', '');
    }
    
    const door = s(this.entities.door); 
    const lock = this.shadowRoot.querySelector('.door-lock'); 
    if (lock) { 
        lock.setAttribute('icon', door === 'on' ? 'mdi:lock-open-variant' : 'mdi:lock'); 
        lock.style.color = door === 'on' ? '#ccc' : '#0f0'; 
    }
    
    const pI = this.shadowRoot.querySelector('.btn-power'); 
    if (pI) pI.style.color = on ? '#0f0' : themeColor;
    
    const plI = this.shadowRoot.querySelector('.btn-startstop'); 
    if (plI) { 
        plI.style.display = on ? 'block' : 'none'; 
        if (main === 'in_use') { 
            plI.setAttribute('icon', 'mdi:stop-circle-outline'); 
            plI.style.color = '#f00'; 
        } else { 
            plI.setAttribute('icon', 'mdi:play-circle-outline'); 
            plI.style.color = '#0f0'; 
        } 
    }
    
    if (on) { 
        const el = parseFloat(s(this.entities.elapsed)) || 0; 
        const r = parseFloat(s(this.entities.remaining)) || 0; 
        const prog = (el + r) > 0 ? (el / (el + r)) : 0; 
        const circ = 2 * Math.PI * 45; 
        const fg = this.shadowRoot.querySelector('.ring-fg'); 
        if (fg) { 
            fg.style.strokeDasharray = `${circ}`; 
            fg.style.strokeDashoffset = circ - (prog * circ); 
        } 
    }
  }

  setText(s, t) { const e = this.shadowRoot.querySelector(s); if (e) e.innerText = t; }

  togglePower() { 
      const s = this._hass.states[this.entities.power]?.state; 
      if (s) this._hass.callService('switch', s === 'on' ? 'turn_off' : 'turn_on', { entity_id: this.entities.power }); 
  }

  toggleStartStop() { 
      const s = this._hass.states[this.entities.base]?.state; 
      const b = s === 'in_use' ? this.entities.stop : this.entities.start; 
      if (this._hass.states[b]) this._hass.callService('button', 'press', { entity_id: b }); 
  }

  getCardSize() { return 4; }
}

customElements.define('miele-appliance-card', MieleApplianceCard);
window.customCards = window.customCards || [];
window.customCards.push({ 
    type: "miele-appliance-card", 
    name: "Miele Appliance", 
    preview: true, 
    description: "Интерактивная карточка для стиральных и сушильных машин Miele" 
});
