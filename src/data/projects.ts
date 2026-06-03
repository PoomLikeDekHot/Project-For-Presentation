// ข้อมูลโปรเจกต์ทั้งหมด — ใช้สร้างทั้งการ์ดและ modal
// แปลงมาจาก object DATA เดิมในไฟล์ Portfolio.html

export type Component = [name: string, qty: string, desc: string];

export interface Project {
  /** key สำหรับเปิด modal */
  key: string;

  // ---- การ์ดหน้าแรก ----
  /** banner แบบ placeholder ลายเส้น (true) หรือใช้รูปพื้นหลัง (false) */
  placeholder: boolean;
  /** path รูป banner เมื่อไม่ใช่ placeholder */
  bannerImg?: string;
  /** แสดงปุ่ม play บน banner */
  hasPlay?: boolean;
  eyebrowTag: string;
  title: string;
  subtitle: string;
  cardDesc: string;
  cardTags: string[];
  openLabel: string;

  // ---- modal ----
  modalEyebrow: string;
  lead: string;
  /** สื่อหลักด้านบน modal */
  media: { kind: 'video' | 'image'; src: string; alt?: string };
  /** แกลเลอรีรูปบอร์ดจริง (optional) */
  gallery?: string[];
  /** หลักการทำงาน (รองรับ <b>) */
  steps: string[];
  /** อุปกรณ์ที่ใช้ */
  components: Component[];
}

