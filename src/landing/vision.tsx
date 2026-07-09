import { Eye, Star } from "lucide-react";

export default function Vision() {
  return (
    <section className="relative overflow-hidden bg-secondary px-6 py-20 md:px-16 lg:px-24">
      <div className="pointer-events-none absolute -right-28 -top-24 h-[420px] w-[420px] rounded-full bg-primary/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-primary/5" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <h2 className="mb-4 text-4xl font-semibold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
          Our <span className="text-primary">Vision</span> &{" "}
          <span className="text-primary">Mission</span>
        </h2>

        <p className="mb-14 max-w-2xl text-base leading-7 text-gray-600">
          At Denteeth, we believe a healthy smile transforms lives. Every choice
          we make is guided by our commitment to compassionate, world-class
          dental care.
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
              <Eye className="h-6 w-6 text-primary" />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Our Vision
            </p>

            <h3 className="mb-4 text-2xl font-semibold leading-snug text-gray-900">
              A world of confident, healthy smiles
            </h3>

            <p className="leading-7 text-gray-600">
              To be the most trusted dental partner in Southeast Asia — where
              every patient walks in with anxiety and walks out with a smile
              they're proud to show the world.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-primary p-8 text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1 bg-white/30" />

            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Star className="h-6 w-6 text-white" />
            </div>

            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
              Our Mission
            </p>

            <h3 className="mb-4 text-2xl font-semibold leading-snug">
              Exceptional care, every single visit
            </h3>

            <p className="leading-7 text-blue-100">
              To deliver gentle, evidence-based dental treatments in a warm and
              welcoming environment — making premium oral health accessible,
              comfortable, and life-changing for every patient.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
