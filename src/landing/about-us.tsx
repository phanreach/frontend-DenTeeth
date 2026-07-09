export default function AboutUs() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">
            About DenTeeth
          </div>

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Building smarter
            <br />
            dental care.
          </h1>
        </div>

        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <div className="rounded-[32px] border border-blue-100 bg-white p-8 shadow-[0_10px_40px_rgba(59,130,246,0.08)]">
              <div className="mb-5 inline-flex rounded-2xl bg-blue-50 px-4 py-2 text-sm font-semibold text-primary">
                Our Story
              </div>

              <h2 className="text-3xl font-bold leading-tight text-slate-900">
                Transforming the future of
                <span className="text-primary"> dental screening.</span>
              </h2>

              <p className="mt-6 leading-relaxed text-slate-500">
                DenTeeth was created to bridge the gap between everyday oral
                care and professional dental support. By using advanced AI
                vision technology, we help users identify visible dental
                concerns quickly and easily from the comfort of their home.
              </p>

              <p className="mt-4 leading-relaxed text-slate-500">
                Our mission is to provide a modern, accessible, and
                privacy-focused experience that empowers people to take better
                care of their smile.
              </p>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { value: "10K+", label: "Scans" },
                  { value: "95%", label: "Accuracy" },
                  { value: "24/7", label: "Access" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl bg-blue-50/60 p-4 text-center"
                  >
                    <h3 className="text-2xl font-bold text-primary">
                      {item.value}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-blue-100 blur-3xl" />

            <div className="relative overflow-hidden rounded-[36px] border border-white/70 shadow-[0_20px_60px_rgba(59,130,246,0.15)]">
              <img
                src="https://img.freepik.com/free-photo/homepage-seen-laptop-screen_23-2149416731.jpg?semt=ais_hybrid&w=740&q=80"
                alt="Modern dental clinic"
                className="h-[520px] w-full object-cover"
              />

              <div className="absolute bottom-6 left-6 rounded-3xl bg-white/90 px-6 py-5 shadow-xl backdrop-blur-md">
                <p className="text-sm font-semibold text-slate-800">
                  Modern AI-Powered Dentistry
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Designed for smarter patient experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