export const projects: Project[] = [
  {
    key: 'smartpot',
    placeholder: true,
    hasPlay: true,
    eyebrowTag: 'IOT · WIRELESS',
    title: 'Smart Pot Monitor',
    subtitle: 'ระบบดูแลเฝ้าระวังกระถางต้นไม้',
    cardDesc:
      'เฝ้าระวังกระถางต้นไม้แบบเรียลไทม์ — วัดความชื้นในดิน การเอียง/ล้ม และคุณภาพอากาศ แล้วส่งข้อมูลแบบไร้สายผ่าน NRF24 ไปยังตัวรับเพื่อแจ้งเตือน',
    cardTags: ['Arduino Nano', 'MPU-6050', 'MQ-135', 'NRF24'],
    openLabel: '▶ ดูวิดีโอ & วิธีทำงาน',

    modalEyebrow: 'IOT · EMBEDDED · WIRELESS',
    lead: 'ระบบเฝ้าระวังกระถางต้นไม้แบบเรียลไทม์ ใช้ Arduino Nano สองตัวสื่อสารกันแบบไร้สายผ่านโมดูล NRF24 (2.4GHz) ฝั่งหนึ่งอ่านค่าจากเซ็นเซอร์ที่กระถาง อีกฝั่งรับข้อมูลมาแสดงสถานะและแจ้งเตือนเมื่อค่าผิดปกติ',
    media: { kind: 'video', src: '/assets/smartpot-demo.mp4' },
    steps: [
      '<b>อ่านค่าเซ็นเซอร์</b> — Arduino Nano (ตัวส่ง) อ่านความชื้นดิน, การเอียงจาก MPU-6050 และคุณภาพอากาศจาก MQ-135',
      '<b>ส่งข้อมูลไร้สาย</b> — รวมค่าทั้งหมดส่งผ่าน NRF24 ที่ความถี่ 2.4GHz ไปยัง Arduino Nano อีกตัว',
      '<b>ประมวลผล & แสดงผล</b> — ตัวรับนำค่ามาเทียบเกณฑ์ แล้วแสดงสถานะผ่าน LED 3 สี',
      '<b>แจ้งเตือน</b> — เมื่อดินแห้ง กระถางเอียง/ล้ม หรืออากาศแย่ ระบบจะเตือนทันที',
    ],
    components: [
      ['Arduino Nano', '×2', 'ศูนย์กลางประมวลผล — 8 ขา analog, 14 ขา digital I/O, สื่อสาร I2C ผ่าน A4/A5'],
      ['Soil Moisture Sensor', '', 'โพรบ 2 ขาวัดความต้านทานดิน ดินชื้นความต้านทานต่ำ · output 0–1023'],
      ['MPU-6050', 'I2C', 'ไจโร + แอคเซลใน 1 ตัว วัดการเอียง 3 แกน เพื่อจับว่ากระถางล้ม'],
      ['MQ-135', '', 'เซ็นเซอร์คุณภาพอากาศชนิดเคมี ค่าต้านทานเปลี่ยนตามแก๊ส · output 0–1023'],
      ['NRF24 2.4GHz', 'RF', 'โมดูลรับ-ส่งข้อมูลไร้สายระหว่างบอร์ดสองตัว'],
      ['Relay 1-Ch 5V', '', 'สวิตช์อิเล็กทรอนิกส์ ตัด/ต่อวงจรไฟภายนอก'],
      ['LED', '×3', 'แสดงสถานะการทำงานของระบบ 3 ระดับ'],
      ['Arduino IDE', 'C/C++', 'เขียนและอัปโหลดโปรแกรมควบคุมทั้งระบบ'],
    ],
  },
  {
    key: 'water',
    placeholder: false,
    bannerImg: '/assets/waterdispenser-intro.jpg',
    eyebrowTag: 'ARDUINO · MINI PROJECT',
    title: 'Auto Water Dispenser',
    subtitle: 'เครื่องกดน้ำอัตโนมัติ',
    cardDesc:
      'เครื่องกดน้ำอัตโนมัติ รับคำสั่งปริมาณน้ำผ่าน Keypad แสดงผลบน LCD ปั๊มน้ำพร้อมวัดปริมาณจริงด้วย Flow Meter จนได้ตามที่ตั้งไว้แล้วแจ้งเตือนด้วย Buzzer',
    cardTags: ['Arduino Uno R3', 'Keypad 4×4', 'LCD', 'Flow Meter'],
    openLabel: '🖼 ดูรูป & อุปกรณ์',

    modalEyebrow: 'ARDUINO · MINI PROJECT',
    lead: 'เครื่องกดน้ำอัตโนมัติบน Arduino Uno R3 ผู้ใช้กดปริมาณน้ำที่ต้องการผ่าน Keypad ระบบจะปั๊มน้ำพร้อมนับปริมาณจริงด้วย Flow Meter จนครบแล้วหยุดเองและแจ้งเตือน',
    media: { kind: 'image', src: '/assets/waterdispenser-intro.jpg', alt: 'Auto Water Dispenser' },
    gallery: ['/assets/build-01.jpg', '/assets/build-02.jpg', '/assets/build-03.jpg'],
    steps: [
      '<b>เลือกปริมาณ</b> — ผู้ใช้กดจำนวนน้ำที่ต้องการผ่าน Keypad (Numpad)',
      '<b>แสดงผล</b> — LCD แสดงค่าที่ตั้งไว้และสถานะการทำงาน',
      '<b>ปั๊มน้ำ</b> — Arduino สั่ง Water Pump ทำงาน พร้อมให้ Flow Meter นับปริมาณน้ำที่ไหลจริง',
      '<b>หยุด & แจ้งเตือน</b> — เมื่อถึงปริมาณที่ตั้ง ระบบหยุดปั๊มและส่งเสียงด้วย Buzzer',
    ],
    components: [
      ['Arduino Uno R3', '', 'ตัวควบคุมหลักของระบบ'],
      ['Keypad 4×4', 'Numpad', 'รับคำสั่งปริมาณน้ำจากผู้ใช้'],
      ['LCD', '', 'แสดงค่าที่ตั้งและสถานะการทำงาน'],
      ['Water Flow Meter', '', 'วัดปริมาณน้ำที่ไหลผ่านจริง'],
      ['Water Pump', '', 'ปั๊มน้ำตามคำสั่งจาก Arduino'],
      ['Buzzer', '', 'ส่งเสียงแจ้งเตือนเมื่อทำงานเสร็จ'],
      ['LED', '', 'แสดงสถานะการทำงาน'],
    ],
  },
  {
    key: 'ai',
    placeholder: false,
    bannerImg: '/assets/lung.jpg',
    eyebrowTag: 'EDGE AI · TINYML',
    title: 'AI Lung Sound Classifier',
    subtitle: 'เครื่องฟังเสียงปอดทำนายโรคด้วย AI',
    cardDesc:
      'อุปกรณ์ฟังเสียงปอดที่ออกแบบเอง ใช้เซ็นเซอร์ PVDF รับเสียง แล้วให้โมเดล AI (CNN/TinyML) แยกโรคทางเดินหายใจ 4 กลุ่ม รันบนชิป ESP32-S3 ได้โดยตรง',
    cardTags: ['ESP32-S3', 'TensorFlow Lite', 'CNN', 'PVDF Sensor'],
    openLabel: 'ดูขั้นตอน & อุปกรณ์',

    modalEyebrow: 'EDGE AI · TINYML · DSP',
    lead: 'อุปกรณ์ฟังเสียงปอด (electronic stethoscope) ที่ออกแบบเอง ใช้เซ็นเซอร์ PVDF รับเสียงปอดผ่านวงจรขยาย/กรองสัญญาณ แล้วให้โมเดล AI วิเคราะห์แยกโรคทางเดินหายใจ 4 กลุ่ม (Normal / Crackle / Wheeze / Both) โดยบีบอัดโมเดลให้รันบนชิป ESP32-S3 ได้โดยตรง เพื่อเป็นอุปกรณ์ราคาประหยัดที่ใช้ได้จริงที่บ้าน — งบฮาร์ดแวร์รวม ≈ 1,480–2,380 บาท',
    media: { kind: 'image', src: '/assets/lung.jpg', alt: 'AI Lung Sound Classifier' },
    steps: [
      '<b>Dataset</b> — เสียงปอด 920 ไฟล์ จาก Respiratory Sound Database (Kaggle) และ HF_Lung_V1 แบ่งเป็น 4 label: Normal, Crackle, Wheeze, Both',
      '<b>Preprocessing</b> — ปรับ Sampling Rate ให้เท่ากัน → ลด Noise (Band-pass filter / spectral gating) → Trim Silence → Normalization',
      '<b>Feature Extraction</b> — แปลงเสียงดิบเป็น Mel-Spectrogram ที่เลียนแบบการได้ยินของหู เก็บรายละเอียดความถี่ต่ำได้ดี ช่วยให้ AI แยกโรคได้แม่นกว่าเสียงดิบ',
      '<b>Model</b> — ใช้ CNN จับ Pattern ในภาพ Mel-Spectrogram (เช่นเสียงหวีดเป็นเส้นแนวนอน) ด้วยสถาปัตยกรรม MobileNet / EfficientNet ที่เล็กพอสำหรับ TinyML',
      '<b>Quantize & Deploy</b> — บีบอัดโมเดลเป็น .tflite (8-bit) ด้วย TensorFlow Lite แล้วรันบน ESP32-S3 (วัด Quantization Loss เช่น 92% → 88%)',
      '<b>Evaluate</b> — confusion_matrix, Learning Curve (Loss/Accuracy) และ Grad-CAM (Explainable AI) เพื่อตรวจว่า AI โฟกัสถูกจุด ไม่ใช่ Noise',
    ],
    components: [
      ['PVDF Sensor', '450–650฿', 'TE Connectivity 3-1004346-0 (Silver-ink) — รับแรงสั่นเสียงปอด'],
      ['Op-Amp (Low Noise)', '120–250฿', 'OPA1642 / OPA2134 (High Impedance) — ขยายสัญญาณเสียงให้สะอาด'],
      ['ADC Module', '180–250฿', 'PCM1808 · 24-bit, 99dB SNR — แปลงเสียงเป็นดิจิทัล'],
      ['Microcontroller', '280–380฿', 'ESP32-S3 DevKit (Native USB) — รันโมเดล AI บนบอร์ด'],
      ['Conductive Foam', '50–100฿', 'โฟมนำไฟฟ้า ต่อขาเซนเซอร์โดยไม่ต้องบัดกรี'],
      ['Passive Components', '100–150฿', 'ตัวต้านทาน/ตัวเก็บประจุ สำหรับวงจร Filter 20Hz–2kHz'],
      ['Housing & Diaphragm', '200–400฿', 'เคส 3D Print + แผ่นซิลิโคน/PET บาง'],
      ['USB-C Cable', '100–200฿', 'USB-C to USB-C (Data Transfer)'],
    ],
  },
];

export const projectMap: Record<string, Project> = Object.fromEntries(
  projects.map((p) => [p.key, p])
);
