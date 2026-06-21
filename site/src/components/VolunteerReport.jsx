import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "sting_volunteer_reports";

function getReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveReport(report) {
  const existing = getReports();
  existing.push({ ...report, submittedAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return existing.length;
}

const SCAM_TYPES = [
  "Phone call",
  "Text message",
  "Email",
  "Website",
  "Social media",
  "Other",
];

const today = () => new Date().toISOString().split("T")[0];

export default function VolunteerReport() {
  const [formData, setFormData] = useState({
    scamType: "",
    description: "",
    suspiciousContact: "",
    date: today(),
    howFound: "",
    additionalNotes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  useEffect(() => {
    setReportCount(getReports().length);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const count = saveReport(formData);
    setReportCount(count);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleReset() {
    setFormData({
      scamType: "",
      description: "",
      suspiciousContact: "",
      date: today(),
      howFound: "",
      additionalNotes: "",
    });
    setSubmitted(false);
  }

  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto text-gray-200">
      <Link
        to="/"
        className="text-amber-400 hover:text-amber-300 text-sm mb-8 inline-block"
      >
        &larr; Back to STING
      </Link>

      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
        Help Others Stay Safe
      </h1>
      <p className="text-lg text-gray-300 mb-4 leading-relaxed">
        If you or someone in your family encountered a scam, sharing the details
        here helps protect other families.
      </p>

      {/* Trust indicators */}
      <div className="flex flex-wrap gap-3 mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-4 py-2 text-sm text-amber-400 border border-amber-400/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
              clipRule="evenodd"
            />
          </svg>
          Your information stays private
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300 border border-white/10">
          No account needed
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2 text-sm text-gray-300 border border-white/10">
          Takes 2 minutes
        </span>
      </div>

      {/* Community counter */}
      {reportCount > 0 && (
        <div className="mb-8 p-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] text-center">
          <p className="text-lg text-amber-400 font-semibold">
            {reportCount} report{reportCount !== 1 ? "s" : ""} submitted by the
            community
          </p>
        </div>
      )}

      {submitted ? (
        /* Success message */
        <div
          className="p-8 rounded-2xl border border-green-500/30 bg-green-500/[0.06] text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-5xl mb-4" aria-hidden="true">
            &#x2714;&#xFE0F;
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Your report helps protect other families. STING will use this
            information to improve scam detection.
          </p>
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-xl bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors text-lg font-medium border border-amber-400/20"
          >
            Submit another report
          </button>
        </div>
      ) : (
        /* Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Scam type */}
          <div>
            <label
              htmlFor="scamType"
              className="block text-lg font-medium text-white mb-2"
            >
              What type of scam?{" "}
              <span className="text-amber-400" aria-label="required">
                *
              </span>
            </label>
            <select
              id="scamType"
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
              required
              aria-required="true"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors appearance-none"
            >
              <option value="" disabled>
                Select a type...
              </option>
              {SCAM_TYPES.map((type) => (
                <option key={type} value={type} className="bg-[#0a0a0f] text-gray-200">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-lg font-medium text-white mb-2"
            >
              What happened?
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="In your own words, describe what happened..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors resize-y"
              aria-describedby="description-hint"
            />
            <p id="description-hint" className="mt-1 text-sm text-gray-500">
              Share as much or as little as you are comfortable with.
            </p>
          </div>

          {/* Suspicious URL or phone number */}
          <div>
            <label
              htmlFor="suspiciousContact"
              className="block text-lg font-medium text-white mb-2"
            >
              Suspicious URL or phone number
            </label>
            <input
              id="suspiciousContact"
              name="suspiciousContact"
              type="text"
              value={formData.suspiciousContact}
              onChange={handleChange}
              placeholder="Paste the link or number here if you have it"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
            />
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-lg font-medium text-white mb-2"
            >
              When did this happen?
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors"
            />
          </div>

          {/* How discovered */}
          <div>
            <label
              htmlFor="howFound"
              className="block text-lg font-medium text-white mb-2"
            >
              How did you find out it was a scam?
            </label>
            <textarea
              id="howFound"
              name="howFound"
              value={formData.howFound}
              onChange={handleChange}
              rows={3}
              placeholder="Did someone warn you? Did you lose money? Was it just a gut feeling?"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors resize-y"
            />
          </div>

          {/* Additional notes */}
          <div>
            <label
              htmlFor="additionalNotes"
              className="block text-lg font-medium text-white mb-2"
            >
              Anything else?
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              rows={2}
              placeholder="Any other details you would like to share..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 text-lg text-gray-200 placeholder-gray-500 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20 transition-colors resize-y"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full rounded-xl bg-honey px-8 py-5 text-xl font-semibold text-surface transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-honey/20 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:ring-offset-2 focus:ring-offset-surface"
          >
            Submit my report &mdash; help protect others
          </button>
        </form>
      )}

      {/* Privacy & disclaimer */}
      <div className="mt-10 space-y-4">
        <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-gray-400 leading-relaxed">
          <p className="font-medium text-gray-300 mb-1">Privacy statement</p>
          <p>
            This form does not ask for your name, email, or any personally
            identifying information. The details you share are used only to
            identify scam patterns and improve detection.
          </p>
        </div>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          This form is for collecting scam patterns to improve detection. For
          immediate help, contact your bank or local authorities. STING does not
          guarantee a response or specific action on individual reports.
        </p>
      </div>

      <div className="mt-12 pt-6 border-t border-white/5 text-center text-gray-500 text-xs">
        STING &mdash; Scam Tracking &amp; Intelligence Network Guard
      </div>
    </div>
  );
}
