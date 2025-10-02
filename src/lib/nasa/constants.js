// Curated NASA GIBS layers (EPSG:3857 WMTS)
// Docs: https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetCapabilities
export const GIBS_LAYERS = {
  TRUE_COLOR: {
    id: 'MODIS_Terra_CorrectedReflectance_TrueColor',
    daily: false, // best is mostly static composite
  },
  FIRES_NIGHT: {
    id: 'VIIRS_SNPP_Thermal_Anomalies_375m_Night',
    daily: true,
  },
  AEROSOL_OPTICAL_DEPTH: {
    id: 'MODIS_Terra_Aerosol',
    daily: true,
  }
}

export function gibsTileUrl(layerId, dateISO) {
  // For daily layers, date matters; otherwise use 'latest' default by setting default/date
  const datePart = dateISO || new Date().toISOString().slice(0,10)
  // GoogleMapsCompatible tile matrix for EPSG:3857 in GIBS
  return `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${datePart}/GoogleMapsCompatible_Level{z}/{y}/{x}.png`
}