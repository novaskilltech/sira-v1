import { useState } from "react";
import { Mail, Send, Copy, Check, Info } from "lucide-react";
import { useApp } from "../context";
import { BackLink, PageHeading } from "../components/Shared";

export default function Contact() {
  const { t, prefs } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoSubject = encodeURIComponent(`[Sîra Atlas] ${subject || "Message"}`);
    const mailtoBody = encodeURIComponent(
      `Nom / Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    );
    const mailtoUrl = `mailto:novaskilltech@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("novaskilltech@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="page-wrap contact-page">
      <BackLink />
      <PageHeading
        title={t("contactTitle")}
        description={t("contactDesc")}
      />

      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contact-name">{t("contactName")}</label>
            <input
              id="contact-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={prefs.locale === "fr" ? "ex. Ayoub / Fatima" : "مثال: عبد الله / فاطمة"}
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-email">{t("contactEmail")}</label>
            <input
              id="contact-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-subject">{t("contactSubject")}</label>
            <input
              id="contact-subject"
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={
                prefs.locale === "fr"
                  ? "Question historique, retour technique, suggestion..."
                  : "سؤال تاريخي، ملاحظة تقنية، اقتراح..."
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-message">{t("contactMessage")}</label>
            <textarea
              id="contact-message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                prefs.locale === "fr"
                  ? "Rédigez votre message ici..."
                  : "اكتب رسالتك هنا..."
              }
            />
          </div>

          <button type="submit" className="button primary contact-submit-btn">
            <Send size={18} />
            <span>{t("contactSend")}</span>
          </button>

          {submitted && (
            <div className="contact-status-box" role="status">
              <Info size={20} className="status-icon" />
              <div>
                <p><strong>{t("contactSuccess")}</strong></p>
                <p>{t("contactClientHint")} <strong>novaskilltech@gmail.com</strong></p>
              </div>
            </div>
          )}
        </form>

        <aside className="contact-sidebar">
          <div className="contact-info-card">
            <div className="contact-card-header">
              <Mail size={28} className="contact-mail-icon" />
              <h3>Novaskilltech</h3>
            </div>
            <p className="contact-card-desc">
              {prefs.locale === "fr"
                ? "Éditeur & Ingénierie logicielle pour l'Atlas interactif de la Sîra."
                : "جهة النشر والتطوير الهندسي لتطبيق أطلس السيرة النبوية."}
            </p>

            <div className="contact-direct-address">
              <span className="direct-label">Email direct :</span>
              <a href="mailto:novaskilltech@gmail.com" className="direct-email-link">
                novaskilltech@gmail.com
              </a>
            </div>

            <button
              type="button"
              className="button secondary contact-copy-btn"
              onClick={handleCopyEmail}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? t("contactCopied") : t("contactCopyEmail")}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
