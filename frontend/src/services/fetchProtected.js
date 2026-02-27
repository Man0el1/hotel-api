async function fetchProtected(url, options = {}) {

  const response = await fetch(url, {
    ...options,
    headers:{
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }
  return response;
}