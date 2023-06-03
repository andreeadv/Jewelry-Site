

//setCookie("a",10, 1000)
function setCookie(nume, val, timpExpirare){//timpExpirare in milisecunde
    d=new Date();
    d.setTime(d.getTime()+timpExpirare)
    document.cookie=`${nume}=${val}; expires=${d.toUTCString()}`;
}

function getCookie(nume){
    vectorParametri=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let param of vectorParametri){
        if (param.trim().startsWith(nume+"="))
            return param.split("=")[1]
    }
    return null;
}

function deleteCookie(nume){
    console.log(`${nume}; expires=${(new Date()).toUTCString()}`)
    document.cookie=`${nume}=0; expires=${(new Date()).toUTCString()}`;
}

function deleteAllCookies() {
    vectorCookies=document.cookie.split(";") // ["a=10","b=ceva"]
    for(let cookie of vectorCookies){
        deleteCookie(cookie.split("=")[0]);//key
    }
}

//cookie pt ultimul produs accesat
function setLastProductCookie(numeprodus) {
    setCookie("last_product", numeprodus, 3 * 24 * 60 * 60 * 1000); // Expires after 3 days
}
function resetLastFiltersCookie() {
    deleteCookie("last_product");
} 

window.addEventListener("load", function(){
    if (getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    } else{
        document.getElementById("banner").style.display = "block"; // Show the banner
        document.getElementById("banner").classList.add("animation");//daca nu a fost acceptat se afiseaza bannerul prin animatia ceruta
    }

    this.document.getElementById("ok_cookies").onclick=function(){
        //expira dupa jumatate de zi
        //setCookie("acceptat_banner",true, 12 * 60 * 60 * 1000)
        //expira dupa 6 sec(pt prezentare)
        setCookie("acceptat_banner",true,6000);
        document.getElementById("banner").style.display="none"
    }
})
