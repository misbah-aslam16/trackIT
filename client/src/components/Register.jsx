import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  // Animation effect when component mounts
  useEffect(() => {
    const registerForm = document.querySelector('.auth-form-container');
    if (registerForm) {
      registerForm.classList.add('fade-in-up');
    }
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (password.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(password)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return '#e74c3c';
    if (passwordStrength <= 4) return '#f39c12';
    return '#2ecc71';
  };

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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleAgreeTerms = () => {
    setAgreeTerms(!agreeTerms);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Validate form
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      setError('Please use a stronger password');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await registerUser({ name, email, password });

      // Add success animation
      const registerForm = document.querySelector('.auth-form-container');
      if (registerForm) {
        registerForm.classList.add('success-animation');
        // Wait for animation to complete before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 800);
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      // Add error shake animation
      const registerForm = document.querySelector('.auth-form-container');
      if (registerForm) {
        registerForm.classList.add('error-shake');
        setTimeout(() => {
          registerForm.classList.remove('error-shake');
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form-header">
        <h2 className="auth-form-title">Create Account</h2>
        <p className="auth-form-subtitle">Fill in the form to get started</p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className={`form-group ${focusedField === 'name' ? 'focused' : ''} ${formSubmitted && !name ? 'has-error' : ''}`}>
          <label htmlFor="name" className="form-label">
            <i className="fas fa-user"></i> Full Name
          </label>
          <div className="input-group">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              className="form-control"
              placeholder="Enter your full name"
            />
            <div className="input-highlight"></div>
          </div>
          {formSubmitted && !name && <div className="form-error">Name is required</div>}
        </div>

        <div className={`form-group ${focusedField === 'email' ? 'focused' : ''} ${formSubmitted && !email ? 'has-error' : ''}`}>
          <label htmlFor="email" className="form-label">
            <i className="fas fa-envelope"></i> Email Address
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
              placeholder="Enter your email address"
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
              placeholder="Create a password"
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
          {password && (
            <div className="password-strength">
              <div className="strength-meter">
                <div
                  className="strength-meter-fill"
                  style={{
                    width: `${(passwordStrength / 5) * 100}%`,
                    backgroundColor: getPasswordStrengthColor()
                  }}
                ></div>
              </div>
              <div className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthLabel()}
              </div>
            </div>
          )}
          {formSubmitted && !password && <div className="form-error">Password is required</div>}
        </div>

        <div className={`form-group ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formSubmitted && (!confirmPassword || confirmPassword !== password) ? 'has-error' : ''}`}>
          <label htmlFor="confirmPassword" className="form-label">
            <i className="fas fa-lock"></i> Confirm Password
          </label>
          <div className="input-group password-input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              onFocus={() => handleFocus('confirmPassword')}
              onBlur={handleBlur}
              className="form-control"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              tabIndex="-1"
            >
              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
            <div className="input-highlight"></div>
          </div>
          {formSubmitted && !confirmPassword && <div className="form-error">Please confirm your password</div>}
          {formSubmitted && confirmPassword && confirmPassword !== password && <div className="form-error">Passwords do not match</div>}
        </div>

        <div className="form-group terms-group">
          <div className="checkbox-container">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={handleAgreeTerms}
            />
            <label htmlFor="agreeTerms">
              I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>
          {formSubmitted && !agreeTerms && <div className="form-error">You must agree to the terms</div>}
        </div>

        <button
          type="submit"
          className={`btn btn-primary auth-submit ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              <span>Creating Account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
      </div>
    </div>
  );
};

export default Register;
