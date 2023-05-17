const express = require("express");
const fs=require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');

const {Client} = require('pg');

 
var client= new Client({database:"ProiectTW",
        user:"andreea",
        password:"123456",
        host:"localhost",
        port:5432});
client.connect();
client.query("select * from lab8_14", function(err, rez){
    console.log("Eroare BD",err);
 
    console.log("Rezultat BD",rez.rows);
});

obGlobal={
    obErori: null,
    obImagini: null,
    folderScss:path.join(__dirname, "Resurse/scss"),
    folderCss:path.join(__dirname, "Resurse/CSS"),
    folderBackup:path.join(__dirname, "backup"),
    optiuniMeniu:[]
}

client.query("select * from unnest(enum_range(null::tipuri_bijuterii))", function(err, rezCategorie){
    if (err){
        console.log(err);
    }else{
        obGlobal.optiuniMeniu=rezCategorie.rows;
    }
});

app= express();
console.log("Folder proiect", __dirname);
console.log("Cale Fisier", __filename);
console.log("Director de lucru", process.cwd());

vectorFoldere=["temp", "temp1", "backup"]
for(let folder of vectorFoldere){
    // let caleFolder=__dirname+ "/"+ folder;
    let caleFolder=path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder)){
        fs.mkdirSync(caleFolder);
    }
}

function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);
    if(!caleCss){
        // TO DO
        // let vectorCale=caleScss.split("\\")
        // let numeFisExt=vectorCale[vectorCale.length-1];
        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    

    let caleBackup=path.join(obGlobal.folderBackup, "Resurse/CSS");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    //TO DO
    // let vectorCale=caleCss.split("\\");
    // let numeFisCss=vectorCale[vectorCale.length-1]
    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "Resurse/CSS",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");

vFisiere=fs.readdirSync(obGlobal.folderScss);
console.log(vFisiere);
for(let numeFis of vFisiere){
    if(path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

fs.watch(obGlobal.folderScss, function(eveniment,numeFis){
    console.log(eveniment, numeFis);
    if(eveniment=="change" || eveniment=="rename"){
        //daca a fost sters si creat iar apare cu rename=>deci verif intai daca fisierul exista
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if(fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }

})


app.set("view engine", "ejs");

app.use("/Resurse", express.static(__dirname+"/Resurse"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.use("/*",function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    next();
})

app.use(/^\/Resurse(\/[a-zA-Z0-9]*)*$/,function(req,res){
    afisareEroare(res,403);
})

app.get("/favicon.ico", function(req,res){
    res.sendFile(__dirname+"/Resurse/ico/favicon.ico");
})

app.get("/ceva", function(req,res){
    console.log("cale:", req.url)
    res.send("altceva");
})

app.get(["/index", "/", "/home"], function(req, res){
    res.render("pagini/index",{ip: req.ip, imagini:obGlobal.obImagini.imagini});
})

// PRODUSE, inainte de/* sa nu se potriveasca cu orice 
app.get("/produse",function(req, res){
    client.query("select * from unnest(enum_range(null::categorii_produse))", function(err, rezCategorie){
        if (err){
            console.log(err);
        }
        else{
            let conditieWhere="";
            if(req.query.tip){
                conditieWhere=` where tip_produs='${req.query.tip}'`
            }
            client.query("select * from bijuterii"+conditieWhere , function( err, rez){
                console.log(300)
                if(err){
                    console.log(err);
                    afisareEroare(res, 2);
                }
                else
                //al doilea query in callbacku primului
                    res.render("pagini/produse", {produse:rez.rows, optiuni:rezCategorie.rows});
            });
        }
    })
      


});


app.get("/produs/:id",function(req, res){
    console.log(req.params);
   
    client.query(`select * from bijuterii where id=${req.params.id}`, function( err, rezultat){
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else
            res.render("pagini/produs", {prod:rezultat.rows[0]});
    });
});




//regexp: ^\w+\.ejs$

app.get("/*.ejs", function(req,res){
    afisareEroare(res,400);
})

app.get("/*", function(req,res){
   try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if(err){
                console.log(err);
                if(err.message.startsWith("Failed to lookup view"))
                    afisareEroare(res,404);
                else 
                    afisareEroare(res);
            }
            else{
                console.log(rezRandare);
                res.send(rezRandare);
            }
        });
    }catch(err){
        if(err.message.startsWith("Cannot find module"))
                    afisareEroare(res,404);
                else 
                    afisareEroare(res)
    }
})

function initErori(){
    var continut=fs.readFileSync(__dirname+"/Resurse/json/erori.json").toString("utf-8");
    console.log(continut);
    obGlobal.obErori=JSON.parse(continut);
    let vErori=obGlobal.obErori.info_erori;
    for(let eroare of vErori){
        eroare.imagine="/"+ obGlobal.obErori.cale_baza+"/"+eroare.imagine;
    }
}
initErori();

function initImagini(){
    var continut= fs.readFileSync(__dirname+"/Resurse/json/galerie.json").toString("utf-8");
  
    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleAbs=path.join(__dirname, obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(caleAbs,"mediu");
    if(!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    //for(let i=0; i<vErori.length; i++)
    for(let imag of vImagini){
        [numeFis, ext]=imag.fisier.split(".");
        let caleFisAbs=path.join(caleAbs, imag.fisier);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(400).toFile((caleFisMediuAbs));
        imag.fisier_mediu="/"+path.join(obGlobal.obImagini.cale_galerie,"mediu", numeFis+".webp");
        imag.fisier="/"+path.join(obGlobal.obImagini.cale_galerie,imag.fisier);
        //eroare.imagine="/"+obGlobal.obErori.cale_baza+"/"+eroare.imagine;

    }

    
}
initImagini();

// daca programatorul seteaza titlul se ia cel din argument
// daca nu e setat se ia cel din json
//daca nu avem titlu nici la json se ia titlul de valoare default
//idem pt celelalte
function afisareEroare(res, _identificator, _titlu="EROARE", _text, _imagine){

    let vErori=obGlobal.obErori.info_erori;
    let eroare=vErori.find(function(elem) {return elem.identificator==_identificator;});
    if(eroare){
        let titlu1= _titlu =="EROARE" ? ( eroare.titlu || _titlu): _titlu;
        let text1= _text|| eroare.text;
        let imagine1= _imagine || eroare.imagine;
        if(eroare.status)
             res.status(eroare.identificator).render("pagini/eroare", {titlu: titlu1, text:text1, imagine: imagine1});
        else
            res.render("pagini/eroare", {tiltu: titlu1, text:text1, imagine: imagine1});

    }
    else
    {
        let errDef=obGlobal.obErori.eroare_default;
        res.render("pagini/eroare", {tiltu: errDef.titlu, text:errDef.text, imagine: obGlobal.obErori.cale_baza+"/"+errDef.imagine});
    }
     
}

app.listen(8080);

console.log("Serverul a pornit!");