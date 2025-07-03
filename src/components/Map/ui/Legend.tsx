import MarkerCategories, { Category } from '#lib/MarkerCategories'

interface LegendPanelProps {
  selectedCategories: Category[]
  toggleCategory: (category: Category) => void
}

export const LegendPanel = ({ selectedCategories, toggleCategory }: LegendPanelProps) => {
  return (
    <div
      className="
        absolute bottom-6 right-2 z-[9999] 
        w-48 max-w-[90vw] rounded-xl 
        bg-white/90 p-3 shadow-xl backdrop-blur-md 
        sm:w-56 sm:p-4
      "
    >
      <h4 className="text-gray-700 mb-3 border-b pb-1 text-sm font-semibold sm:text-base">Legend</h4>
      <div className="flex flex-col gap-2">
        {Object.entries(MarkerCategories).map(([key, val]) => {
          if (val.hideInMenu) return null
          const isSelected = selectedCategories.includes(key as Category)

          return (
            <button
              key={key}
              onClick={() => toggleCategory(key as Category)}
              className={`flex items-center justify-start gap-2 rounded-lg px-2 py-1 text-xs transition-all sm:text-sm ${
                key === Category.USER
                  ? 'text-gray-900'
                  : isSelected
                  ? 'text-gray-900 bg-selectedBase/20 font-medium'
                  : 'text-gray-600 opacity-60'
              }`}
              title={val.name}
            >
              <val.icon size={16} className="text-gray-600" />
              <div
                className="h-3 w-3 rounded-full border border-white shadow"
                style={{ backgroundColor: val.color }}
              />
              <span className="truncate">{val.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
