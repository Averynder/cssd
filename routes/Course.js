var express = require('express');
var router = express.Router();
var app = express();


class Course {
    //
    // courseTitle;
    // subject;
    // catalog;
    // credits;
    // prereqs;
    // coreqs;

    constructor(courseTitle, subject, catalog, credits, prereqs, coreqs) {
        this.courseTitle = courseTitle;
        this.subject = subject;
        this.catalog = catalog;
        this.credits = credits;
        this.prereqs = prereqs;
        this.coreqs = coreqs;
    }



    clone () {
        var cc = new Course(null,null,null,null,null,null);
        cc.courseTitle = this.courseTitle;
        cc.subject = this.subject;
        cc.catalog = this.catalog;
        cc.credits = this.credits;
        cc.prereqs = this.prereqs;
        cc.coreqs = this.coreqs;
        return cc;
    }
}

// console.log("same?");

// var Course11 = new Course("lol","lol","lol","lol","lol","lol");
// var Course22 = new Course("lol","lol","lol","lol","lol","lol");
// var Course33 = Course11.clone();

// console.log("Avery>Mackenzie" + Course33.courseTitle);


// This method works for checking equality among objects (even user-defined)

// var eq = JSON.stringify(Course11) === JSON.stringify(Course22);
// console.log(eq);
//
// Course33 = JSON.stringify(Course22);




module.exports = Course;
