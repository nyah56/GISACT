interface BaseMapOption {
  name: string
  url: string
  preview: string
}

interface BaseMapSelectorProps {
  baseMaps: Record<string, BaseMapOption>
  selectedBase: string
  setSelectedBase: (base: 'carto' | 'esri' | 'osm') => void
}

export const BaseMapSelector = ({ baseMaps, selectedBase, setSelectedBase }: BaseMapSelectorProps) => {
  return (
    <div
      className="
        absolute bottom-2 left-2 z-[9999]
        flex max-w-[90vw] flex-wrap
        gap-2 rounded bg-white/80 p-2
        shadow sm:max-w-none
      "
    >
      {Object.entries(baseMaps).map(([key, map]) => (
        <button
          key={key}
          onClick={() => setSelectedBase(key as 'carto' | 'esri' | 'osm')}
          className={`
            h-12 w-12 overflow-hidden rounded
            border-2 sm:h-16 sm:w-16 sm:border-4
            ${selectedBase === key ? 'border-selectedBase' : 'border-transparent'}
          `}
          title={map.name}
        >
          <img src={map.preview} alt={map.name} className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  )
}
