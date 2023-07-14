import "./Settings.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { Context } from "../../context/Context";
import { useContext, useState } from "react";
import axios from "axios";

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { user, dispatch } = useContext(Context);
  const PF = "http://localhost:5000/images/";

  const handleUpdate = async (e) => {
    e.preventDefault();
    dispatch({ type: "UPDATE_START" });
    const updatedUser = {
      userId: user._id,
      email,
      password,
      username,
    };
    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      updatedUser.profilePic = filename;
      try {
        await axios.post("/upload/", data);
      } catch (err) {}
    }
    try {
      const res = await axios.put("/user/" + user._id, updatedUser);
      setSuccess(true);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
      dispatch({ type: "UPDATE_FAILURE" });
      console.log(err.response.data);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("/user/" + user._id, {
        data: { userId: user._id },
      });
      dispatch({ type: "LOGOUT" });

      window.location.replace("/");
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle" onClick={handleDelete}>
            Delete Your Account
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleUpdate}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={file ? URL.createObjectURL(file) : PF + user.profilePic}
              alt=""
            />
            <label htmlFor="fileInput">
              <i class="settingsPPIcon fa-regular fa-circle-user"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>

          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "10px" }}
            >
              Your Profile Has Been Updated
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}
