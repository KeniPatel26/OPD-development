import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDoctors, loginDoctor } from '../services/api';
import Swal from 'sweetalert2';

export default function LoginButton({ user, login, logout }) {
  // Fetch doctors
  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });

  const handleLogin = () => {
    if (isLoading) {
      Swal.fire({
        icon: 'info',
        title: 'Please wait',
        text: 'Loading doctors...',
      });
      return;
    }

    if (isError) {
      Swal.fire({
        icon: 'error',
        title: 'Unable to Load Doctors',
        text: 'Could not load the doctor list. Please try again.',
      });
      return;
    }

    Swal.fire({
      title: 'Doctor Login',

      html: `
        <select
          id="doctor-select"
          class="swal2-input"
          style="width: 80%; max-width: 100%;"
        >
          <option value="">Select your name</option>

          ${doctors
            .map(
              (d) =>
                `<option value="${d._id}">${d.name}</option>`
            )
            .join('')}
        </select>

        <input
          type="password"
          id="doctor-password"
          class="swal2-input"
          placeholder="Password"
          style="width: 80%; max-width: 100%;"
          value="123456"
        />
      `,

      focusConfirm: false,
      showCancelButton: true,

      confirmButtonText: 'Login',
      cancelButtonText: 'Cancel',

      preConfirm: () => {
        const doctorId =
          document.getElementById('doctor-select')?.value;

        const password =
          document.getElementById('doctor-password')?.value;

        if (!doctorId || !password) {
          Swal.showValidationMessage(
            'Please enter both name and password'
          );

          return false;
        }

        return {
          doctorId,
          password,
        };
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      loginDoctor(result.value)
        .then((data) => {
          // Save logged-in doctor
          login(data.user);

          // Show success message
          Swal.fire(
            'Logged In',
            `Welcome ${data.user.name}`,
            'success'
          );
        })
        .catch((err) => {
          Swal.fire(
            'Login Failed',
            err.response?.data?.error ||
              err.message ||
              'Invalid doctor credentials',
            'error'
          );
        });
    });
  };

  // ==========================
  // LOGGED-IN DOCTOR VIEW
  // ==========================

  if (user?.role === 'doctor') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontWeight: 500,
            color: 'var(--primary)',
          }}
        >
          {user.name}
        </span>

        <button
          className="btn btn-secondary btn-sm"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    );
  }

  // ==========================
  // RECEPTIONIST VIEW
  // ==========================

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <button
        className="btn btn-primary btn-sm"
        onClick={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Doctor Login'}
      </button>
    </div>
  );
}
