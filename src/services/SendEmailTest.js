var aws = require("aws-sdk");
var handlebars = require('handlebars');
var nodemailer = require('nodemailer');

var ses = new aws.SES({region: 'us-east-1'});
var transporter = null; 
var template = null;

module.exports = {
    init:  async function(){
        transporter = nodemailer.createTransport({
            SES: ses
        });
    },
    //Fetches the template, assigns the template parameter and return the built email body
    buildEmailFromTemplate: function(params){
        try{    
            let a = require("../")
            let template =  require("../templates/MyTemplate.json").Template;
            let htmlTemplate = handlebars.compile(template.HtmlPart);
            let subjectTemplate =  handlebars.compile(template.SubjectPart);
            let textTemplate = handlebars.compile(template.TextPart);
            //Replace the placeholders with actual data in templateInput supplied in payload while invoking the lambda 
            return {
                htmlPart: htmlTemplate(params.templateInput),
                subjectPart: subjectTemplate(params.templateInput),
                textPart: textTemplate(params.templateInput)
            }
        }catch(err){
            throw new Error('Error building mail body from template');
        }
    },
    sendMail: async function(params){
        return new Promise((resolve,reject)=>{
        try {
            let emailContent = this.buildEmailFromTemplate(params);
            const mailOptions = {
                    from: params.fromEmailId,
                    to: params.toEmailId,
                    subject: emailContent.subjectPart,
                    text: emailContent.textPart,
                    html:emailContent.htmlPart,
                    attachments: [ 
                        {
                            filename: params.attachmentName,
                            contentType: 'application/pdf'
                        }
                    ],
            };
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                        reject(err);
                } else {
                        resolve();
                }
            });
        } catch (error) {
            reject(error);
        }
    });
    }
};