import { Sun, Cloud, CloudRain, Wind } from "lucide-react";
import { motion } from "framer-motion";

interface WeatherWidgetProps {
  temp: number;
  condition: "sunny" | "cloudy" | "rainy";
  recommendation: string;
}

const weatherConfig = {
  sunny: { icon: Sun, emoji: "☀️", bg: "bg-amber-50/80", text: "text-amber-700", border: "border-amber-100", accent: "text-amber-500" },
  cloudy: { icon: Cloud, emoji: "☁️", bg: "bg-slate-50/80", text: "text-slate-700", border: "border-slate-100", accent: "text-slate-400" },
  rainy: { icon: CloudRain, emoji: "🌧️", bg: "bg-blue-50/80", text: "text-blue-700", border: "border-blue-100", accent: "text-blue-500" },
};

const WeatherWidget = ({ temp, condition, recommendation }: WeatherWidgetProps) => {
  const w = weatherConfig[condition] || weatherConfig.sunny;
  const Icon = w.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${w.bg} backdrop-blur-sm border ${w.border} rounded-2xl p-3.5 flex items-center gap-4 shadow-sm`}
    >
      <div className={`w-12 h-12 rounded-xl bg-white/50 flex items-center justify-center shadow-inner`}>
        <Icon className={`w-7 h-7 ${w.accent} animate-pulse`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-black text-xl ${w.text}`}>{temp}°C</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-white/40 px-2 py-0.5 rounded-full border border-white/60">
            {condition === 'sunny' ? 'Ensoleillé' : condition === 'cloudy' ? 'Nuageux' : 'Pluvieux'}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground font-bold mt-1 line-clamp-1 italic">
          "{recommendation.replace("balade", "mission").replace("promenade", "mission")}"
        </p>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1">
        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
          <Wind className="w-3 h-3" />
          <span>12 km/h</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;
