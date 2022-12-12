import axios from "axios";

class HotelDataService {

    getAll(page = 0) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels?page=${page}`);
    }

    find(query, by="title", page=0) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels?${by}=${query}&page=${page}`
        );
    }

    getRatings() {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/ratings`);
    }

    get(id) {
        return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/id/${id}`);
    }

    getByIdList(idList){
        let listString = JSON.stringify(idList);
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/idList/${listString}`
        return axios.get(url);
    }

    createReview(data){
        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/review`, data);
    }    

    updateReview(data) {
        return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/review`, data);
    }

    deleteReview(data) {
        return axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/hotels/review`, { data } );
    }
}


export default new HotelDataService();