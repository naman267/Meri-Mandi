const Item = require('../models/item')
const Order = require('../models/order')
function userController() {
  return {
    async getItem(req, res) {
      Item.find({})
        .populate('FarmerId')
        .exec((err, items) => {
          if (!err) {
            console.log('items', items)
            return res.render('user', { items: items })
          } else {
            res.redirect('/user')
          }
        })
    },
    show(req, res) {
      const vegetableId = req.params.id
      Item.find({ _id: vegetableId })
        .populate('FarmerId')
        .exec((err, items) => {
          if (!err) {
            console.log('items', items)
            res.render('singleOrder', { item: items[0] })
          } else {
            res.redirect('/user')
          }
        })
    },
    async order(req, res) {
      const { phone, address, id, quantity } = req.body
      //console.log("data-",phone,address,FarmerId,Item_id)
      //console.log("item",item)
      Item.find({ _id: id })
        .populate('FarmerId')
        .exec((err, items) => {
          if (!err) {
            console.log('items', items)
            const id = items[0]._id
            let obj = {}
            obj[items[0]._id] = {
              name: items[0].name,
              price: items[0].price,
              quantity: quantity
            }
            console.log('obj-', obj)
            const user = req.user
            const neworder = new Order({
              customerId: user._id,
              FarmerId: items[0].FarmerId._id,
              phone,
              address,
              items: obj
            })
            neworder
              .save()
              .then((items) => {
                return res.send()
              })
              .catch((e) => {
                console.log('error', e)
              })
            res.redirect('/user')
          } else {
            res.redirect('/user')
          }
        })
    },
    async myOrder(req, res) {
      Order.find({ customerId: req.user._id },null,{ sort: { createdAt: -1 } })
        .populate('FarmerId')
        .exec((err, order) => {
          if (!err) {
            console.log('myOrder', order)
            return res.render('userOrder', { orders: order })
          } else {
            return res.redirect('/user')
          }
        })
    }
  }
}
module.exports = userController
