export const setUserInfo = data => {
    sessionStorage.setItem('userInfo', JSON.stringify(data));
}

export const getUserInfo = () => {
   const data = sessionStorage.getItem('userInfo');
   try {
       return JSON.parse(data)
   } catch (error) {
       return {};
   }
}


export const setToken = data => {
    sessionStorage.setItem('token', JSON.stringify(data));
}

export const getToken = () => {
   const data = sessionStorage.getItem('token');
   try {
       return JSON.parse(data)
   } catch (error) {
       return '';
   }
}
