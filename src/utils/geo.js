import gcoord from 'gcoord';

const EARTH_RADIUS = 6371;
const angle2Radian = (angle) => angle * Math.PI / 180;

export const calculateDistance = (coordinate1, coordinate2) => {
  const dLat = angle2Radian(coordinate2[1] - coordinate1[1]);
  const dLon = angle2Radian(coordinate2[0] - coordinate1[0]);
  const lat1 = angle2Radian(coordinate1[1]);
  const lat2 = angle2Radian(coordinate2[1]);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c * 1000;
};

const transformPolygonGeo = (coordinates, sourceType, targetType) => {
  const result = [];
  const ii = coordinates.length;
  for (let i = 0; i < ii; i++) {
    const jj = coordinates[i].length;
    result.push([]);
    for (let j = 0; j < jj; j++) {
      result[i].push(gcoord.transform(coordinates[i][j], sourceType, targetType));
    }
  }
  return result;
};

const transformGeoJSON = (geo, sourceType, targetType) => {
  if (!geo || typeof geo.type !== 'string') {
    return null;
  }
  if (geo.type === 'Point') {
    return {
      ...geo,
      coordinate: gcoord.transform(geo.coordinate, sourceType, targetType),
    };
  }
  if (geo.type === 'Circle') {
    return {
      ...geo,
      center: gcoord.transform(geo.center, sourceType, targetType),
    };
  }

  if (geo.type === 'LineString') {
    const coordinates = [];
    const len = geo.coordinates.length;
    for (let i = 0; i < len; i++) {
      const coordinate = geo.coordinates[i];
      coordinates.push(gcoord.transform(coordinate, sourceType, targetType));
    }
    return {
      ...geo,
      coordinates,
    };
  }

  if (geo.type === 'Polygon') {
    return {
      ...geo,
      coordinates: transformPolygonGeo(geo.coordinates, sourceType, targetType),
    };
  }

  if (geo.type === 'MultiPolygon') {
    return {
      ...geo,
      coordinates: geo
        .coordinates
        .map((coordinates) => transformPolygonGeo(coordinates, sourceType, targetType)),
    };
  }

  return null;
};

export const GCJ02ToWGS84GeoJSON = (geo) => transformGeoJSON(geo, gcoord.GCJ02, gcoord.WGS84);

export const WGS84ToGCJ02GeoJSON = (geo) => transformGeoJSON(geo, gcoord.WGS84, gcoord.GCJ02);

export const calculatePolygonBounds = (coordinates) => {
  const ii = coordinates.length;
  if (ii === 0) {
    return [[0, 0], [0, 0]];
  }
  let minLat = 180;
  let minLng = 180;
  let maxLat = -180;
  let maxLng = -180;
  for (let i = 0; i < ii; i++) {
    const jj = coordinates[i].length;
    for (let j = 0; j < jj; j++) {
      const [lng, lat] = coordinates[i][j];
      if (lng < minLng) {
        minLng = lng;
      }
      if (lat < minLat) {
        minLat = lat;
      }
      if (lng > maxLng) {
        maxLng = lng;
      }
      if (lat > maxLat) {
        maxLat = lat;
      }
    }
  }

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
};

export const isSameCooridnate = (coordinate1, coordinate2) => {
  const lng1 = parseInt(coordinate1[0] * 100000, 10);
  const lat1 = parseInt(coordinate1[1] * 100000, 10);
  const lng2 = parseInt(coordinate2[0] * 100000, 10);
  const lat2 = parseInt(coordinate2[1] * 100000, 10);
  return lng1 === lng2 && lat1 === lat2;
};

export const pointInPolygon = (point, vs) => {
  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0];
    const yi = vs[i][1];
    const xj = vs[j][0];
    const yj = vs[j][1];

    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
};

export const pointInCircle = (point, { center, radius }) => {
  const distance = calculateDistance(point, center);
  return distance <= radius;
};

export const calculateBoundsCenter = ([[lng1, lat1], [lng2, lat2]]) => [lng1 + (lng2 - lng1) / 2, lat1 + (lat2 - lat1) / 2];

export const calculateBoundsZoomCenter = (bounds, width, height) => {
  const diffX = bounds[1][0] - bounds[0][0];
  const diffY = bounds[1][1] - bounds[0][1];

  const s = 1 / Math.max(
    diffX * Math.PI / 180 / width,
    diffY * Math.PI / 180 / height,
  );
  return {
    center: calculateBoundsCenter(bounds),
    zoom: Math.max(10, Math.min(Math.floor(Math.log(s / 40.5) / Math.LN2), 18)),
  };
};

export const calculateGeoZoomCenter = (data, width, height) => {
  if (data.type === 'Circle') {
    const diffX = (180 / Math.PI) * (data.radius / 6378137);
    const diffY = (180 / Math.PI) * (data.radius / 6378137) / Math.cos(Math.PI / 180 * data.center[1]); // eslint-disable-line
    const s = 1 / Math.max(
      (diffX * 2) * Math.PI / 180 / (width),
      (diffY * 2) * Math.PI / 180 / (height),
    );
    return {
      center: data.center,
      zoom: Math.max(10, Math.min(Math.floor(Math.log(s / 40.5) / Math.LN2), 20)),
    };
  }
  if (data.type === 'Polygon') {
    const bounds = calculatePolygonBounds(data.coordinates);
    return calculateBoundsZoomCenter(bounds, width, height);
  }

  if (data.type === 'MultiPolygon') {
    const bounds = calculatePolygonBounds(data.coordinates.reduce((acc, cur) => [...acc, ...cur], data.coordinates));
    return calculateBoundsZoomCenter(bounds, width, height);
  }

  if (data.type === 'LineString' || data.type === 'MultiPoint') {
    const len = data.coordinates.length;
    if (len === 0) {
      return null;
    }
    if (len === 1) {
      if (data.type === 'MultiPoint') {
        return {
          center: data.coordinates[0],
          zoom: 16,
        };
      }
      return null;
    }
    let minLat = 180;
    let minLng = 180;
    let maxLat = -180;
    let maxLng = -180;
    for (let i = 0; i < len; i++) {
      const [lng, lat] = data.coordinates[i];
      if (lng < minLng) {
        minLng = lng;
      }
      if (lat < minLat) {
        minLat = lat;
      }
      if (lng > maxLng) {
        maxLng = lng;
      }
      if (lat > maxLat) {
        maxLat = lat;
      }
    }
    return calculateBoundsZoomCenter([
      [minLng, minLat],
      [maxLng, maxLat],
    ], width, height);
  }

  return null;
};
