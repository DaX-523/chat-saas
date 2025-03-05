import type { Label } from "@/lib/types"

interface LabelFilterProps {
  labels: Label[]
  selectedLabels: Label[]
  onSelectLabel: (label: Label) => void
  onClose: () => void
}

export default function LabelFilter({ labels, selectedLabels, onSelectLabel, onClose }: LabelFilterProps) {
  return (
    <section className="p-3 bg-white border-b border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-gray-700">Filter by labels</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close label filter">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <button
            key={label.id}
            onClick={() => onSelectLabel(label)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedLabels.some((l) => l.id === label.id) ? "opacity-100" : "opacity-70 hover:opacity-100"
            }`}
            style={{
              backgroundColor: `${label.color}20`,
              color: label.color,
              border: selectedLabels.some((l) => l.id === label.id)
                ? `1px solid ${label.color}`
                : "1px solid transparent",
            }}
            aria-pressed={selectedLabels.some((l) => l.id === label.id)}
          >
            {label.name}
          </button>
        ))}
      </div>
    </section>
  )
}

