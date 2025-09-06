// src/pages/Home.jsx
import Cascade from '../components/Cascade';
import PostCard from '../components/PostCard';

const Home = () => {
  return (
    <div className="w-full">
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold font-display mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600">
              Insights & Ideas
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover tutorials and stories from the world of technology and development.
          </p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12 font-display">
            Latest Posts
          </h2>
          <Cascade
            endpoint="/cascade/posts"
            limit={8}
            renderItem={(post) => <PostCard post={post} />}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          />
        </div>
      </section>
    </div>
  );
};
export default Home;