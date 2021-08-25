const { create } = require('handlebars');

const public_key = "";
const secret_key = "";

const stripe = require('stripe')(secret_key);



async function createToken(number, exp_month, exp_year, cvc, country, zip_code){
    return await stripe.tokens.crate({
        card: {
            number: number,
            exp_month: exp_month,
            exp_year: exp_year,
            cvc: cvc,
            address_country: country,
            address_zip:zip_code

        }
    })
}

async function createCustomer(name, email, couponCode){
    return await stripe.customers.create({
        description: 'Customer for Popcorn',
        email: email,
        name: name,
        coupon: couponCode
    })
}

async function createCard(customerId, cardTokenId){
    return await stripe.customers.createSource(customerId, {
        source: cardTokenId
    })
}

module.exports = {createToken, createCustomer, createCard};






