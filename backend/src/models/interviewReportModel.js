const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question : { type : String , required : true },
    intention : { type : String , required : true },
    answer : { type : String , required : true }
}, { _id : false } );

const behavioralQuestionSchema = new mongoose.Schema({
    question : { type : String , required : true },
    intention : { type : String , required : true },
    answer : { type : String , required : true }
}, { _id : false } );

const skillGapSchema = new mongoose.Schema({
    skill : { type : String , required : true},
    severity : {
        type : String,
        enum : [ 'low' , 'medium' , 'high' ],
        required : true
    }
}, {  _id : false } );

const preparationPlanSchema = new mongoose.Schema({
    day : { type : Number , required : true },
    focus : { type : String , required : true },
    tasks : [{ type : String , required : true }]
});

const interviewReportSchema = new mongoose.Schema({
    resume : {
        type : String,
        required : [ true , 'Resume is required' ]
    },
    selfDescription : { type : String },
    jobDescription : { type : String },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'users',
        required: true
    },
    jobTitle : { 
        type : String , 
        required : [ true , 'Job title is required' ]
    },
    matchScore : {
        type : Number,
        required : true,
        min : 0,
        max : 100
    },
    technicalQuestions : [ technicalQuestionSchema ],
    behavioralQuestions : [ behavioralQuestionSchema ],
    skillGaps : [ skillGapSchema ],
    preparationPlan : [ preparationPlanSchema ]

}, { timestamps : true } );

const interviewReportModel = mongoose.model( 'interviewReports', interviewReportSchema );
module.exports = interviewReportModel;