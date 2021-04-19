//import axios from 'axios'
console.log("IN public directory")
function makeOrder(obj)
{
    axios.post('/user/order',obj).then((res)=>{
        console.log(res)
        if(res.status===200)
        {
            window.location="/user";
        }
       
    }).catch(e=>{
        console.log(e)
    })

}
function changeStatus(status)
{
    axios.post('/farmer/updateStatus',status).then(res=>{
       console.log(res);
        window.location="/farmer/orders"
    }).catch(e=>{
        console.log("error",e)
    })
}

function myChangeStatus(thiss)
{ 



    console.log("change Status")
    const newStatus=thiss.value
    const order=thiss.id;
    changeStatus({order:JSON.parse(order),status:newStatus})


}
function changeVegetableStatus(thiss)
{

const status=thiss.value
const item=JSON.parse(thiss.id)

const obj={
    item:item,
    status:status
}
axios.post('/farmer/vegetableStatus',obj).then(res=>{
    console.log(res);
    window.location='/farmer'
}).catch(e=>{
    console.log(e)
})


}
if(document.getElementsByClassName('singleOrder'))
{
const id=document.getElementsByClassName('list-group-item')[0].id;
console.log("id-",id)
const btn=document.getElementsByClassName('OrderNow')[0];
console.log(btn)
btn.addEventListener('click',(e)=>{
    const quantity=document.getElementById('quantity')
      const phone=document.getElementById('phone').value;
      const address=document.getElementById('address').value;
      console.log(phone,address)
    const item=btn.dataset.item
   // const user=btn.id
   console.log(item)
    makeOrder({item:JSON.parse(item),phone:phone,address:address,quantity:quantity})
})
}
