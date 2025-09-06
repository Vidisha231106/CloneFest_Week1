import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Post from './pages/Post';
import About from './pages/About';
import CategoriesPage from './pages/CategoriesPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import ProtectedRoute from './components/ProtectedRoute';

// Import the new pages for search, tags, and categories functionality
import SearchResults from './pages/SearchResults';
import TagPosts from './pages/TagPosts';
import CategoryPosts from './pages/CategoryPosts';

import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Post route using postId parameter */}
          <Route path="/posts/:postId" element={<Post />} />

          {/* New routes for search, tags, and categories functionality */}
          <Route path="/search" element={<SearchResults />} />
          <Route path="/tags/:slug" element={<TagPosts />} />
          <Route path="/categories/:slug" element={<CategoryPosts />} />

          {/* Protected Routes */}
          <Route 
            path="/create-post" 
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-post/:postId" 
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;