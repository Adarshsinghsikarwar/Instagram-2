import { useDispatch } from "react-redux";
import { setPosts } from "../posts.slice";
import { getPosts } from "../services/posts.api";

export const usePost = () => {
  const dispatch = useDispatch();
  const handleGetPosts = async () => {
    try {
      const data = await getPosts();
      dispatch(setPosts(data.posts));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  const handleCreatePost = async ({ files, caption }) => {
    const data = await createPost({ files, caption });
    return data;
  };
  return { handleGetPosts, handleCreatePost };
};
