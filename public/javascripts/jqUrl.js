function QSObject(querystring){
    //Create regular expression object to retrieve the qs part
    var qsReg = new RegExp("[?][^#]*","i");
    hRef = unescape(querystring);
    var qsMatch = hRef.match(qsReg);

    //removes the question mark from the url
    qsMatch = new String(qsMatch);
    qsMatch = qsMatch.substr(1, qsMatch.length -1);

    //split it up
    var rootArr = qsMatch.split("&");
    for(i=0;i<rootArr.length;i++){
        var tempArr = rootArr[i].split("=");
        if(tempArr.length ==2){
            tempArr[0] = unescape(tempArr[0]);
            tempArr[1] = unescape(tempArr[1]);

            this[tempArr[0]]= tempArr[1];
        }
    }
}

function queryParamFor(jsFile) {
  url = $('script[src~='+jsFile+']').attr('src').toLowerCase();
  return new QSObject(url);
}

