const pdf = require("pdf-creator-node");
const fs = require("fs");
const path = require('path')
const utils = require('util')
const puppeteer = require('puppeteer')
const hb = require('handlebars')
const readFile = utils.promisify(fs.readFile)
const moment = require('moment')
async function getTemplateHtml() {
    try {
        const invoicePath = path.resolve("./files/template", "order_invoice.html");
        return await readFile(invoicePath, 'utf8');
    }
    catch (err) { return Promise.reject("Could not load html template"); }
}

exports.generatePdf = (orderitemList, orderDetails) => {
    return new Promise((resolve, reject) => {
        let data = { items: orderitemList, ...orderDetails };
        getTemplateHtml().then(async (res) => {
            hb.registerHelper("getArrayLength", function (list, type) {
                switch (type) {
                    case 'category':
                        return list.length;
                    case 'items':
                        let length = 0;
                        for (let index = 0; index < list.length; index++) {
                            const element = list[index];
                            length = length + element.items.length
                        }
                        return length;
                    default:
                        break;
                }
            })

            hb.registerHelper("printItems", function (list, type, service_type) {
                let html = '';
                switch (type) {
                    case 'category_items':
                        for (let index = 0; index < list.length; index++) {
                            if (index > 0) {
                                const element = list[index];
                                if (service_type == 'piece_based') {
                                    html += '<tr><td rowspan=' + element.items.length + '>' + element.category_name + '</td><td>' + element.items[0].product_name + ' x ' + element.items[0].quantity + '</td><td>₹' + element.items[0].unit_price + '/piece</td><td>₹' + element.items[0].item_total + '</td></tr>'
                                    for (let i = 0; i < element.items.length; i++) {
                                        if (i > 0) {
                                            const item = element.items[i]
                                            html += '<tr><td>' + item.product_name + ' x ' + item.quantity + '</td><td>₹' + item.unit_price + '/piece</td><td>₹' + item.item_total + '</td></tr>'
                                        }
                                    }
                                } else {
                                    html += '<tr><td rowspan=' + element.items.length + '>' + element.category_name + '</td><td>' + element.items[0].product_name + ' x ' + element.items[0].quantity + '</td></tr>'
                                    for (let i = 0; i < element.items.length; i++) {
                                        if (i > 0) {
                                            const item = element.items[i]
                                            html += '<tr><td>' + item.product_name + ' x ' + item.quantity + '</td></tr>'
                                        }
                                    }
                                }
                            }
                        }
                        return new hb.SafeString(html);
                    case 'items':
                        for (let index = 0; index < list.length; index++) {
                            if (index > 0) {
                                const element = list[index];
                                if (service_type == 'piece_based') {
                                    html += '<tr><td>' + element.product_name + ' x ' + element.quantity + '</td><td>₹' + element.unit_price + '/piece</td><td>₹' + element.item_total + '</td></tr>'
                                } else {
                                    html += '<tr><td>' + element.product_name + ' x ' + element.quantity + '</td></tr>'
                                }
                            }
                        }

                        return new hb.SafeString(html);;
                    default:
                        break;
                }
            })

            hb.registerHelper("ifCond", function (v1, operator, v2, options) {
                switch (operator) {
                    case '==':
                        return (v1 == v2) ? options.fn(this) : options.inverse(this);
                    case '===':
                        return (v1 === v2) ? options.fn(this) : options.inverse(this);
                    case '!=':
                        return (v1 != v2) ? options.fn(this) : options.inverse(this);
                    case '!==':
                        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                    case '<':
                        return (v1 < v2) ? options.fn(this) : options.inverse(this);
                    case '<=':
                        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                    case '>':
                        return (v1 > v2) ? options.fn(this) : options.inverse(this);
                    case '>=':
                        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                    case '&&':
                        return (v1 && v2) ? options.fn(this) : options.inverse(this);
                    case '||':
                        return (v1 || v2) ? options.fn(this) : options.inverse(this);
                    default:
                        return options.inverse(this);
                }
            })

            hb.registerHelper("formatDate", function (datetime, format) {
                var DateFormats = {
                    short: "DD MMMM - YYYY",
                    long: "dddd DD.MM.YYYY HH:mm"
                };
                if (moment) {
                    format = DateFormats[format] || format;
                    return moment(datetime).format(format);
                }
                else {
                    return datetime;
                }
            });

            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;
            var options = {
              format: "A3",
              orientation: "portrait",
              border: "10mm",
              // header: {
              //     height: "45mm",
              //     contents: '<div style="text-align: center;">Author: Shyam Hajare</div>'
              // },
              // footer: {
              //     height: "28mm",
              //     contents: {
              //         first: 'Cover page',
              //         2: 'Second page', // Any page number is working. 1-based index
              //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
              //         last: 'Last Page'
              //     }
              // }
            };
            var document = {
              html: html,
              data: {},
              path: "./public/invoices/invoice_" + orderDetails.order_id + '.pdf',
              type: "",
            };
            pdf.create(document, options)
              .then((res) => {
                console.log(res);
              })
              .catch((error) => {
                console.error(error);
              });
        }).catch(err => {
            console.error(err)
        });
        resolve(true)
    })
}