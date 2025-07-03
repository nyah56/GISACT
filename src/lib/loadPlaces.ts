import { LatLngExpression } from 'leaflet'

import { Category } from './MarkerCategories'
import type { PlacesType, PlaceValues } from './Places'

function geoJsonToPlaceValues(feature: any): PlaceValues {
  const coords = feature.geometry.coordinates

  const polygon = coords.map((poly: any[][]) => poly[0].map(([lng, lat]: number[]) => [lat, lng]))

  const center = polygon[0][Math.floor(polygon[0].length / 2)]

  const rtRaw = feature.properties.RTNew?.trim() ?? Category.CAT1
  const category = rtRaw as Category // casting RT "RT 1" to enum

  return {
    id: feature.properties.Id,
    title: rtRaw,
    address: feature.properties.RTNew,
    category,
    position: center,
    polygon,
    plastik: feature.properties['Sampah Plastik (kg)'],
    organik: feature.properties['Sampah Organik (kg)'],
    anorganik: feature.properties['sampah Anorganik (kg)'],
  }
}

export async function loadPlaces(): Promise<PlacesType> {
  const res = await fetch('/data/data.geojson')
  const geojson = await res.json()
  return geojson.features.map(geoJsonToPlaceValues)
}
