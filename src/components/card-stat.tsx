import {
  Users,
  FolderKanban,
  Handshake,
  Calendar,
  Folder,
  Ticket,
  CircleDollarSignIcon,
  ClipboardClockIcon,
  NewspaperIcon,
  Stethoscope,
  Camera,
  Microscope,
  UserKey,
} from "lucide-react";

const iconMap = {
  users: Users,
  projects: FolderKanban,
  sponsors: Handshake,
  Calendar: Calendar,
  Folder: Folder,
  Ticket: Ticket,
  Dollar: CircleDollarSignIcon,
  Remaining: ClipboardClockIcon,
  News: NewspaperIcon,
  Stethoscope: Stethoscope,
  Camera: Camera,
  Microscope: Microscope,
  UserKey: UserKey,
};

export default function CardStat({
  stats,
  isLoading,
}: {
  stats: {
    id: string;
    title: string;
    value: number;
    icon: keyof typeof iconMap;
    iconColor: string;
    currency?: boolean;
  }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-row gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[140px] w-72 shrink-0 bg-white border rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cardValue: (card: { value: number; currency?: boolean }) => string = (
    card,
  ) => {
    if (card.currency) {
      return card.value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      });
    } else if (card.value > 999999) {
      return (card.value / 1000000).toFixed(1) + "M";
    } else if (card.value > 999) {
      return (card.value / 1000).toFixed(1) + "K";
    } else if (card.value < 0) {
      return "0";
    } else {
      return card.value.toString();
    }
  };

  return (
    // <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div className="-mx-6">
      <div className="flex gap-4 overflow-x-auto px-6 lg:px-8 pb-2 scrollbar-hide snap-x snap-mandatory scroll-smooth overscroll-x-contain">
        {stats.map((card) => {
          const Icon = iconMap[card.icon];

          return (
            <div
              key={card.id}
              className="snap-center relative border border-gray-200 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 w-72 h-36 shrink-0 overflow-hidden group hover:-translate-y-1"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <Icon
                className={`absolute -top-1 -right-1 w-32 h-32 opacity-5 ${card.iconColor} group-hover:opacity-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-lg  shadow-sm border border-gray-100`}
                  >
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {card.title}
                  </p>
                </div>
                <p className="text-4xl font-bold bg-linear-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {cardValue(card)}
                </p>
              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                style={{
                  background: `linear-gradient(to right, transparent, currentColor, transparent)`,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
