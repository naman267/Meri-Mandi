const Item=require('../models/item')
const Order=require('../models/order')
function userController()
{
    return{
      async getItem(req,res)
      {
        Item.find({}).populate('FarmerId').exec((err,items)=>{
          if(!err)
          {
        console.log("items",items)
        return res.render('user',{items:items})
      }
      else
      {
        res.redirect('/user');
      }

        })

       
      },
      show(req,res)
      {
          const vegetableId=req.params.id
          Item.find({_id:vegetableId}).populate(('FarmerId')).exec((err,items)=>{
            if(!err)
            {  console.log("items",items)
            res.render('singleOrder',{item:items[0]})
          }
          else
          {
            res.redirect('/user')
          }
          
          })
          
          //console.log("vegetable",vegetable)
          

      },
      async order(req,res)
      {
        const {phone,address,item,quantity}=req.body;
        //console.log("data-",phone,address,FarmerId,Item_id)
        console.log("item",item)
        Item.find({_id:item._id}).populate('FarmerId').exec((err,items)=>{
          if(!err)
          {
          console.log("items",items)
        const id=items[0]._id;
        let obj={};
        obj[items[0]._id]={
          name:items[0].name,price:items[0].price,quantity:quantity
        }
        console.log("obj-",obj)
        const user=req.user;
        const neworder=new Order({
          customerId:user._id,
          FarmerId:items[0].FarmerId._id,
          phone,
          address,
          items:obj
        })
       neworder.save().then((items)=>{
          res.redirect('/user')
        }).catch(e=>{
          console.log("error",e)
        })
        res.redirect('/user')
      }
      else
      {
        res.redirect('/user');
      }

        })

        
      },
     async myOrder(req,res)
     {
       Order.find({customerId:req.user._id}).populate('FarmerId').exec((err,order)=>{

        if(!err)
        {
          return res.render('userOrder',{orders:order})
        }
        else{
          return res.redirecr('/user')
        }
       })
       
     }
    }
}
module.exports=userController
