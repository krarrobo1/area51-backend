import axios from 'axios';
import { google_key } from '../config/config';



export async function getAddress(lat, lgn) {
    const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lgn}&key=${google_key}`;
    try {
        let response = await axios.get(endpoint, { Accept: 'application/json', 'Content-Type': 'application/json' });
        let results = response.data.results;
        return results[0].formatted_address;
    } catch (err) {
        return err;
    }
}