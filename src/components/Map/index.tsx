import Leaflet from 'leaflet'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import MapTopBar from '#components/TopBar'
import { AppConfig } from '#lib/AppConfig'
import { loadPlaces } from '#lib/loadPlaces'
import MarkerCategories, { Category } from '#lib/MarkerCategories'
import { Places, PlacesType, type PlaceValues } from '#lib/Places'

// import { SearchBox } from '../common/SearchBox'
import LeafleftMapContextProvider from './LeafletMapContextProvider'
import useMapContext from './useMapContext'
import useMarkerData from './useMarkerData'

// const LeafletCluster = dynamic(async () => (await import('./LeafletCluster')).LeafletCluster(), {
//   ssr: false,
// })
const CenterToMarkerButton = dynamic(async () => (await import('./ui/CenterButton')).CenterButton, {
  ssr: false,
})
const CustomPolygon = dynamic(async () => (await import('./LeafletPolygon')).CustomPolygon)

const LocateButton = dynamic(async () => (await import('./ui/LocateButton')).LocateButton, {
  ssr: false,
})
const LeafletMapContainer = dynamic(async () => (await import('./LeafletMapContainer')).LeafletMapContainer, {
  ssr: false,
})
const LegendPanel = dynamic(async () => (await import('./ui/Legend')).LegendPanel, {
  ssr: false,
})
const Basemap = dynamic(async () => (await import('./ui/Basemap')).BaseMapSelector, {
  ssr: false,
})

const SearchBox = dynamic(async () => (await import('../common/SearchBox')).SearchBox, { ssr: false })
export const baseMaps = {
  carto: {
    name: 'CARTO Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    preview: '/tiles/carto.png', // thumbnail image preview
  },
  esri: {
    name: 'ESRI Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    preview: '/tiles/esri.png', // thumbnail image preview
  },
  stadia: {
    name: 'Stadia Alidade Light',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    preview: '/tiles/stadia.png',
  },
}
export interface ViewState {
  minLat: number
  minLng: number
  maxLat: number
  maxLng: number
  zoomLevel: number
}

const getViewState: (map?: Leaflet.Map) => ViewState | undefined = (map?: Leaflet.Map) => {
  if (!map) return undefined

  const bounds = map.getBounds()
  const zoomLevel = map.getZoom()

  return {
    minLat: bounds.getSouthWest().lat,
    minLng: bounds.getSouthWest().lng,
    maxLat: bounds.getNorthEast().lat,
    maxLng: bounds.getNorthEast().lng,
    zoomLevel,
  }
}

