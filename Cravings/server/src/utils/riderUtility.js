import axios from "axios";

export const calculateDistance = async (orders, lat, lon) => {
  try {
    const ordersWithDistance = await Promise.all(
      orders.map(async (order) => {
        const restaurantLat = order.restaurantId.geoLocation.lat;
        const restaurantLon = order.restaurantId.geoLocation.lon;

        const distance = await getDistanceFromLatLonInKm(
          lat,
          lon,
          restaurantLat,
          restaurantLon,
        );

        return {
          ...order._doc,
          distanceFromRider: distance,
        };
      }),
    );

    ordersWithDistance.sort((a, b) => a.distanceFromRider - b.distanceFromRider);
    return ordersWithDistance;
  } catch (error) {
    throw error;
  }
};

const getDistanceFromLatLonInKm = async (lat1, lon1, lat2, lon2) => {
  try {
    const DistanceMatrixAPIKey = process.env.DISTANCE_MATRIX_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${lat1},${lon1}&destinations=${lat2},${lon2}&mode=driving&key=${DistanceMatrixAPIKey}`;
    const res = await axios.get(url);
    return res.data.rows[0].elements[0].distance.value / 1000;
  } catch (error) {
    throw error;
  }
};
