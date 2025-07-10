const splash = document.getElementById("splash");
const startBtn = document.getElementById("startBtn");
const chatbox = document.getElementById("chatbox");
const messages = document.getElementById("messages");
const notice = document.getElementById("notice");

let step = 0, lang = "en", hasBiology = false;

const T = {
  chooseLang: { en: "Please choose a language", hi: "कृपया भाषा चुनें" },
  langOpt: [{ en: "English", hi: "अंग्रेज़ी", value: "en" }, { en: "हिन्दी", hi: "हिन्दी", value: "hi" }],
  intro: { en: "Hello! Are you interested in taking admission to a Nursing College?", hi: "नमस्ते! क्या आप नर्सिंग कॉलेज में प्रवेश लेने में रुचि रखते हैं?" },
  biologyQ: { en: "Did you study Biology in 12th grade?", hi: "क्या आपने 12वीं में बायोलॉजी पढ़ी है?" },
  yesBiology: { en: "Yes, I had Biology", hi: "हाँ, मैंने बायोलॉजी पढ़ी है" },
  noBiology: { en: "No, I had another subject", hi: "नहीं, दूसरा विषय था" },
  biologyNeed: { en: "Biology is mandatory for B.Sc Nursing admission.", hi: "B.Sc नर्सिंग में प्रवेश के लिए बायोलॉजी अनिवार्य है।" },
  courseInfo: { en: "B.Sc Nursing is a 4‑year full‑time course. Do you want more details?", hi: "B.Sc नर्सिंग 4 साल का फुल‑टाइम कोर्स है। क्या आप और जानकारी चाहेंगे?" },
  yes: { en: "Yes, tell me more", hi: "हाँ, बताइए" },
  no: { en: "No, that's all", hi: "नहीं, बस इतना ही" },
  fees: { en: "Fee breakdown:\nTuition ₹60,000\nBus ₹10,000\nTotal ₹70,000 (3 instalments: 30k, 20k, 20k)", hi: "फीस विवरण:\nट्यूशन ₹60,000\nबस ₹10,000\nकुल ₹70,000 (3 किस्तें: 30k, 20k, 20k)" },
  hostelQ: { en: "Would you like to know about hostel and training facilities?", hi: "क्या आप हॉस्टल और प्रशिक्षण सुविधाओं के बारे में जानना चाहेंगे?" },
  hostelInfo: { en: "Hostel has 24x7 water, electricity, CCTV, and warden. Hospital training is included.", hi: "हॉस्टल में 24x7 पानी, बिजली, CCTV और वार्डन उपलब्ध है। अस्पताल प्रशिक्षण शामिल है।" },
  locationQ: { en: "The college is located in Delhi. Want more about location?", hi: "कॉलेज दिल्ली में स्थित है। लोकेशन के बारे में और जानना चाहेंगे?" },
  locationInfo: { en: "Recognised by INC Delhi. Clinical training at District, CHC, Regional & Ranchi hospitals.", hi: "INC दिल्ली द्वारा मान्यता प्राप्त। क्लिनिकल ट्रेनिंग जिला, CHC, रीजनल व राँची अस्पतालों में।" },
  scholarshipQ: { en: "Scholarships: Govt Post‑Matric (₹18‑23k), Labour Ministry (₹40‑48k). Know seats & eligibility?", hi: "छात्रवृत्ति: सरकारी पोस्ट‑मैट्रिक (₹18‑23k), श्रम मंत्रालय (₹40‑48k)। सीटें व पात्रता जानें?" },
  seatInfo: { en: "Total 60 seats. Eligibility: Biology in 12th, PNT pass, Age 17‑35.", hi: "कुल 60 सीटें। पात्रता: 12वीं में बायोलॉजी, PNT पास, आयु 17‑35।" },
  bye: { en: "Alright. We’re available for help in future. Thank you!", hi: "ठीक है। हम भविष्य में भी मदद के लिए उपलब्ध हैं। धन्यवाद!" },
  anyQ: { en: "Do you have any other question?", hi: "क्या आपका कोई अन्य सवाल है?" }
};