const LeafletMapInner = () => {
  const [places, setPlaces] = useState<PlaceValues[]>([])

  useEffect(() => {
    loadPlaces().then(setPlaces)
  }, [])

  useEffect(() => {
    if (places.length) {
      console.log('Loaded places:', places)
    }
  }, [places])

  const { map } = useMapContext()

  // we can use this to modify our query for locations
  const [viewState, setViewState] = useState(getViewState(map))

  const {
    width: viewportWidth,
    height: viewportHeight,
    ref: viewportRef,
  } = useResizeDetector({
    refreshMode: 'debounce',
    refreshRate: 200,
  })

  // you will need some kind middleware which process markers within the bounding box in viewState
  const markerQueryResponse = Places as PlacesType | undefined

  useEffect(() => {
    if (!map) return undefined

    // you should debounce that by only changing when the map stops moving
    map?.on('moveend', () => {
      setViewState(getViewState(map))
    })

    // cleanup
    return () => {
      map.off()
    }
  }, [map])

  const { clustersByCategory, allMarkersBoundCenter } = useMarkerData({
    locations: markerQueryResponse,
    map,
    viewportWidth,
    viewportHeight,
  })

  const isLoading = !map || !viewportWidth || !viewportHeight
  const isInBounds = (place: PlaceValues, bounds: L.LatLngBounds): boolean => {
    return bounds.contains(place.position as L.LatLng)
  }
  const [visiblePlaces, setVisiblePlaces] = useState<PlaceValues[]>([])
  const [selectedBase, setSelectedBase] = useState<'carto' | 'esri' | 'osm'>('carto')

  const ALL_CATEGORIES = Object.values(Category)
  const DEFAULT_CATEGORIES = ALL_CATEGORIES
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  const toggleCategory = (category: Category) => {
    if (category === Category.USER) return

    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category],
    )
  }

  useEffect(() => {
    if (!map || !places.length || !allMarkersBoundCenter) return

    const updateVisible = () => {
      const bounds = map.getBounds()
      const filtered = places.filter(
        place => isInBounds(place, bounds) && selectedCategories.includes(place.category),
      )
      setVisiblePlaces(filtered)
    }

    // Optional: fly to initial center and zoom
    map.flyTo(allMarkersBoundCenter.centerPos, allMarkersBoundCenter.minZoom, { animate: false })

    // Initial render
    updateVisible()

    const handler = () => {
      cancelAnimationFrame((map as any)._moveRaf)
      ;(map as any)._moveRaf = requestAnimationFrame(() => {
        setTimeout(updateVisible, 100)
      })
    }

    map.on('moveend', handler)

    return () => {
      map.off('moveend', handler)
    }
  }, [map, places, allMarkersBoundCenter])

  return (
    <div className="absolute h-full w-full overflow-hidden" ref={viewportRef}>
      <MapTopBar />
      <div
        className={`absolute left-0 w-full transition-opacity ${isLoading ? 'opacity-0' : 'opacity-1 '}`}
        style={{
          top: AppConfig.ui.topBarHeight,
          width: viewportWidth ?? '100%',
          height: viewportHeight ? viewportHeight - AppConfig.ui.topBarHeight : '100%',
        }}
      >
        {allMarkersBoundCenter && clustersByCategory && (
          <LeafletMapContainer
            center={allMarkersBoundCenter.centerPos}
            zoom={allMarkersBoundCenter.minZoom}
            maxZoom={AppConfig.maxZoom}
            minZoom={AppConfig.minZoom}
            selectedBase={selectedBase}
          >
            {!isLoading ? (
              <>
                <div className="absolute right-2 top-2 z-[9999] flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                  <div className="w-[90vw] max-w-xs sm:w-auto">
                    <SearchBox
                      onResult={(lat: number, lon: number) => {
                        if (map) {
                          map.flyTo([lat, lon], 18) // zoom into the result
                        }
                      }}
                    />
                  </div>

                  <CenterToMarkerButton
                    center={allMarkersBoundCenter.centerPos}
                    zoom={allMarkersBoundCenter.minZoom}
                  />
                  <LocateButton />
                </div>

                {/* {places.map(place =>
                  place.polygon ? <CustomPolygon key={`poly-${place.id}`} place={place} /> : null,
                )} */}

                {visiblePlaces
                  .filter(place => selectedCategories.includes(place.category))
                  .map(place =>
                    place.polygon ? <CustomPolygon key={`poly-${place.id}`} place={place} /> : null,
                  )}

                {/* {visiblePlaces.map(place => (
                  <CustomMarker key={`marker-${place.id}`} place={place} />
                ))} */}
              </>
            ) : (
              // we have to spawn at least one element to keep it happy
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
          </LeafletMapContainer>
        )}
        {/* basemap */}
        <Basemap baseMaps={baseMaps} selectedBase={selectedBase} setSelectedBase={setSelectedBase} />
        {/* legend */}
        <LegendPanel selectedCategories={selectedCategories} toggleCategory={toggleCategory} />
      </div>
    </div>
  )
}

// pass through to get context in <MapInner>
const Map = () => (
  <LeafleftMapContextProvider>
    <LeafletMapInner />
  </LeafleftMapContextProvider>
)

export default Map
