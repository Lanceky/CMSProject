import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import './Auth.css';
import cowbg from '../../assets/cowbg.jpg';

const Signup = () => {
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Too short').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      setApiError('');
      setIsSubmitting(true);  // Set submitting to true when submission starts
      try {
        // Create user in Firebase Authentication
        const userCred = await createUserWithEmailAndPassword(auth, values.email, values.password);
        const user = userCred.user;

        // Save extra user data to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          name: values.name,
          email: values.email,
          createdAt: new Date(),
        });

        // Add debugging to see if we are reaching this part
        console.log("Account successfully created. Redirecting to login...");

        // Wait for 3 seconds before redirecting to login page
        setTimeout(() => {
          console.log("Redirecting to login page...");
          navigate('/dashboard');
        }, 3000); // 3-second delay
      } catch (error: any) {
        setApiError(error.message || 'Signup failed');
      } finally {
        setIsSubmitting(false); // Reset submitting flag
      }
    },
  });

  return (
    <div className="auth-container" style={{ backgroundImage: `url(${cowbg})` }}>
      <div className="login-form-container">
        <h1>Create your account.</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              placeholder="Full Name"
              autoComplete="name"
            />
            {formik.touched.name && formik.errors.name && (
              <span className="error-text">{formik.errors.name}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Email"
              autoComplete="email"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="error-text">{formik.errors.email}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Password"
              autoComplete="new-password"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="error-text">{formik.errors.password}</span>
            )}
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              placeholder="Confirm Password"
              autoComplete="new-password"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <span className="error-text">{formik.errors.confirmPassword}</span>
            )}
          </div>

          {apiError && <span className="error-text error-api">{apiError}</span>}

          <button type="submit" disabled={isSubmitting || formik.isSubmitting} className="login-button">
            Sign Up
          </button>
        </form>

        <div className="create-account">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