const txt = k => T[k][lang];

startBtn.addEventListener("click", () => {
  splash.style.opacity = "0";
  setTimeout(() => splash.style.display = "none", 400);
  setTimeout(() => {
    chatbox.style.visibility = "visible";
    startNewChat();
  }, 1000);
});

function appendMessage(text, sender, cb = null) {
  const msg = document.createElement("div"); msg.classList.add("message", sender);
  const buf = document.createElement("div"); buf.classList.add("message", "bot"); buf.textContent = "⏳ …";
  messages.appendChild(buf); messages.scrollTop = messages.scrollHeight;
  setTimeout(() => {
    messages.removeChild(buf);
    messages.appendChild(msg);
    typeText(msg, text, 0, cb);
    messages.scrollTop = messages.scrollHeight;
  }, 1000);
}

function typeText(el, text, i = 0, done = null) {
  if (i < text.length) {
    el.innerHTML += text.charAt(i);
    setTimeout(() => typeText(el, text, i + 1, done), 20);
  } else if (typeof done === "function") done();
}

function showOptions(arr) {
  const d = document.createElement("div"); d.className = "options";
  arr.forEach(o => {
    const b = document.createElement("button");
    b.className = "option-button";
    b.innerText = o.label;
    b.onclick = () => {
      appendMessage(o.label, "user");
      messages.removeChild(d);
      setTimeout(() => handleResponse(o.value), 300);
    };
    d.appendChild(b);
  });
  messages.appendChild(d);
  messages.scrollTop = messages.scrollHeight;
}

function handleResponse(input) {
  if (step === 0) { lang = input; step = 1; appendMessage(txt("intro"), "bot", () => showOptions([{ label: txt("yes"), value: "yes" }, { label: txt("no"), value: "no" }])); return; }
  if (["no", "nahi"].includes(input)) { appendMessage(txt("bye"), "bot", () => notice.style.display = "block"); return; }
  switch (step) {
    case 1: appendMessage(txt("biologyQ"), "bot", () => showOptions([{ label: txt("yesBiology"), value: "biology" }, { label: txt("noBiology"), value: "other" }])); step++; break;
    case 2:
      if (input === "biology") {
        hasBiology = true;
        appendMessage(txt("courseInfo"), "bot", () => showOptions([{ label: txt("yes"), value: "yes" }, { label: txt("no"), value: "no" }]));
        step++;
      } else {
        appendMessage(txt("biologyNeed"), "bot", () => notice.style.display = "block");
      }
      break;
    case 3:
      appendMessage(txt("fees"), "bot", () => {
        appendMessage(txt("hostelQ"), "bot", () => showOptions([{ label: txt("yes"), value: "yes" }, { label: txt("no"), value: "no" }]));
      });
      step++;
      break;
    case 4:
      appendMessage(txt("hostelInfo"), "bot", () => {
        appendMessage(txt("locationQ"), "bot", () => showOptions([{ label: txt("yes"), value: "yes" }, { label: txt("no"), value: "no" }]));
      });
      step++;
      break;
    case 5:
      appendMessage(txt("locationInfo"), "bot", () => {
        appendMessage(txt("scholarshipQ"), "bot", () => showOptions([{ label: txt("yes"), value: "yes" }, { label: txt("no"), value: "no" }]));
      });
      step++;
      break;
    case 6:
      appendMessage(txt("seatInfo"), "bot", () => {
        appendMessage(txt("anyQ"), "bot", () => notice.style.display = "block");
      });
      step++;
      break;
    default:
      appendMessage(txt("bye"), "bot", () => notice.style.display = "block");
  }
}

function startNewChat() {
  messages.innerHTML = "";
  step = 0;
  lang = "en";
  hasBiology = false;
  notice.style.display = "none";
  appendMessage(txt("chooseLang"), "bot", () => showOptions(T.langOpt.map(o => ({ label: o.en, value: o.value }))));
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
