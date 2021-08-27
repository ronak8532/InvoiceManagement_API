const axios = require('axios');

/*exports.facebook = async (accessToken) => {
    const fields = 'id, name, email, picture';
    const url = 'https://graph.facebook.com/me';
    const params = { accessToken, fields };
    const response = await axios.get(url, { params });
    const {
        id, name, email, picture,
    } = response.data;
    return {
        service: 'facebook',
        picture: picture.data.url,
        id,
        name,
        email,
    };
};*/
