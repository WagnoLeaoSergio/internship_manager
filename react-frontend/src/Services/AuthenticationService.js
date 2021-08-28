import axios from "axios";

const HTTP_CONFLICT = 409;

class AuthenticationService {
  interceptorId = 0;
  baseUrl = "http://localhost:8080/api";

  constructor() {
    if (this.isUserLoggedIn()) {
      const user = this.getCurrentUser().email;
      const pass = this.getCurrentUser().password;
      this.setupAxiosInterceptors(user, pass);
    }
  }

  async authenticate(values) {
    this.logout();
    return axios({
      method: "GET",
      url: this.baseUrl + "/auth/user",
      headers: {
        authorization: "Basic " + btoa(values.email + ":" + values.password),
      },
    }).then((response) => {
      let user = response.data;
      user.password = values.password;
      this.setupAxiosInterceptors(values.email, values.password);
      this.saveValueToSession("authenticatedUser", JSON.stringify(user));
    });
  }

  async registerUser(endpoint, values, setFieldError, setModalOpen, history) {
    let dto = { ...values };
    delete dto.passwordConfirm;
    return axios
      .post(this.baseUrl + endpoint, dto)
      .then(() => {
        history.push("/", { email: dto.email });
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === HTTP_CONFLICT)
            setFieldError(
              "email",
              "Este endereço de e-mail já está sendo usado"
            );
          else setModalOpen();
        } else {
          console.error(error);
          setModalOpen();
        }
      });
  }

  setupAxiosInterceptors(email, password) {
    let basicAuthHeader = "Basic " + btoa(email + ":" + password);
    this.interceptorId = axios.interceptors.request.use((config) => {
      config.headers.authorization = basicAuthHeader;
      return config;
    });
  }

  isUserLoggedIn() {
    return sessionStorage.getItem("authenticatedUser") != null;
  }

  getCurrentUser() {
    return JSON.parse(sessionStorage.getItem("authenticatedUser"));
  }

  getCurrentUserRole() {
    return this.getCurrentUser().role;
  }

  getValueFromSession(key) {
    return sessionStorage.getItem(key);
  }

  logout() {
    sessionStorage.removeItem("authenticatedUser");
    axios.interceptors.request.eject(this.interceptorId);
  }

  saveValueToSession(key, value) {
    sessionStorage.setItem(key, value);
  }
}

export default new AuthenticationService();
