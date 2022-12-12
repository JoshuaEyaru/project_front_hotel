import axios from "axios";

class FavoriteDataService {
    updateFavoriteList(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/favorites`, data);
    }

    getAll(userId){
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/favorites/${userId}`);
    }
}

export default new FavoriteDataService();