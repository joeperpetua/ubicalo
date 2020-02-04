var defaultFirestore = defaultProject.firestore();
var data = [];
var windows = [];
var map;
var dataLength = 0;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: -34.397, lng: 150.644},
        zoom: 2
    });
}

window.onload = function(){
    console.log('loaded');
    addMarkers(map);
};

function addMarkers(map){
    defaultFirestore.collection("markers").where("approved", "==", false)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data.push(doc.data());
            windows.push(null);
            dataLength++;
            console.log(dataLength, windows);
        });
    }).then(function(){
        createMarkers();
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    console.log(data);
}

function createMarkers(){
    
    for (let i = 0; i < data.length; i++) {
        var marker = new google.maps.Marker({
            position: data[i].geolocation,
            map: map,
            animation: google.maps.Animation.DROP,
            title: data[i].name,
            zoom: 16
        });

        console.log(data[i].geolocation);

        var contentString = `
            <div id="content">
                <div id="siteNotice"></div>
                <h6 id="firstHeading" class="firstHeading">`+data[i].name+`</h6>
                <div id="bodyContent">
                    <ul>
                        <li>Nombre: `+data[i].name+`<li>
                        <li>Ubicacion actual: `+data[i].location+`<li>
                        <li>Posibles ubicaciones: `+data[i].possibleLocation+`<li>
                        <li>Esta acompaniado por ninios: `+data[i].hasChildren+`<li>
                    </ul>
                </div>
            </div>
        `;

        windows[i] = contentString;
        console.log(windows[i]);

        var infowindow = new google.maps.InfoWindow({
            content: windows[i]
        });

        marker.addListener('click', function() {
            map.panTo(data[i].geolocation);
            /* smoothZoom(map, 17, map.getZoom()); */
            infowindow.open(map, marker)
        }); 
    }
}


// the smooth zoom function
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




        





