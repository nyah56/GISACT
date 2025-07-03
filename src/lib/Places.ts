import { LatLngExpression } from 'leaflet'

import { Category } from './MarkerCategories'

export interface PlaceValues {
  id: number
  position: LatLngExpression
  category: Category
  title: string
  address: string
  polygon?: LatLngExpression[][] | LatLngExpression[]
  plastik?: number
  organik?: number
  anorganik?: number
}
export type PlacesType = PlaceValues[]
export type PlacesClusterType = Record<string, PlaceValues[]>
const data = [
  {
    type: 'Feature',
    properties: {
      Id: 1,
      Shape_Leng: 0.00040886593,
      Shape_Area: 112.835642302,
      Estimasi: 25,
      RTNew: 'RT 1',
      'Sampah Plastik (kg)': 25,
      'Sampah Organik (kg)': 5,
      'sampah Anorganik (kg)': 3,
    },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [107.589654210027689, -6.979202068280591],
            [107.589626836359002, -6.979273302031973],
            [107.589596040981917, -6.979262103712933],
            [107.589561512831622, -6.979258059875574],
            [107.58953040638994, -6.979247172621003],
            [107.589548137061783, -6.979192114219237],
            [107.589528228939002, -6.979185581866545],
            [107.589541604708984, -6.97915696394023],
            [107.589589197564692, -6.979170961838856],
            [107.589654210027689, -6.979202068280591],
          ],
        ],
      ],
    },
  },
]
function geoJsonToPlaceValues(feature: any): PlaceValues {
  const coords = feature.geometry.coordinates // GeoJSON MultiPolygon

  // Flip all [lng, lat] to [lat, lng] across all polygons
  const polygon = coords.map((poly: any[][]) => poly[0].map(([lng, lat]: number[]) => [lat, lng]))

  // Pick a crude center (midpoint of first polygon ring)
  const center = polygon[0][Math.floor(polygon[0].length / 2)]

  return {
    id: feature.properties.Id,
    title: feature.properties.RTNew,
    address: '',
    category: Category.CAT1,
    position: center,
    polygon: polygon, // now LatLngExpression[][]
  }
}
export async function loadPlaces(): Promise<PlacesType> {
  const res = await fetch('../dummy-data-for-test.geojson')
  const geojson = await res.json()
  console.log(geojson)
  return geojson.features.map(geoJsonToPlaceValues)
}

export const Places: PlacesType = [
  // {
  //   id: 1,
  //   position: [-6.979202068280591, 107.589654210027689],
  //   category: Category.CAT1,
  //   title: 'Some Title 1',
  //   address: 'Another Adress 123, Test City',
  // },
  ...data.map(geoJsonToPlaceValues),
  // {
  //   id: 2,
  //   position: [52.02022592597971, 8.530780645829076],
  //   category: Category.CAT1,
  //   title: 'Some Title 2',
  //   address: 'Some Adress 56, Test City',
  // },
  // {
  //   id: 3,
  //   position: [52.022468698328275, 8.50583167463131],
  //   category: Category.CAT1,
  //   title: 'Some Title 3',
  //   address: 'Another Adress 789, Test City',
  // },
  // {
  //   id: 4,
  //   position: [51.99739839338658, 8.59544834428681],
  //   category: Category.CAT1,
  //   title: 'Some Title 4',
  //   address: 'Another Adress 101112, Test City',
  // },
  // {
  //   id: 5,
  //   position: [52.01219274931668, 8.599568218099812],
  //   category: Category.CAT2,
  //   title: 'Some Title 5',
  //   address: 'Another Adress 131415, Test City',
  // },
  // {
  //   id: 6,
  //   position: [52.0119, 8.563032],
  //   category: Category.CAT2,
  //   title: 'Some Title 6',
  //   address: 'Another Adress 161718, Test City',
  // },
  // {
  //   id: 7,
  //   position: [52.02022192326546, 8.583775371420124],
  //   category: Category.CAT2,
  //   title: 'Some Title 7',
  //   address: 'Another Adress 192021, Test City',
  // },
  // {
  //   id: 8,
  //   position: [51.99494772863581, 8.560429425686753],
  //   category: Category.CAT2,
  //   title: 'Some Title 8',
  //   address: 'Another Adress 222324, Test City',
  // },
  // {
  //   id: 9,
  //   position: [51.99274772863586, 8.560429425686753],
  //   category: Category.CAT2,
  //   title: 'Some Title 9',
  //   address: 'Another Adress 252627, Test City',
  // },
]
