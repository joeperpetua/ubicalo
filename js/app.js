var defaultFirestore = defaultProject.firestore();
var data = [];
var windows = [];
var markers = [];
var map;
var dataLength = 0;


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: 
        {lat: -34.6158037, lng: -58.5033387},
        zoom: 10
    });
}

window.onload = function(){
    addMarkers(map);
};

function addMarkers(map){
    defaultFirestore.collection("markers").where("approved", "==", false)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            data.push(doc.data());
            windows.push(null);
            markers.push(null);
            dataLength++;
            // console.log(dataLength, windows);
        });
    }).then(function(){
        createMarkers();
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    // console.log(data);
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

        marker.infowindow = new google.maps.InfoWindow({ content: ''});

        
        (function(marker, i) {
            // add click event
            google.maps.event.addListener(marker, 'click', function() {
                marker.infowindow.setContent(`
                <div id="content">
                    <div id="siteNotice"></div>
                    <h6 id="firstHeading" class="firstHeading">`+data[i].name+`</h6>
                    <div id="bodyContent">
                        <ul>
                            <li>Nombre: `+data[i].name+`</li>
                            <li>Ubicacion actual: `+data[i].location+`</li>
                            <li>Posibles ubicaciones: `+data[i].possibleLocation+`</li>
                            <li>Esta acompaniado por ninios: `+data[i].hasChildren+`</li>
                        </ul>
                    </div>
                </div>
                `);
                // console.log(marker.infowindow.content);

                let promise = new Promise((resolve, reject) => {
                    if(map.panTo(data[i].geolocation) == undefined){
                        resolve('yay');
                    }else{
                        reject(Error('map.panTo not ready'));
                    }
                });

                promise.then(function(result){
                    
                    setTimeout(function(){ smoothZoom(map, 16, map.getZoom()); }, 100);
                    setTimeout(function(){ marker.infowindow.open(map, marker); }, 1000);
                    
                }, function(err){
                    console.log(err);
                })

                
            });
        })(marker, i);    
        
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
        setTimeout(function(){map.setZoom(cnt)}, 100); // 80ms is what I found to work well on my system -- 
    }
} 




        





