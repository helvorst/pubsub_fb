const fbcnt = require('./fb/fbCnt');

module.exports.makePayment = async function(id, data, attrs) {
    const uid = attrs.user;
    const sum = data.sum;
    const monster = data.monster;
    console.log(`Payment for id=${id}, user=${uid}, sum: ${sum}, monster: ${monster}`);

    //get transaction 
    const tid = Math.random()*Math.pow(10, 20);
    console.log(`Transaction created: ${tid}`);

    const col = `transactions/${uid}/tids`;
    const respData = {
        message: `Hello, transaction ${tid} processed! You'll get ${sum} for ${monster}`
    }

    // create record in fb
    await fbcnt.create(col, respData);

    console.log('FB informed about transaction');

    return tid;
}

// function test() {

//     module.exports.payment(123, {sum: 99, monster: 'Pooh'}, {user: 'X6r1MwGHw0dt2MfIm5QmKpF98Lx1'});
// }

// test();
