import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { email, password } = formData;

  // Animation effect when component mounts
  useEffect(() => {
    const loginForm = document.querySelector('.auth-form-container');
    if (loginForm) {
      loginForm.classList.add('fade-in-up');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userData = await loginUser({ email, password });

      // If remember me is checked, we could store the token in localStorage
      // This is just for UI demonstration
      if (rememberMe) {
        console.log('Remember me is checked');
      }

      // Add success animation
      const loginForm = document.querySelector('.auth-form-container');
      if (loginForm) {
        loginForm.classList.add('success-animation');
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          login(userData, userData.token);
        }, 800);
      } else {
        login(userData, userData.token);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      // Add error shake animation
      const loginForm = document.querySelector('.auth-form-container');
      if (loginForm) {
        loginForm.classList.add('error-shake');
        setTimeout(() => {
          loginForm.classList.remove('error-shake');
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Welcome Back</h2>
        <p className="auth-form-subtitle">Sign in to continue to your dashboard</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formSubmitted && !email ? 'has-error' : ''}`}>
          <label htmlFor="email" className="form-label">
            <i className="fas fa-envelope"></i> Email
          </label>
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              className="form-control"
              placeholder="Enter your email"
            />
            <div className="input-highlight"></div>
          </div>
          {formSubmitted && !email && <div className="form-error">Email is required</div>}
        </div>

        <div className={`form-group ${focusedField === 'password' ? 'focused' : ''} ${formSubmitted && !password ? 'has-error' : ''}`}>
          <label htmlFor="password" className="form-label">
            <i className="fas fa-lock"></i> Password
          </label>
          <div className="input-group password-input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              onFocus={() => handleFocus('password')}
              onBlur={handleBlur}
              className="form-control"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              tabIndex="-1"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            <div className="input-highlight"></div>
          </div>
          {formSubmitted && !password && <div className="form-error">Password is required</div>}
        </div>

        <div className="form-options">
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={handleRememberMe}
            />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
        </div>

        <button
          type="submit"
          className={`btn btn-primary auth-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google">
            <i className="fab fa-google"></i> Sign in with Google
          </button>
          <button type="button" className="social-btn facebook">
            <i className="fab fa-facebook-f"></i> Sign in with Facebook
          </button>
        </div>
      </form>

      <div className="auth-footer">
        Don't have an account? <Link to="/register" className="auth-link">Create Account</Link>
      </div>
    </div>
  );
};

export default Login;
