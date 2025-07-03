import type { LatLngExpression } from 'leaflet'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import { Polygon } from 'react-leaflet'

import { AppConfig } from '#lib/AppConfig'
import MarkerCategories from '#lib/MarkerCategories'
import { PlaceValues } from '#lib/Places'

import useMapContext from '../useMapContext'

const LeafletPopup = dynamic(() => import('../LeafletPopup'))

export interface CustomPolygonProps {
  place: PlaceValues
}

export const CustomPolygon = ({ place }: CustomPolygonProps) => {
  const { map } = useMapContext()
  const markerCategory = useMemo(() => MarkerCategories[place.category], [place.category])

  const handlePolygonClick = useCallback(() => {
    if (!map) return
    const clampZoom = map.getZoom() < 14 ? 14 : undefined
    map.setView(place.position, clampZoom)
  }, [map, place.position])

  if (!place.polygon) return null

  // Ensure we're always working with an array of rings
  const polygonArray = Array.isArray(place.polygon[0])
    ? (place.polygon as LatLngExpression[][])
    : [place.polygon as LatLngExpression[]]

  return (
    <>
      {polygonArray.map((poly, index) => (
        <Polygon
          key={index}
          positions={poly}
          pathOptions={{
            color: markerCategory.color,
            weight: 2,
            fillOpacity: 0.4,
          }}
          eventHandlers={{ click: handlePolygonClick }}
        >
          <LeafletPopup
            autoPan={false}
            autoClose
            closeButton={false}
            item={place}
            color={markerCategory.color}
            icon={markerCategory.icon}
            handleOpenLocation={() => {}}
            handlePopupClose={() => map?.closePopup()}
          />
        </Polygon>
      ))}
    </>
  )
}
