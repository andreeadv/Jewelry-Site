window.onload=function() {

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }

    document.getElementById("filtrare").onclick= function(){
        let val_nume=document.getElementById("inp-nume").value.toLowerCase();
        let radiobuttons=document.getElementsByName("gr_rad");
        
        let val_gramaj;
        for(let r of radiobuttons){
            if(r.checked){
                val_gramaj=r.value;
                break;
            }
        }

        var cal_a, cal_b;
        if(val_gramaj!="toate")
        {
            [cal_a, cal_b]=val_gramaj.split(":");
            cal_a=parseInt(cal_a);
            cal_b=parseInt(cal_b);
        }
        
        //NU FILTREAZA DUPA MATERIAL
        //radiobuttons pt material
        let radiobuttons1=document.getElementsByName("gr_rad1");
        let val_material;
        for(let r1 of radiobuttons1){
            if(r1.checked){
                val_material=r1.value;
                break;
            }
        }
        var tipmaterial;
        if(val_material!="toate")
        {
            tipmaterial=val_material;
        }
        //select multiplu pentru intervale de pret 
        let val_pret2 = document.getElementById("i_sel_multiplu").options;
        let pretselectat="";
        for (let option of val_pret2) {
            if(option.selected)
				pretselectat+=option.value+" ";
        }
        var p_a,p_b;
        [p_a, p_b]=pretselectat.split("-");
        p_a=parseInt(p_a);
        p_b=parseInt(p_b);

        let val_pret=document.getElementById("inp-pret").value;
        let val_categ=document.getElementById("inp-categorie").value;
        var produse=document.getElementsByClassName("produs");
        
        for (let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();
            let cond1= (nume.startsWith(val_nume));

            let grame=parseInt(prod.getElementsByClassName("val-gramaj")[0].innerHTML);
            let cond2= (val_gramaj=="toate" || cal_a<=grame && grame <cal_b);

            // let mat=prod.getElementsByClassName("val-material")[0].innerHTML;
            // let cond3= (val_material=="toate" || mat==tipmaterial);

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond4= (pret>=val_pret);

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML;
            let cond5= ( val_categ=="toate" ||  val_categ==categorie)

            let pretininterval=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
            let cond6= (p_a<=pretininterval && pretininterval<p_b);
            //merge filtrul cu select multiplu dr cand il adaug nu mai merg celelale filtre 
            if (cond1&&cond2&&cond4&&cond5&&cond6){
                prod.style.display="block";
            }

        }
    }
    document.getElementById("resetare").onclick= function(){
                
        document.getElementById("inp-nume").value="";
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("inp-categorie").value="toate";
        document.getElementById("i_rad4").checked=true;
        //daca resetez si pt selectul multiplu si nu e selectat pe oricat nu mai merg celelalte filtre 
        // document.getElementById("i_sel_multiplu").value = "";
        // document.getElementById("i_rad8").checked=true;
        var produse=document.getElementsByClassName("produs");
        document.getElementById("infoRange").innerHTML="(0)";
        for (let prod of produse){
            prod.style.display="block";
        }
    }
    function sortare (semn){
        var produse=document.getElementsByClassName("produs");
        var v_produse= Array.from(produse);
        v_produse.sort(function (a,b){
            let pret_a=parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML);
            let pret_b=parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a==pret_b){
                let nume_a=a.getElementsByClassName("val-material")[0].innerHTML;
                let nume_b=b.getElementsByClassName("val-material")[0].innerHTML;
                return semn*nume_a.localeCompare(nume_b);
            }
            return semn*(pret_a-pret_b);
        });
        for(let prod of v_produse){
            prod.parentElement.appendChild(prod);
        }
    }
    document.getElementById("sortCrescMaterial").onclick=function(){
        sortare(1);
    }
    document.getElementById("sortDescrescMaterial").onclick=function(){
        sortare(-1);
    }

}