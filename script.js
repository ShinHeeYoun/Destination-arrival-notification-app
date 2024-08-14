$( function () {
    $( '[data-toggle="popover"]' ).popover()
  } );

document.write('<script src ="Location.js"></script>')
document.write('<script src ="AddressSearch.js"></script>')


var container = document.getElementById('map');
                var options = {
                    center: new kakao.maps.LatLng(37.5552698362077, 127.15409700694347),
                    level: 3
                };

                var map = new kakao.maps.Map(container, options); // 지도를 생성합니다

                var currentTypeId;

                // 버튼이 클릭되면 호출되는 함수입니다
                function setOverlayMapTypeId(maptype) {
                    var changeMaptype;
                    
                    // maptype에 따라 지도에 추가할 지도타입을 결정합니다
                    if (maptype === 'roadmap') {            
                        changeMaptype = kakao.maps.MapTypeId.NORMAL;     	
                    }

                    else if (maptype === 'traffic') {            
                        changeMaptype = kakao.maps.MapTypeId.TRAFFIC;     
                    } 
                    
                    else if (maptype === 'hybrid') {
                        changeMaptype = kakao.maps.MapTypeId.HYBRID;    
                    }
                        
                    // 이미 등록된 지도 타입이 있으면 제거합니다
                    if (currentTypeId) {
                        map.removeOverlayMapTypeId(currentTypeId);    
                    }
                    
                    // maptype에 해당하는 지도타입을 지도에 추가합니다
                    map.addOverlayMapTypeId(changeMaptype);
                    
                    // 지도에 추가된 타입정보를 갱신합니다
                    currentTypeId = changeMaptype;        
                }

                // 지도 확대, 축소 
                function zoomIn() {
                    map.setLevel(map.getLevel() - 1);
                }

                function zoomOut() {
                    map.setLevel(map.getLevel() + 1);
                }




                // list
        var markers = [];
        var ps = new kakao.maps.services.Places();  

        // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
        var infowindow = new kakao.maps.InfoWindow({zIndex:1});

        // 키워드로 장소를 검색합니다
        searchPlaces();

        // 키워드 검색을 요청하는 함수입니다
        function searchPlaces() {

            var keyword = document.getElementById('keyword').value;

            if (!keyword.replace(/^\s+|\s+$/g, '')) {
                alert('키워드를 입력해주세요!');
                return false;
            }

            // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
            ps.keywordSearch( keyword, placesSearchCB); 
        }

        // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
        function placesSearchCB(data, status, pagination) { /////////////////
            if (status === kakao.maps.services.Status.OK) {

                // 정상적으로 검색이 완료됐으면
                // 검색 목록과 마커를 표출합니다
                displayPlaces(data);
                category(data);

                // 페이지 번호를 표출합니다
                displayPagination(pagination);
                
            } else if (status === kakao.maps.services.Status.ZERO_RESULT) {

                alert('검색 결과가 존재하지 않습니다.');
                return;

            } else if (status === kakao.maps.services.Status.ERROR) {

                alert('검색 결과 중 오류가 발생했습니다.');
                return;

            }
            console.log(data)
        }

        var first_category = {}
        var second_category = {}
        var last_category = {}
        //대분류 카테고리 만들어줌
        function category(places){

            first_category = {}

            var select = document.getElementById('firstCategory')
            for ( var i=0; i<places.length; i++ ) {
                // 마커를 생성하고 지도에 표시합니다
                var _first = places[i].category_name.split(' > ')[0] //여행, 가정생활
                
                if(!first_category[_first]){
                    first_category[_first] = []
                } 
            
                first_category[_first].push(places[i])
                

            }
            // console.log(first_category) => { 여행: Array(13), 가정.생활 : Array:(2) }
        
            //대분류 value값 select로 만들기 
            var cate_name1 = Object.keys(first_category) //["여행", "가정.생활"]
            select.options.length = 0; //초기화

            var optionEl = document.createElement("option");
            optionEl.value = "대분류";
            optionEl.innerHTML = "대분류";
            select.appendChild(optionEl);

            for (var a= 0; a < cate_name1.length; a++ ) {
                var optionEl = document.createElement("option");
                optionEl.value = cate_name1[a];
                optionEl.innerHTML = cate_name1[a];
                select.appendChild(optionEl);
                
            } 
        }

        //대분류 선택시 중분류 카테고리를 만들어줌
        function changeFirstSelect(e){

            second_category = {}
            var select2 = document.getElementById('secondCategory')
            
            if (e.value != "대분류"){
                displayPlaces(first_category[e.value]); //선택한 값에 대해 목록과 마커 표출
                for( var i = 0 ; i < first_category[e.value].length; i++){
                    var _second = first_category[e.value][i].category_name.split(' > ')[1] //여행->관광명소 ,가정.생활->대형마트
                    if(!second_category[_second]){
                    second_category[_second] = []
                    } 
                    second_category[_second].push(first_category[e.value][i]); //[여행: {"관광명소1" ,"관광명소2" ..}] , [가정.생활: {"대형마트1", 대형마트2"}]
                }
                
                var cate_name2 = Object.keys(second_category) //["관광명소", "대형마트"]
                select2.options.length = 0; //초기화
                
                var optionEl2 = document.createElement("option");
                optionEl2.value = "중분류";
                optionEl2.innerHTML = "중분류";
                select2.appendChild(optionEl2);

                for (var a= 0; a < cate_name2.length; a++ ) {
                    var optionEl2 = document.createElement("option");
                    optionEl2.value = cate_name2[a];
                    optionEl2.innerHTML = cate_name2[a];
                    select2.appendChild(optionEl2);
                } 

            }
        }

        //중분류 선택시 소분류 카테고리 만들어줌
        function changeSecondSelect(e){
            last_category = {};
            var select3 = document.getElementById('lastCategory');

            if (e.value != "중분류"){
                displayPlaces(second_category[e.value]);

                for(var z=0; z < second_category[e.value].length; z++ ){
                    var _last = second_category[e.value][z].category_name.split(' > ')[2] //여행->관광명소-> 광장,테마거리,동물원 ...
                
            
                    if(!last_category[_last]){
                        last_category[_last] = [];
                    }
                    last_category[_last].push(second_category[e.value][z]);
                }
                

                var cate_name3 = Object.keys(last_category); //["광장", "테마거리", "동물원", "동상", "문화유적", "하천", "도자기,도예촌"]
                select3.options.length = 0;

                var optionEl3 = document.createElement("option");
                optionEl3.value = "소분류";
                optionEl3.innerHTML = "소분류";
                select3.appendChild(optionEl3);

                for (var z= 0; z < cate_name3.length; z++ ) {
                    var optionEl3 = document.createElement("option");
                    optionEl3.value = cate_name3[z];
                    optionEl3.innerHTML = cate_name3[z];
                    select3.appendChild(optionEl3);
                    
                } 
            }

        }

        //중분류 선택시 소분류 카테고리 만들어줌
        function changelastSelect(e){
            if (e.value != "소분류"){
                displayPlaces(last_category[e.value])
            }

        }

        // 검색 결과 목록과 마커를 표출하는 함수입니다
        function displayPlaces(places) {

            var listEl = document.getElementById('placesList'), 
            menuEl = document.getElementById('menu_wrap'),
            fragment = document.createDocumentFragment(), 
            bounds = new kakao.maps.LatLngBounds(), 
            listStr = '';
            
            // 검색 결과 목록에 추가된 항목들을 제거합니다
            removeAllChildNods(listEl);

            // 지도에 표시되고 있는 마커를 제거합니다
            removeMarker();

            for ( var i=0; i<places.length; i++ ) {

                // 마커를 생성하고 지도에 표시합니다
                var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
                    marker = addMarker(placePosition, i), 
                    itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

                // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
                // LatLngBounds 객체에 좌표를 추가합니다
                bounds.extend(placePosition);

                // 마커와 검색결과 항목에 mouseover 했을때
                // 해당 장소에 인포윈도우에 장소명을 표시합니다
                // mouseout 했을 때는 인포윈도우를 닫습니다
                (function(marker, title) {
                    kakao.maps.event.addListener(marker, 'mouseover', function() {
                        displayInfowindow(marker, title);
                    });

                    itemEl.onmouseover =  function () {
                        displayInfowindow(marker, title);
                    };

                    itemEl.onmouseout =  function () {
                        infowindow.close();
                    };
                })(marker, places[i].place_name);

                fragment.appendChild(itemEl);
            }


            // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
            listEl.appendChild(fragment);
            menuEl.scrollTop = 0;

            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
            map.setBounds(bounds);
        
        }

        // 검색결과 항목을 Element로 반환하는 함수입니다
        function getListItem(index, places) { ////////////////

            var el = document.createElement('li'),
            itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                        '<div class="info">' + 
                        '   <h5>' + places.place_name + '</h5>';

            if (places.road_address_name) {
                itemStr += '    <span>' + places.road_address_name + '</span>' +
                            '   <span class="jibun gray">' +  places.address_name  + '</span>';
            } else {
                itemStr += '    <span>' +  places.address_name  + '</span>'; 
            }
                        
            itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                        '</div>';           

            el.innerHTML = itemStr;
            el.className = 'item';

            return el;
        }

        // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
        function addMarker(position, idx, title) {
            var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
                imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
                imgOptions =  {
                    spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
                    spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
                    offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
                },
                markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
                    marker = new kakao.maps.Marker({
                    position: position, // 마커의 위치
                    image: markerImage 
                });

            marker.setMap(map); // 지도 위에 마커를 표출합니다
            markers.push(marker);  // 배열에 생성된 마커를 추가합니다

            return marker;
        }

        // 지도 위에 표시되고 있는 마커를 모두 제거합니다
        function removeMarker() {
            for ( var i = 0; i < markers.length; i++ ) {
                markers[i].setMap(null);
            }   
            markers = [];
        }

        // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
        function displayPagination(pagination) {
            
            var paginationEl = document.getElementById('pagination'),
                fragment = document.createDocumentFragment(),
                i; 

            // 기존에 추가된 페이지번호를 삭제합니다
            while (paginationEl.hasChildNodes()) {
                paginationEl.removeChild (paginationEl.lastChild);
            }

            for (i=1; i<=pagination.last; i++) {
                var el = document.createElement('a');
                el.href = "#";
                el.innerHTML = i;

                if (i===pagination.current) {
                    el.className = 'on';
                } else {
                    el.onclick = (function(i) {
                        return function() {
                            pagination.gotoPage(i);                    
                        }
                    })(i);
                }

                fragment.appendChild(el);
            }
            paginationEl.appendChild(fragment);
        }

        // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
        // 인포윈도우에 장소명을 표시합니다
        function displayInfowindow(marker, title) {
            var content = '<div style="padding:5px;z-index:1;">' + title +'<hr> 목적지 인가요?  <button class="Likebutton" type="submit" onclick="btn()"  form="todo-form">⭐</button>  <button class="Search2" type="button" onclick="RunProgram()">도착</button></div>'+ '</div>';
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }


        function btn(){
            var inputvalue = document.getElementById("keyword").value;
            alert(inputvalue);
            toDoForm.addEventListener('submit', handleToDoSubmit);
            alert('즐겨찾기 추가!')

        } 

        // 검색결과 목록의 자식 Element를 제거하는 함수입니다
        function removeAllChildNods(el) {   
            while (el.hasChildNodes()) {
                el.removeChild (el.lastChild);
            }
        }
        
        