import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import "./Write.scss";
import axios from "axios";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useContext(Context);
  const [cats, setCats] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);

  useEffect(() => {
    const getCats = async () => {
      const res = await axios.get("/cat/");
      setCats(res.data);
    };
    getCats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      username: user.username,
      title,
      desc,
      categories: selectedCats,
    };

    if (file) {
      const data = new FormData();
      const filename = Date.now() + file.name;
      data.append("name", filename);
      data.append("file", file);
      newPost.photo = filename;
      try {
        await axios.post("/upload/", data);
      } catch (err) {}
    }
    try {
      const res = await axios.post("/post", newPost);
      window.location.replace("/post/" + res.data._id);
    } catch (err) {
      console.log(err.response.data);
    }
  };
  return (
    <div className="write">
      {file && (
        <img className="writeImg" src={URL.createObjectURL(file)} alt="" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fa-solid fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell Your Story ..."
            type="text"
            className="writeInput writeText"
            cols="30"
            rows="10"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <div className="writeFormGroup selectCats">
          <label for="cats">What's Category?</label>
          {cats.map((c) => (
            <>
              <input
                className="selectCat"
                type="checkbox"
                id={c.name}
                name="cats"
                value={c.name}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCats([...selectedCats, c.name]);
                  } else {
                    setSelectedCats(
                      selectedCats.filter((cat) => cat !== c.name)
                    );
                  }
                }}
              />
              <label for={c.name}>{c.name}</label>
            </>
          ))}
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
