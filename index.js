/*Taller 5 - Electivo web.

Nombre: Pablo Vásquez 
Rut: 19.288.815-8
Profesor: Daniel Bustos

UBB

*/

'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Product = require('./modelos/product')
const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.get('/hola',(req,res)=>{

    res.status(200).send({message:"Bienvenido"})

})

app.get('/api/product',(req,res)=>{

    res.status(200).send("AAquí devolveremos los productos")
})


app.get('/api/product/:idProducto',(req,res)=>{ // el : indica parámetro dinámico.

    let ProductId = req.params.idProducto
    Product.findById(ProductId,(err,product)=>{
        if(err) return res.status(500).send({message:'Error al realizar la petición'})
        if(!product) return res.status(404).send({message:'Error, el producto no existe.'})

        res.status(200).send({product})
    })

})


app.post('/api/product',(req,res)=>{

    let product = new Product()
    product.name = req.body.name
    product.picture = req.body.picture
    product.price = req.body.price
    product.category = req.body.category
    product.description = req.body.description

    product.save((err,productStore)=>{

        if(err) res.status(500).send(`Error base de datos: ${err}`)

        res.status(200).send({product:productStore})

    })
   
   // res.status(200).send(`El producto es: ${req.body.name}`)

})

//PUT

app.put('/api/product/:idProducto',(req,res)=>{

    //si existe el registro, se actualiza.
    Product.findById(req.params.idProducto,(err,product)=>{

        
        //Se modifica el registro.
        if(req.body.name !== undefined) product.name = req.body.name
        if(req.body.picture !== undefined) product.picture = req.body.picture
        if(req.body.price !== undefined) product.price = req.body.price
        if(req.body.category !== undefined) product.category = req.body.category
        if(req.body.description !== undefined) product.description = req.body.description


        product.save((err,product)=>{

            if(err) res.status(500).send(`Error al actualizar registro: ${err}`)
    
            res.json({message:'El producto fue actualizado correctamente.'})
    
        })
    })
})


//DELETE

app.delete('/api/product/:idProducto',(req,res)=>{

    let productId = req.params.idProducto

    Product.findById(productId, (err,product)=>{
        if(err) res.status(500).send({message: `Error al borrar el producto ${err}`})

        product.remove(err =>{
            if(err) res.status(500).send({message: `Error al borrar el producto ${err}`})
            res.status(200).send({message: 'El producto ha sido eliminado'})
        })
    })

})

mongoose.connect('mongodb+srv://pblov:"password"@cluster0-4t6fz.mongodb.net/test?retryWrites=true&w=majority',(err,res)=>{

    if(err) throw err
    console.log('Conexión establecida')

    app.listen(3000,()=>{

        console.log("Esta corriendo en puerto 3000")
    
    })

})

