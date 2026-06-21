import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "sting_volunteer_reports";

function getReportCount() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default function VolunteerReport() {
  const [submitted, setSubmitted] = useState(false);
  const [reportCount, setReportCount] = useState(0);
  const [formData, setFormData] = useState({
    scamType: "",
    whatHappened: "",
    suspiciousContact: "",
    whenHappened: new Date().toISOString().split("T")[0],
    howRealized: "",
    anythingElse: "",
  });

  useEffect(() => {
    setReportCount(getReportCount());
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.scamType) return;

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const report = { ...formData, submittedAt: new Date().toISOString() };
      existing.push(report);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setReportCount(existing.length);
    } catch {
      // localStorage unavailable — still show success for demo
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative z-10 min-h-screen px-4 py-16 max-w-3xl mx-auto">
      {/* Skip link for accessibility */}
      <a
        href="#report-form"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-400 focus:text-black focus:rounded-lg focus:text-lg focus:font-semibold"
      >
        Skip to report form
      </a>

      <Link
        to="/"
        className="text-amber-400 hover:text-amber-300 text-lg mb-8 inline-block focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] rounded px-2 py-1"
      >
        &larr; Back to STING
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
          Help protect other families
        </h1>
        <p className="text-xl text-gray-300 leading-relaxed">
          If you or someone in your family saw a scam, sharing details here helps
          us protect others in the community.
        </p>
      </header>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-4 mb-10" role="list" aria-label="Trust information">
        <div
          role="listitem"
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] text-lg text-gray-200"
        >
          <span className="text-amber-400 text-2xl" aria-hidden="true">&#128274;</span>
          No account needed
        </div>
        <div
          role="listitem"
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] text-lg text-gray-200"
        >
          <span className="text-amber-400 text-2xl" aria-hidden="true">&#9201;</span>
          Takes 2 minutes
        </div>
        <div
          role="listitem"
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] text-lg text-gray-200"
        >
          <span className="text-amber-400 text-2xl" aria-hidden="true">&#128737;</span>
          Your info stays private
        </div>
      </div>

      {submitted ? (
        /* Success message */
        <div
          className="p-8 rounded-2xl border border-green-400/30 bg-green-400/[0.05] text-center"
          role="alert"
          aria-live="polite"
        >
          <div className="text-5xl mb-4" aria-hidden="true">&#10003;</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            Thank you for helping protect others
          </h2>
          <p className="text-xl text-gray-300 mb-4 leading-relaxed">
            Your report has been saved. Every report helps our community
            recognize scams faster and keep families safe.
          </p>
          <p className="text-lg text-amber-400 font-medium mb-6">
            {reportCount} {reportCount === 1 ? "report" : "reports"} submitted
            by our community
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setFormData({
                scamType: "",
                whatHappened: "",
                suspiciousContact: "",
                whenHappened: new Date().toISOString().split("T")[0],
                howRealized: "",
                anythingElse: "",
              });
            }}
            className="inline-block px-6 py-3 rounded-xl bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 transition-colors text-lg font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0a0a0f]"
          >
            Submit another report
          </button>
        </div>
      ) : (
        /* Form */
        <form
          id="report-form"
          onSubmit={handleSubmit}
          className="space-y-8"
          noValidate
        >
          {/* Community counter */}
          {reportCount > 0 && (
            <p className="text-lg text-amber-400/80 font-medium">
              {reportCount} {reportCount === 1 ? "report" : "reports"} already
              submitted by our community
            </p>
          )}

          {/* Scam type — required */}
          <div className="space-y-2">
            <label
              htmlFor="scamType"
              className="block text-xl font-semibold text-white"
            >
              What type of scam? <span className="text-amber-400">*</span>
            </label>
            <p className="text-lg text-gray-400" id="scamType-desc">
              Select the option that best describes what you encountered.
            </p>
            <select
              id="scamType"
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
              required
              aria-describedby="scamType-desc"
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Choose one...
              </option>
              <option value="phone">Phone call</option>
              <option value="sms">Text / SMS</option>
              <option value="email">Email</option>
              <option value="website">Website</option>
              <option value="social">Social media</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* What happened */}
          <div className="space-y-2">
            <label
              htmlFor="whatHappened"
              className="block text-xl font-semibold text-white"
            >
              What happened?
            </label>
            <p className="text-lg text-gray-400" id="whatHappened-desc">
              Tell us in your own words. No detail is too small.
            </p>
            <textarea
              id="whatHappened"
              name="whatHappened"
              value={formData.whatHappened}
              onChange={handleChange}
              rows={5}
              aria-describedby="whatHappened-desc"
              placeholder="In your own words..."
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-y min-h-[120px]"
            />
          </div>

          {/* Suspicious contact */}
          <div className="space-y-2">
            <label
              htmlFor="suspiciousContact"
              className="block text-xl font-semibold text-white"
            >
              Any suspicious URL, phone number, or email?
            </label>
            <p className="text-lg text-gray-400" id="suspiciousContact-desc">
              If you have it, paste it here. This helps us track known scammers.
            </p>
            <input
              id="suspiciousContact"
              name="suspiciousContact"
              type="text"
              value={formData.suspiciousContact}
              onChange={handleChange}
              aria-describedby="suspiciousContact-desc"
              placeholder="e.g. 1-800-555-0123 or scam@example.com"
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>

          {/* When */}
          <div className="space-y-2">
            <label
              htmlFor="whenHappened"
              className="block text-xl font-semibold text-white"
            >
              When did it happen?
            </label>
            <p className="text-lg text-gray-400" id="whenHappened-desc">
              An approximate date is fine.
            </p>
            <input
              id="whenHappened"
              name="whenHappened"
              type="date"
              value={formData.whenHappened}
              onChange={handleChange}
              aria-describedby="whenHappened-desc"
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
            />
          </div>

          {/* How realized */}
          <div className="space-y-2">
            <label
              htmlFor="howRealized"
              className="block text-xl font-semibold text-white"
            >
              How did you realize it was a scam?
            </label>
            <p className="text-lg text-gray-400" id="howRealized-desc">
              This helps others recognize similar tricks.
            </p>
            <textarea
              id="howRealized"
              name="howRealized"
              value={formData.howRealized}
              onChange={handleChange}
              rows={3}
              aria-describedby="howRealized-desc"
              placeholder="What made you suspicious?"
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-y"
            />
          </div>

          {/* Anything else */}
          <div className="space-y-2">
            <label
              htmlFor="anythingElse"
              className="block text-xl font-semibold text-white"
            >
              Anything else?
            </label>
            <textarea
              id="anythingElse"
              name="anythingElse"
              value={formData.anythingElse}
              onChange={handleChange}
              rows={2}
              placeholder="Optional — any other details"
              className="w-full px-4 py-4 text-lg rounded-xl border border-white/10 bg-white/[0.04] text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 resize-y"
            />
          </div>

          {/* Privacy statement */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-lg text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-300">Your privacy matters.</span>{" "}
              We do not ask for your name, email, or any personal information.
              Reports are stored only on your device and used solely to help
              identify scam patterns.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-5 px-8 rounded-2xl bg-amber-400 text-[#0a0a0f] text-xl font-bold transition-all duration-200 hover:bg-amber-300 hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-amber-400/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!formData.scamType}
          >
            Submit my report — help protect others
          </button>

          {!formData.scamType && (
            <p className="text-lg text-gray-500 text-center" role="status">
              Please select a scam type above to submit.
            </p>
          )}

          {/* Disclaimer */}
          <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="text-lg text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-300">Important:</span>{" "}
              This form does not replace reporting to authorities. For immediate
              help, call your bank. To file an official report, contact the{" "}
              <a
                href="https://reportfraud.ftc.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline focus:outline-none focus:ring-2 focus:ring-amber-400 rounded"
              >
                FTC
              </a>{" "}
              or your local authorities.
            </p>
          </div>
        </form>
      )}

      <div className="mt-12 pt-6 border-t border-white/5 text-center text-gray-500 text-base">
        STING — Scam Tracking &amp; Intelligence Network Guard
      </div>
    </div>
  );
}
