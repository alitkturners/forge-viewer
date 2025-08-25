'use client';

import React, { useEffect } from 'react';





function page() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('code');

    fetch('/api/auth/callback?code=' + myParam)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', JSON.stringify(data));
        window.location.href = '/dashboard';
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation: ', error);
      });
  }, []);
  return <div>Please wait your authorization is in progress</div>;
}

export default page;