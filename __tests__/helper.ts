// import axios from "axios"
import config from "config"
import axios from "axios"

export const fetchAccessToken = async () => {
  const response = await axios.post(config.get('auth.tokenUrl'), {
    grant_type: 'password',
    username: config.get('auth.testUser.username'),
    password: config.get('auth.testUser.password'),
    audience: config.get('auth.audience'),
    scope: 'read write',
    client_id: config.get('auth.clientId'),
    client_secret: config.get('auth.clientSecret'),
  }, {
    headers: {
      "Accept-Encoding": "gzip,deflate,compress", 
    }
  },);

  return response.data.access_token;
}
