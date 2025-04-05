import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import AllPostsPage from "./components/AllPostsPage";
import SinglePostPage from "./components/SinglePostPage";
import AllUsersPage from "./components/AllUsersPage";
import SingleUserPage from "./components/SingleUserPage";
import AllCommentsPage from "./components/AllCommentsPage";
import SingleCommentPage from "./components/SingleCommentPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<AllPostsPage />} />
      <Route path="/post/:id" element={<SinglePostPage />} />
      <Route path="/users" element={<AllUsersPage />} />
      <Route path="/user/:id" element={<SingleUserPage />} />
      <Route path="/comments" element={<AllCommentsPage />} />
      <Route path="/comment/:id" element={<SingleCommentPage />} />
    </Routes>
  );
}

export default App;
