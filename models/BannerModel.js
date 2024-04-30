const mongoose = require('mongoose')

const bannerSchema = mongoose.Schema({
    imageUrl: {
        type: String
    },
    offerId: {
        type: String
    },
    validTill: {
        type: String
    },
    validFrom: {
        type: String
    },
    isActive :{
        type: Boolean,
        default: true
    }
}, {timestamps: true})

module.exports = mongoose.model('OfferBanners', bannerSchema)

