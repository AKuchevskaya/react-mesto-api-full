class Api {
  constructor({ baseUrl, headers }) {
    this._headers = headers;
    this._baseUrl = baseUrl;
  }

  _checkResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  getProfile(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
    }).then((res) => this._checkResponse(res));
  }

  editAvatar(avatar, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
      body: JSON.stringify({
        avatar,
      }),
    }).then((res) => this._checkResponse(res));
  }

  editProfile(name, about, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => this._checkResponse(res));
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
    }).then((res) => this._checkResponse(res));
  }

  addCard(name, link, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._checkResponse(res));
  }

  deleteCard(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
    }).then((res) => this._checkResponse(res));
  }

  deleteLike(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
    }).then((res) => this._checkResponse(res));
  }

  addLike(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials
    }).then((res) => this._checkResponse(res));
  }

  changeLikeCardStatus(id, isLiked, token) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: 'include', // т.к. разрешила в браузере запросы c Allow-Credentials

    }).then((res) => this._checkResponse(res));
  }
}

const api = new Api({
  baseUrl: "https://api.mesto.kuchevskaya.nomoredomains.xyz",
  //baseUrl: "https://mesto.nomoreparties.co/v1/cohort-39",
  // headers: {
  //   "Content-Type": "application/json",
  //   "Authorization": `Bearer ${token}`,
  // },
});

export default api;
