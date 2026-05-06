import { Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto px-6 pt-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-semibold text-xl text-white tracking-tight">
                DenTeeth
              </span>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed mb-6 max-w-xs">
              Advanced dental care powered by AI. Healthier smiles, smarter
              diagnostics, starting today.
            </p>

            <div className="flex flex-col gap-3">
              {[
                { icon: Phone, text: "078 88 63 48" },
                { icon: Mail, text: "denteeth@gmail.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-primary" />
                  </span>
                  <span className="text-sm text-slate-400">{text}</span>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 mt-6 border border-slate-700 rounded-full px-3.5 py-1.5 text-xs text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Accepting new patients
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["AI Scan", "/scan"],
                ["History", "/history"],
              ].map(([label, href]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-sm text-slate-500 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              {[
                ["Privacy Policy", "#"],
                ["Terms of Service", "#"],
                ["FAQ", "#"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-sm text-slate-500 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center py-5 gap-3">
          <p className="text-xs text-slate-600">
            © 2025 JCI Chaktomuk. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Privacy", "Terms", "FAQ"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
