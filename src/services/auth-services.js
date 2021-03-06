import ConnectyCube from 'react-native-connectycube';

export default class AuthService {
  init = (config = []) => {
    try {
      ConnectyCube.init(...config);
    } catch (error) {
      console.error(error);
    }
  };

  login = (user) => {
    return new Promise((resolve, reject) => {
      ConnectyCube.createSession(user)
        .then(() =>
          ConnectyCube.chat.connect({
            userId: user.id,
            password: user.password,
          }),
        )
        .then(resolve)
        .catch(reject);
    });
  };

  logout = () => {
    ConnectyCube.chat.disconnect();
    ConnectyCube.destroySession();
  };
}
