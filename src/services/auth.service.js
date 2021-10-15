const user = {
  data: {"user_id":99,"username":"J.Leal","password":"$2a$10$uTzExflNiZ7ByHf/zi","favouriteColour":"green","roles":["ADMIN"],"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.Q_9HfNvo"}
}

class AuthService {
  login() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user);
      }, 300);
    })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user);
      }, 300);
    }).then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return response.data;
    });
  }
}

export default new AuthService();