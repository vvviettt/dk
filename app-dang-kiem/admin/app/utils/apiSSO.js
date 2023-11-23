const axios = require('axios');
require('dotenv/config');

async function getAllData(SSO_token) {
  var config = {
    method: 'get',
    url: 'https://vitraco-sso-dev.greenglobal.com.vn/api/user',
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}
async function accountDetail(SSO_token, id) {
  var config = {
    method: 'get',
    url: `https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users/${id}`,
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}
async function postUserData(SSO_token, userName, password) {
  var data = JSON.stringify({
    userName: `${userName}`,
    roleNames: ['admin'],
    password: `${password}`,
  });
  var config = {
    method: 'post',
    url: 'https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users',
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response;
  try {
    response = await axios(config);
    console.log('response: ', response);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}

async function postUserData(SSO_token, userName, password, phone, email) {
  var data = JSON.stringify({
    userName: `${userName}`,
    email: `${email}`,
    phoneNumber: `${phone}`,
    lockoutEnabled: false,
    roleNames: ['admin'],
    password: `${password}`,
  });
  var config = {
    method: 'post',
    url: 'https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users',
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response;
  try {
    response = await axios(config);
    console.log('response: ', response);
  } catch (e) {
    console.log(e);
  }
  return response?.data ? response?.data : null;
}
async function loginUser(userName, password) {
  var data = JSON.stringify({
    userNameOrEmailAddress: `${userName}`,
    password: `${password}`,
    rememberMe: true,
  });
  var config = {
    method: 'post',
    url: 'https://vitraco-sso-dev.greenglobal.com.vn/api/account/login',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}

async function updateWithPasswordUser(
  SSO_token,
  id,
  userName,
  phone,
  email,
  password,
  concurrencyStamp
) {
  var data = JSON.stringify({
    userName: `${userName}`,
    email: `${email}`,
    phoneNumber: `${phone}`,
    password: `${password}`,
    concurrencyStamp: `${concurrencyStamp}`,
  });
  var config = {
    method: 'put',
    url: `https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users/${id}`,
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}
async function updateNoPasswordUser(SSO_token, id, userName, phone, email, concurrencyStamp) {
  var data = JSON.stringify({
    userName: `${userName}`,
    email: `${email}`,
    phoneNumber: `${phone}`,
    concurrencyStamp: `${concurrencyStamp}`,
  });
  var config = {
    method: 'put',
    url: `https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users/${id}`,
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}
async function deleteUser(SSO_token, id) {
  var config = {
    method: 'delete',
    url: `https://vitraco-sso-dev.greenglobal.com.vn/api/identity/users/${id}`,
    headers: {
      Authorization: `Bearer ${SSO_token}`,
      'Content-Type': 'application/json',
    },
  };
  let response;
  try {
    response = await axios(config);
  } catch (e) {
    throw new Error(e.message);
  }
  return response?.data ? response?.data : null;
}

module.exports = {
  getAllData,
  accountDetail,
  postUserData,
  loginUser,
  updateWithPasswordUser,
  updateNoPasswordUser,
  deleteUser,
};
