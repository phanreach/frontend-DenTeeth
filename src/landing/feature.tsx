import { Bell, Calendar, Camera, ShieldCheck } from "lucide-react";

export default function Feature() {
  return (
    <div className="bg-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">
            Smart Dental Technology
          </div>

          <h1
            className="text-5xl font-bold leading-tight text-slate-900 md:text-6xl"
            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
          >
            Understand
            <br />
            your <span className="italic text-primary">smile.</span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-slate-500">
            DenTeeth combines AI-powered screening with modern dental care to
            help users detect visible oral conditions quickly and confidently.
          </p>
        </div>

        <div className="space-y-5">
          {[
            {
              icon: Camera,
              title: "Visual AI Analysis",
              desc: "Powerful vision models identify 6 major classes of oral conditions from a single smartphone photo.",
            },
            {
              icon: ShieldCheck,
              title: "Private & Secure",
              desc: "Your dental scans are encrypted and never shared without explicit professional consent.",
            },
            {
              icon: Calendar,
              title: "Easy Appointment Booking",
              desc: "Seamlessly schedule visits with top-rated local dentists directly through our integrated booking system.",
            },
            {
              icon: Bell,
              title: "Instant Notifications",
              desc: "Receive instant screening results and appointment reminders through your preferred notification channels.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group flex items-start gap-5 rounded-3xl border border-slate-100 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 transition-colors duration-300 group-hover:bg-primary">
                <item.icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-white" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {item.title}
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-slate-500">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
