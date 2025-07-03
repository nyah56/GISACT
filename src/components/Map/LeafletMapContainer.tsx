// LeafletMapContainer.tsx
import { LatLngExpression, MapOptions } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'

import { baseMaps } from '../Map/index'
import useMapContext from './useMapContext'

export const LeafletMapContainer: React.FC<
  {
    center: LatLngExpression
    zoom: number
    selectedBase: 'carto' | 'esri' | 'osm'
    children: JSX.Element | JSX.Element[]
  } & MapOptions
> = ({ selectedBase, ...options }) => {
  const { setMap } = useMapContext()

  return (
    <MapContainer
      ref={e => setMap && setMap(e || undefined)}
      className="absolute h-full w-full text-white outline-0"
      {...options}
    >
      <TileLayer attribution="&copy; OpenStreetMap, Esri, Carto" url={baseMaps[selectedBase].url} />
      {options.children}
    </MapContainer>
  )
}
