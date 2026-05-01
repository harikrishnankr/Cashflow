import { ChartNoAxesColumn, ShieldCheck, Zap } from "@/components/ui/icons";

const VALUE_PROPS = [
  {
    icon: Zap,
    title: "Log a transaction in 3 seconds",
    sub: "Fast entry from any screen. No dropdown hunting.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "See day, week, month, year",
    sub: "Switch periods in one click. Numbers stay where they are.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, locked to you",
    sub: "End-to-end encrypted. No ads, no selling.",
  },
];

export const ValueProps = () => {
  return (
    <div className="flex flex-col gap-5 mt-10">
      {VALUE_PROPS.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex gap-4 items-start">
          <div
            className="w-8.5 h-8.5 rounded-lg flex items-center justify-center flex-none"
            style={{
              background: "rgba(250,247,242,0.08)",
              color: "var(--orange)",
            }}
          >
            <Icon size={16} strokeWidth={1.75} />
          </div>
          <div>
            <div
              className="text-sm font-medium"
              style={{ color: "var(--paper)" }}
            >
              {title}
            </div>
            <div
              className="text-[0.8125rem] mt-0.5"
              style={{ color: "rgba(250,247,242,0.55)" }}
            >
              {sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
