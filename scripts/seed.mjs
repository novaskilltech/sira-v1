import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
const read = (name) => parse(fs.readFileSync(name, 'utf8'), { columns: true, bom: true, skip_empty_lines: true });
const contents = read('inventaire_contenus.csv');
const objects = read('inventaire_objets_3d.csv');
const media = read('inventaire_medias.csv');
const split = (value) => value ? value.split(';') : [];
const arTitles = [
 'مكة: الإطار الجغرافي والاجتماعي','المولد والطفولة','الشباب والأنشطة','الحياة الأسرية قبل الوحي',
 'بدايات الوحي','أوائل المؤمنين بالرسالة','الدعوة العلنية','المعارضة والابتلاءات الأولى',
 'الهجرة إلى الحبشة','المقاطعة والصعوبات في مكة','عام الحزن ورحلة الطائف','لقاءات يثرب وبيعة العقبة',
 'الانطلاق في الهجرة','الوصول إلى قباء والمدينة','المسجد والحياة الجماعية','التنظيم الاجتماعي والعهود في المدينة',
 'بدر','أحد','غزوة الخندق','صلح الحديبية','دخول مكة','العلاقات والوفود','حجة الوداع','الأيام الأخيرة والوفاة',
 'مكة: سياق الرحيل','الرحيل من مكة','غار ثور','الطريق إلى يثرب','الوصول إلى قباء','الوصول والاستقرار في المدينة',
 'لماذا الهجرة؟','إعداد الرحلة وتنظيمها','ظروف الطريق وطبيعته','اختلاف الروايات وعدم يقين المسار','الصحبة والتعاون','أثر الهجرة ونتائجها',
 'الفضاءات المنزلية','مواد البناء وطرقه','الإضاءة والتخزين','المواد الغذائية واستخداماتها','إعداد الطعام','حفظ الأغذية',
 'التزوّد بالماء','نقل الماء','التخزين المنزلي','الألياف والمواد','الصناعة والعناية','الأحذية والملحقات',
 'الفخار والأواني','النسيج والصناعة','صناعة الجلود','التبادل والأسواق','الأوزان والمقاييس','تداول المنتجات',
 'التجهيزات المادية للسفر','نقل الأمتعة','الاهتداء والتزوّد','حوامل الكتابة','الأدوات والمواد','استخدامات النقل الكتابي',
];
const groupsAr = ['السياق المكي','بدايات الوحي','قبل الهجرة','الاستقرار في المدينة','الابتلاءات في المدينة','السنوات الأخيرة','المسار','ملفات','المسكن','الغذاء','الماء والتخزين','الملابس والمنسوجات','الحرف','التجارة والمقاييس','السفر والتجهيزات','الكتابة والنقل'];
const groups = [...new Set(contents.map(c => c.group))];
const objAr = ['مصباح','صندوق','مزلاج باب','رحى يدوية','إناء للطبخ','قربة','جرة','نعل','مغزل','مشط','أداة فخارية','مكوك نسيج','مخرز','ميزان','ثقل للقياس','حقيبة سفر','رحل دون حيوان','صندوق نقل','محبرة','لوح للكتابة'];
const demoText = {
 fr: ['Cette fiche de démonstration présente un sujet de l’atlas. Son récit historique est en préparation et ne constitue pas encore un contenu validé.', 'Les repères, les termes et les variantes de récit devront être établis à partir de références documentaires examinées par un spécialiste.', 'Le récit complet sera intégré après relecture historique et linguistique. Aucun événement, détail géographique ou citation n’est ajouté pour remplir cet emplacement.', 'Vous pouvez explorer la navigation, les sources et les objets de démonstration. Les illustrations sont des évocations ; elles ne prouvent ni une apparence ni une localisation historique.'],
 ar: ['تعرض هذه البطاقة التجريبية موضوعاً من الأطلس. لا يزال النص التاريخي قيد الإعداد ولم يُعتمد بعد.', 'يجب تحديد المعالم والمصطلحات واختلاف الروايات بالاعتماد على مراجع يراجعها مختص مستقل.', 'سيُضاف النص الكامل بعد المراجعة التاريخية واللغوية. لا نضيف أحداثاً أو تفاصيل جغرافية أو اقتباسات لملء هذا الموضع.', 'يمكنك استكشاف التنقل والمصادر والنماذج التجريبية. الرسوم تصورات تعليمية وليست دليلاً على شكل أو موقع تاريخي.'],
};
const headings = { fr: ['Introduction','Le contexte','Le récit','À retenir'], ar: ['مقدمة','السياق','السرد','خلاصة'] };
const normalized = contents.map((c, i) => ({
 id: c.id, space: c.space, kind: c.type, group: { fr: c.group, ar: groupsAr[groups.indexOf(c.group)] }, order: i + 1,
 localized: Object.fromEntries(['fr','ar'].map(locale => [locale, {
  title: locale === 'fr' ? c.title : arTitles[i], intro: demoText[locale][0],
  learningObjective: locale === 'fr' ? 'Relier les repères temporels, les lieux et la culture matérielle.' : 'ربط المعالم الزمنية والأماكن والثقافة المادية.',
  sections: demoText[locale].map((body, j) => ({ sectionId: ['introduction','contexte','recit','synthese'][j], heading: headings[locale][j], body })),
  audioScript: '', revision: 'demo-1',
 }])),
 mediaRefs: [...split(c.image_refs), ...split(c.animation_refs), c.audio_fr_id, c.audio_ar_id],
 objectIds: split(c.objects), animationIds: split(c.animation_refs), audioRefs: { fr: c.audio_fr_id, ar: c.audio_ar_id },
 relations: c.id === 'CHR-13' ? ['HEG-ETP-01','HEG-ETP-03'] : c.id === 'HEG-ETP-03' ? ['CHR-13','HEG-DOS-10'] : [],
 referenceIds: [], approvalRecords: [], status: 'DEMO', revision: 'demo-1',
 geography: c.space === 'hegire' ? { kind: c.type === 'dossier' || c.id === 'HEG-ETP-02' ? 'not_mappable' : c.id === 'HEG-ETP-04' ? 'illustrative_corridor' : 'general_marker', sourceIds: [], uncertainty: { fr: 'Schéma de démonstration, sans coordonnées ni précision géographique validée.', ar: 'رسم تجريبي دون إحداثيات أو دقة جغرافية معتمدة.' } } : null,
}));
const assets = media.map(m => ({
 assetId: m.id, kind: m.type, contentIds: split(m.content_ids), locale: ['fr','ar'].includes(m.locale) ? m.locale : null,
 role: m.role, source: m.source, status: 'PLACEHOLDER', url: null, hash: null, size: null, mimeType: null,
 durationSeconds: null, measuredDurationSeconds: null, scriptVersion: null, sectionCuePoints: [],
 alt: { fr: m.role, ar: 'وسيط تعليمي قيد الإعداد' },
 caption: { fr: 'Emplacement réservé — média final absent.', ar: 'موضع محجوز — الوسيط النهائي غير متوفر.' },
 credit: null, license: null, referenceIds: [], approvalRecords: [], revision: 'demo-1',
 fallbackAssetId: m.id.startsWith('GLB-') ? m.id.replace('GLB-', 'FALLBACK-') : null,
}));
const registry = { version: '0.1.0-demo', channel: 'demo', updatedAt: '2026-10-25', contents: normalized,
 objects: objects.map((o,i) => ({ id: o.id, name: { fr: o.name, ar: objAr[i] }, theme: o.theme, mediaId: `GLB-${o.id}`, fallbackId: `FALLBACK-${o.id}`, status: 'DEMO' })),
 assets, references: [], operator: { name: '', contact: '', host: '', privacyReviewed: false },
};
fs.mkdirSync('public/content', { recursive: true });
fs.writeFileSync('public/content/manifest.v1.json', JSON.stringify(registry, null, 2) + '\n');
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/inventory.json', JSON.stringify({ counts: { contents: normalized.length, objects: objects.length, assets: assets.length }, sourceMediaTypes: Object.groupBy(media, m => m.type), backlog: read('backlog.csv'), acceptance: read('recette.csv') }, null, 2));
console.log(`Imported ${normalized.length} content entries, ${objects.length} objects and ${assets.length} media slots. No approvals inferred.`);
