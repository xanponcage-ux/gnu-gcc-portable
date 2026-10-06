import axios from "axios";
import serverDetails from "./variables/serverDetails";
import moment from "moment";

const HttpClient = axios.create({
  baseURL: serverDetails.baseURL,
});

HttpClient.interceptors.response.use(
  (response) => {
    const lastActive = moment().unix();
    localStorage.setItem("lastActiveTime", lastActive);
    return response;
  },
  (error) => {
    return Promise.resolve({ error });
  }
);

export default HttpClient;
