window.addEventListener('load', () => {
  console.log('Ironmaker app started successfully!');
}, false);

  function startMap() { 
  const userLoc = { 
    lat: 41, 
    lng: 2
  }; 
  const map = new google.maps.Map(
    document.getElementById('map'),
    { 
      zoom: 5,
      center: userLoc
    }
  );
}

startMap(); 
