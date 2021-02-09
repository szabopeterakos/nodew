function autocomplete(input, latIn, lonIn) {
  console.log('🚀 ~ file: autocomplete.js ~ line 2 ~ autocomplete ~ input, latIn, lonIn', input, latIn, lonIn);
  if (!input) {
    return;
  }

  const dropdown = new google.maps.places.Autocomplete(input);
  dropdown.addListener('place_changed', () => {
    const place = dropdown.getPlace();
    latIn.value = place.geometry.location.lat();
    lonIn.value = place.geometry.location.lng();
    console.log('p>', place);
  });

  // enter in the address field bling.js
  input.on('keydown', (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  });
}

export default autocomplete;
