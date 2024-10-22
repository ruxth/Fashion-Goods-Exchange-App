import axios from "axios";

const BACKEND_URL =
  "https://final-year-project-a6ba8-default-rtdb.asia-southeast1.firebasedatabase.app";

export async function fetchUser(uid) {
  // try {
  const response = await axios.get(BACKEND_URL + `/:users/.json`);

  //     if (response.data.uid)
  // }

  console.log(uid);
  if (response.data === null) {
    // User data not found, handle accordingly (return null or throw an error)
    console.error("User data not found for UID:");
    return null;
  }

  const users = [];

  for (const username in response.data) {
    const userObj = {
      id: username,
      email: response.data[username].email,
    };
    users.push(userObj);
  }

  console.log(users);

  return users;
}
