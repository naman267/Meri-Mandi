const Item=require('../models/item')
const Order=require('../models/order')
const fs=require('fs')
const path=require('path')

function farmController()
{
    return{
        upload(req,res){

            return res.render('upload.ejs')
        },
        postUpload(req,res)
        {   
           const {name,price,desc}=req.body;
               console.log(path.join(__dirname + '../../../uploads/' ))
           const item=new Item({
               FarmerId:req.user._id,
               name,
               price,
               desc,
               img: {
                data: fs.readFileSync(path.join(__dirname + '../../../uploads/' + req.file.filename)),
                contentType: 'image/*'
            }
           })
           console.log("here-------")
           item.save().then(result=>{
               console.log("Ypur vegetable uploaded")
               return res.redirect('/farmer')
           }).catch(e=>{
               console.log(e)
               return res.redirect('/upload')
           })

        },
       async farmerItem(req,res)
        {
          const user=req.user
         
         
          const items=await Item.find({FarmerId:req.user._id})
          //console.log("items---",items)
          // console.log(orders)
           //res.header('Cache-Control', 'no-store')
           return res.render('farmer',{items:items})

        },
       async showorders(req,res)
        {   
            const orders=Order.find({FarmerId:req.user._id},null,{sort:{'createdAt':-1}}).populate('customerId').exec((err,orders)=>{
                
                if(!err)
                {
                    res.render('farmerorder',{orders:orders})
                }
                else
                {
                    res.redirect('/farmer')
                }


            })
           // console.log(orders)
            
        },
        changeStatus(req,res)
        {
            let {status,order}=req.body;
            //order.status=status;
             console.log("status updated")
            Order.updateOne({_id:order._id},{status:status},(err,data)=>{
                if(err)
                {console.log("error",e)
                  return   res.redirect('/farmer/orders')
                }
                 console.log("data",data)
                return res.redirect('/farmer')
          
            })

        },
        vegetableStatus(req,res)
        {
            let {status,_id}=req.body;
            //order.status=status;
             console.log("status updated")
            Item.updateOne({_id:_id},{status:status},(err,data)=>{
                if(err)
                {console.log("error",e)
                  return   res.redirect('/farmer/orders')
                }
                 console.log("data",data)
                return res.redirect('/farmer')
          
            })
        }

      
    }
}
module.exports=farmController