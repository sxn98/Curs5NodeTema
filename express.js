const { response } = require('express');
const express=require('express')
const app=express()
const port=3000
const bodyParser=require('body-parser')
const {v4:uuidv4} =require('uuid')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

let games=[]
let user=[];
let plansa=[[1,1,1],[1,1,1],[1,1,1]];

app.get('/user',(req,res)=>{    // afiseaza toti userii, in mod realistic nu trebuie sa existe asa ceva, e doar pentru testare
    res.json(user)
})
app.post('/user/:nume',(req,res)=>{   // creaza un user nou trimitand un nume si primind inapoi numele impreuna cu un cod unic ce este folosit pentru restul comenzilor
    //user.push(req.body,req.body)
    user.push({
       nume: req.params.nume,
        id:uuidv4()
    })
    res.send(user)
    //console.log(user[0])
    //console.log(user[1])
})

app.get('/games',(req,res)=>{    // afiseaza lista de camere
    res.json(games)
})
app.post('/games/:id',(req,res)=>{   // creaza o camera folosind id-ul unui utilizator, acesta fiind creatorul
    
try{

    games.push({
        id:uuidv4(),
        creator:user[user.findIndex((nume)=>nume.id==req.params.id)].nume,
        oponent:null,
        status:"pending",
        tabla:plansa,
        mutari:0
    })
    res.send(games)
}catch(err){
    res.send("eroare")
}
})
app.delete('/games/:creator/:id',(req,res)=>{    // sterge o camera, aceasta poate fi stearsa numai de catre creator, se transmite id-ul creatorului si id-ul camerei

   // games.splice(games.findIndex((idJoc)=>idJoc.id==req.params.id),1)
    //games.splice(games.indexOf(games[req.params.id],1))
    try{

    
        let NumeCreator=user[user.findIndex((idCreator)=>idCreator.id==req.params.creator)].nume
        let NumeCreatorCamera = games[games.findIndex((idCamera)=>idCamera.id==req.params.id)].creator

         if(NumeCreator === NumeCreatorCamera){
             games.splice(games.findIndex((idCamera)=>idCamera.id==req.params.id),1)
             res.send(NumeCreator+"  "+NumeCreatorCamera)
        }else{
            res.send(NumeCreator+"  "+NumeCreatorCamera)
        }
    }catch(err){
        res.send("Id user sau camera gresita")
    }

    
})
/*app.patch('/games/:id',(req,res)=>{
    const id=req.params.id
    const oponent=req.body

    const gasit=games.find(joc=>joc.id==id)

    console.log(oponent)
    console.log(req.params.id)
    console.log(gasit)
    if(gasit){
        gasit.status="active"
        Object.assign(gasit,oponent)
        res.json(games)
       
    }else{
        res.send("camera nu exista")
    }

})*/ // am ales sa fac cu put deoarece la momentul respectiv nu imi functiona patch

app.put('/games/:id/:oponent',(req,res)=>{  // un oponent da join intr-o camera, ca parametrii sunt necesari id-ul camerei si id-ul unui oponent diferit de catre creator
    try{

    let oponentul=user[user.findIndex((nume)=>nume.id==req.params.oponent)].id // id-ul oponentului
    let joc=games[games.findIndex((idJoc)=>idJoc.id==req.params.id)].id        // id-ul jocului
    let creator=games[games.findIndex((idJoc)=>idJoc.id==req.params.id)].creator  // numele creatorului
    if(joc===req.params.id && oponentul===req.params.oponent && oponentul!==user[user.findIndex((Nume)=>Nume.nume==creator)].id){  // conditie ca idCamera == idCameraOferit, idOponent==idOponentDat, Oponent!= creator
        games[games.findIndex((idJoc)=>idJoc.id==req.params.id)].oponent=user[user.findIndex((nume)=>nume.id==req.params.oponent)].nume
        games[games.findIndex((idJoc)=>idJoc.id==req.params.id)].status="active"   //camera devine activa de la pending
        res.send(games)
    }else{
        res.send("eroare")
    }
    }catch(err){
        res.send("eroare")
    }
})

app.put('/games/:id/:idnume/:linia/:coloana/:semn',(req,res)=>{ // un jucator face o mutare, parametrii sunt id-ul camerei, id-ul jucatorului, linia, coloana si semnul 
                                                                // in cazul meu, tabla de X si 0 este reprezentata de o matrice 3x3 
    try{                                                         
    let linie=parseInt(req.params.linia);
    let coloana=parseInt(req.params.coloana);
    let semn=String(req.params.semn);
    let camera=games.findIndex((idJoc)=>idJoc.id==req.params.id);
    if(linie!=0 && linie!=1 && linie!=2){
        res.send("linie sau coloana gresita")
        return
    }else{
         /* res.json({
              linia:coordonata1,
              coloana:coordonata2
         })*/
         console.log(camera)
         console.log(games[camera].tabla[linie][coloana])
         if(games[camera].tabla[linie][coloana]==1){
             games[camera].tabla[linie][coloana]=semn;
             if(games[camera].mutari<9){
             games[camera].mutari++;
             
             }else{
                res.send("eroare, prea multe mutari, jocul este deja incheiat")
             }
            if(games[camera].mutari==9){
                games[camera].status="incheiat"
            }


             res.json(games)
             }else{
                res.send("linie sau coloana invalida, exista deja un semn")
             }
        }
    }catch(err){
        res.send("eroare")
    }
})

/*app.get('/data',(req,res)=>{
    res.json(data)
})
app.post('/data',(req,res)=>{
    data.push(req.body)
    res.send(data)
})
app.put('/data/:index',(req,res)=>{
    const index=req.params.index
    data[index]=req.body
    res.send(data)
})
app.delete('/data',(req,res)=>{
    data=data.filter((_,i) => i !== +req.query.index)
    res.send(data)
})

app.post('/test',(req,res)=>{
    res.json({
        hello:'world'
    })
})*/



app.listen(port,()=>{
    console.log(`Example app listening on port ${port}`)
})