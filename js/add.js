var defaultFirestore = defaultProject.firestore();



var map;
var geocoder;
var marker;
var geolocation;
var res;

function initMap() {
    geocoder = new google.maps.Geocoder();
    map = new google.maps.Map(document.getElementById('map'), {
        center: 
            {lat: -34.6158037, lng: -58.5033387},
            zoom: 10
    });

    marker = new google.maps.Marker({
        map: null,
        position: {lat: -34.6158037, lng: -58.5033387}
    });
}

function submit(){
    marker.setMap(null);
    var address = document.getElementById('address').value;
    var msg = document.getElementById('msg');
    
    geocoder.geocode( { 'address': address, 'language': 'es-419'}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location
          });
          geolocation = results[0].geometry.location.toJSON();
          res = results[0].formatted_address;
          map.panTo(marker.position);
          smoothZoom(map, 17, map.getZoom());
          msg.innerHTML = 'Por favor verifica que la localizacion sea la correcta';
        } else {
          alert('Direccion no encontrada.\nError: ' + status);
        }
      });
}

function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        return;
    }
    else {
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 1);
        });
        setTimeout(function(){map.setZoom(cnt)}, 80); // 80ms is what I found to work well on my system -- 
    }
} 

function send(){
    var name = document.getElementById('name').value;
    var possibleLocation = document.getElementById('possible').value;
    var hasChildrenArray = document.getElementsByName('children');
    var hasChildren;

    for (let i = 0; i < hasChildrenArray.length; i++) {
        if (hasChildrenArray[i].checked) {
            hasChildren = hasChildrenArray[i].value;
        }
    }

    console.log(name,geolocation,res,possibleLocation,hasChildren);

    


    defaultFirestore.collection("markers").add({
        name: name,
        geolocation: geolocation,
        location: res,
        possibleLocation: possibleLocation,
        hasChildren: hasChildren,
        approved: false
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert("El aviso se esta revisando, una vez confirmado se podra ver en el mapa oficial");
        window.open("index.html", "_self");
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

