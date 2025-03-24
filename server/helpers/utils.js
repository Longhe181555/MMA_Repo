const moment = require('moment');
const crypto = require("crypto");
const qs = require('qs');
require('dotenv').config();

const createPaymentLinkAD = (amount, description, ipAddr, transactionID) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const orderId = moment().format('DDHHmmss');
    const tmnCode = process.env.VNP_TMN_CODE;
    const secretKey = process.env.VNP_HASH_SECRET;
    const vnpUrl = process.env.VNP_URL;

    // Format the return URL properly
    const returnUrl = encodeURIComponent(`${process.env.VNP_RETURN_URL}`);

    const createDate = moment().format('YYYYMMDDHHmmss');

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': encodeURIComponent(description || `Thanh toan cho ma GD: ${orderId}`),
        'vnp_OrderType': 'billpayment',
        'vnp_Amount': parseInt(amount * 100000),
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };

    // Sort and encode parameters
    vnp_Params = sortObject(vnp_Params);

    // Create signature
    const signData = Object.keys(vnp_Params)
        .map(key => `${key}=${vnp_Params[key]}`)
        .join('&');

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Build final URL with properly encoded parameters
    const queryString = Object.keys(vnp_Params)
        .map(key => `${key}=${vnp_Params[key]}`)
        .join('&');

    return `${vnpUrl}?${queryString}`;
};

// Helper function to sort parameters
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createPaymentLinkAD
};
