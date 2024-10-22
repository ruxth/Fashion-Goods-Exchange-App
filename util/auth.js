import axios from "axios";
import auth from "@react-native-firebase/auth";

const API_KEY = "AIzaSyDrJEZB_-ed8ikv35XMAr1ayy2Xtqcz--0";

async function authenticate(mode, email, password, username) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const response = await axios.post(url, {
    email: email,
    password: password,
    returnSecureToken: true,
  });

  const uid = response.data.localId;

  axios.post(
    `https://final-year-project-a6ba8-default-rtdb.asia-southeast1.firebasedatabase.app/:users/.json`,
    { id: uid, email: email, username: username }
  );

  console.log(uid);

  const token = response.data.idToken;

  return { token, uid };
}

//SENDING POST REQUEST TO FIREBASE
export function createUser(email, password, username) {
  return authenticate("signUp", email, password, username);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}
