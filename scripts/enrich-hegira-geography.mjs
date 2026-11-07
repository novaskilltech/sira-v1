/**
 * Sîra V1.0 — Enrichissement des notices géographiques et topographiques des 12 fiches Hégire
 * dans public/content/manifest.v1.json (statut DEMO / NON_VALIDE maintenu).
 */
import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('public/content/manifest.v1.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const geoNotes = {
  'HEG-ETP-01': {
    fr: 'Repère général : cuvette urbaine de La Mecque (vallée d’Ibrâhîm), encadrée par les massifs d’Abû Qubays et de Qu‘ayqi‘ân. Tracé de démonstration sans coordonnées cadastrales antiques.',
    ar: 'معلم عام: بطحاء مكة المكرمة المحاطة بجبل أبي قبيس وقعيقعان. رسم توضيحي تجريبي دون إحداثيات تفصيلية معتمدة.'
  },
  'HEG-ETP-02': {
    fr: 'Épisode non géolocalisable à l’échelle d’une parcelle : sortie nocturne discrète hors du tissu bâti mecquois vers le relief méridional, à contre-sens de la route habituelle du Nord.',
    ar: 'حدث غير قابل للتحديد الموضعي الدقيق: الخروج الليلي من عمران مكة باتجاه الجنوب، خلافاً للمسلك المعتاد نحو الشمال.'
  },
  'HEG-ETP-03': {
    fr: 'Repère général : massif escarpé du Jabal Thawr, au sud de La Mecque (~750 m d’altitude). L’abri rocheux domine les pistes environnantes ; localisation représentée à titre indicatif.',
    ar: 'معلم عام: جبل ثور الوعر جنوب مكة المكرمة. يمثل الغار نقطة ارتكاز للمكوث ثلاثة أيام قبل الانطلاق؛ الموقع تمثيلي غير مساحي.'
  },
  'HEG-ETP-04': {
    fr: 'Corridor illustratif (~420–450 km) : contournement vers le littoral de la mer Rouge (Tihâma) via ‘Usfân, Qadîd et al-Juhfa, à l’écart des grands axes caravaniers surveillés, avant la remontée vers les cols du Hedjaz.',
    ar: 'ممر توضيحي (نحو ٤٢٠–٤٥٠ كم): سلوك الطريق الساحلي عبر تهامة مروراً بعسفان وقديد والجحفة، تجنباً للجادة السلطانية المراقبة.'
  },
  'HEG-ETP-05': {
    fr: 'Repère général : palmeraie périphérique de Qubâ’, au sud de l’oasis de Yathrib, établie sur les terres fertiles irriguées par les écoulements des Harrat volcaniques.',
    ar: 'معلم عام: واحة قباء في المدخل الجنوبي ليثرب، حيث البساتين والآبار العذبة المحاطة بالحرات البركانية.'
  },
  'HEG-ETP-06': {
    fr: 'Repère général : dépression fertile de Yathrib (Médine), encadrée par le mont Uhud au nord et les coulées basaltiques (Harrat Wâqim et Harrat al-Wabara) à l’est et à l’ouest.',
    ar: 'معلم عام: حوض يثرب (المدينة المنورة) المحاط بجبل أحد شمالاً وحرتي واقم والوبرة شرقاً وغرباً.'
  },
  'HEG-DOS-07': {
    fr: 'Dossier thématique sans repère cartographique unique : analyse du basculement géopolitique entre la cité marchande de La Mecque et le pôle oasien de Yathrib.',
    ar: 'ملف موضوعي غير مرتبط بنقطة جغرافية واحدة: تحليل التحول التاريخي والاجتماعي بين مكة المكرمة وواحة يثرب.'
  },
  'HEG-DOS-08': {
    fr: 'Dossier thématique sans repère cartographique unique : étude de l’organisation logistique (rôles d’information, ravitaillement nocturne, guidage par ‘Abd Allâh ibn Urayqit).',
    ar: 'ملف موضوعي غير مرتبط بنقطة جغرافية واحدة: دراسة الترتيبات اللوجستية الدقيقة والتموين الليلي والاستدلال بالطرق.'
  },
  'HEG-DOS-09': {
    fr: 'Dossier géomorphologique : traversée des milieux arides du Hedjaz occidental — plaines sablonneuses côtières (Tihâma), plateaux de basalte noir (Harrat) et lits d’oueds saisonniers.',
    ar: 'ملف جغرافي طبيعي: خصائص تضاريس الحجاز وتهامة بين السهول الرملية الساحلية والحرات البازلتية والأودية الموسمية.'
  },
  'HEG-DOS-10': {
    fr: 'Dossier méthodologique : les sources anciennes (Ibn Ishâq, Ibn Sa‘d, al-Bukhârî) citent une vingtaine de toponymes d’étapes dont plusieurs ne peuvent être fixés au mètre près aujourd’hui.',
    ar: 'ملف منهجي: تذكر المصادر الكلاسيكية منازل متعددة على طول الطريق تتفاوت درجة التثبت من مواقعها المعاصرة.'
  },
  'HEG-DOS-11': {
    fr: 'Dossier social et institutionnel sans géolocalisation ponctuelle : solidarité et pacte de fraternisation (mu’âkhât) entre Émigrés mecquois (Muhâjirûn) et Auxiliaires médinois (Ansâr).',
    ar: 'ملف اجتماعي وتنظيمي: التكافل ونظام المؤاخاة بين المهاجرين والأنصار في المجتمع المدني الجديد.'
  },
  'HEG-DOS-12': {
    fr: 'Dossier de synthèse historique : portée civilisationnelle de l’Hégire et institution ultérieure de l’ère hégirienne sous le califat de ‘Umar ibn al-Khattâb.',
    ar: 'ملف تركيبي شامل: الأثر الحضاري والتاريخي للهجرة النبوية واعتمادها مبدأً للتقويم الهجري.'
  }
};

let count = 0;
for (const entry of manifest.contents) {
  if (entry.space === 'hegire' && geoNotes[entry.id] && entry.geography) {
    entry.geography.uncertainty = geoNotes[entry.id];
    count++;
  }
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Updated geography.uncertainty for ${count} Hegira entries.`);
