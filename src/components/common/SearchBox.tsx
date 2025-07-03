import { useState } from 'react'

export const SearchBox = ({ onResult }: { onResult: (lat: number, lon: number) => void }) => {
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    if (!query) return

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
    )
    const data = await res.json()

    if (data.length > 0) {
      const { lat, lon } = data[0]
      onResult(parseFloat(lat), parseFloat(lon))
    } else {
      alert('Address not found')
    }
  }

  return (
    <div className="flex max-w-full flex-wrap items-center gap-2 rounded-xl bg-white/90 p-2 shadow-xl backdrop-blur-md sm:flex-nowrap">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search address or place..."
        className="border-gray-300 text-gray-800 w-full flex-1 rounded-md border px-3 py-2 text-sm shadow-sm focus:border-selectedBase focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="rounded-md bg-selectedBase px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-selectedBase/90"
      >
        Search
      </button>
    </div>
  )
}
