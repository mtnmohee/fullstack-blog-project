import { Link, useLocation } from "react-router-dom";
import "./SinglePost.scss";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function SinglePost() {
  const location = useLocation();
  const { user } = useContext(Context);
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const PF = "http://localhost:5000/images/";
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const getPath = async () => {
      const res = await axios.get("/post/" + path);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    getPath();
  }, [path]);

  const handleDelete = async () => {
    try {
      await axios.delete("/post/" + path, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put("/post/" + path, {
        username: user.username,
        title,
        desc,
      });
      setUpdateMode(false);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={PF + post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon fa-regular fa-pen-to-square"
                  onClick={(e) => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon fa-solid fa-trash"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link className="link" to={`/?user=${post.username}`}>
              <b>{post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <textarea
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
    </div>
  );
}
