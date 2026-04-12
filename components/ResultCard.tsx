import { InterpretationCard } from "@/lib/types";

interface ResultCardProps {
  card: InterpretationCard;
  index: number;
}

export default function ResultCard({ card, index }: ResultCardProps) {
  const delays = ["delay-0", "delay-100", "delay-200"];

  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-violet-100
        animate-fade-in-up ${delays[index] ?? ""}`}
    >
      <h3 className="text-lg font-bold mb-2">{card.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {card.description}
      </p>
    </div>
  );
}
