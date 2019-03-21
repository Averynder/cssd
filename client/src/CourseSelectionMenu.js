import React from "react";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import { Link } from "react-router-dom";
import { Modal, Form, FormControl, Table } from "react-bootstrap";
import * as times from "./data/calendar.json";
import * as data from "./data/courses.json";
import * as data1 from "./data/courses2.json";
import { CirclePicker } from "react-color";
import reactCSS from "reactcss";
import LoadingScreen from 'react-loading-screen';

class CourseSelectionMenu extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleShow1 = this.handleShow1.bind(this);
    this.handleClose1 = this.handleClose1.bind(this);
    this.openRubiat = this.openRubiat.bind(this);
    this.closeRubiat = this.closeRubiat.bind(this);
    this.colourRubiatC = this.colourRubiatC.bind(this);
    this.colourRubiatO = this.colourRubiatO.bind(this);
    this.openUpload = this.openUpload.bind(this);
    this.closeUpload = this.closeUpload.bind(this);
    this.toggleLoading = this.toggleLoading.bind(this);
    this.setCourses = this.setCourses.bind(this);
    this.regEx = this.regEx.bind(this);

    var year;
    var semester;

    if (
      document.getElementById("semester-year") === null ||
      document.getElementById("semester") === null
    ) {
      year = new Date().getFullYear();
      semester = "Fall";
    } else {
      year = document.getElementById("semester-year").value;
      semester = document.getElementById("semester").value;
    }

    this.state = {
      show: false,
      show1: false,
      rubiat: false,
      colorS: false,
      isLoading: true,
      lectures: null,
      labs: null,
      tutorials: null,
      semester: semester,
      year: year,
      weekdays: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      classes: JSON.parse(JSON.stringify(data.sequence)),

      colors: [["red", 0], ["pink", 0], ["green", 0], ["yellow", 0], ["orange", 0], ["blue", 0], ["black", 0]],

      color1: "red",
      color2: "pink",
      color3: "green",
      color4: "yellow",
      color5: "orange",
      color6: "blue",
      color7: "black",

      addedClasses: [],

      courses: JSON.parse(JSON.stringify(data.default.sequence)),
      courses2: JSON.parse(JSON.stringify(data1.default.sequence)),
      selectedCourses: [],
      show2: "hidden",

      colorOfNewClass: [],

      showUpload: false,

      uploadedFile: null

    };
    //console.log("data.sequence: " + JSON.stringify(data.sequence));
    //console.log("courses: " + JSON.stringify(data.default.sequence));
  }
  componentDidMount() {
    fetch("/semQuery")
        .then(res => res.json())
        .then(users2 =>
            this.setState({ users2 }, () => this.setCourses(users2)))
        .then(() => {this.regEx()})
        .then(() => { this.toggleLoading(); });
  }

  setCourses(stringy)
  {
    stringy = "" + stringy;
    var lecStartPosition = stringy.indexOf("\"lectures\":[");
    var tutStartPosition = stringy.indexOf("\"tutorials\":[");
    this.state.lectures = stringy.substring(lecStartPosition+12,tutStartPosition);
    var labStartPosition = stringy.indexOf("\"labs\":[");
    this.state.tutorials = stringy.substring(tutStartPosition+13,labStartPosition);
    this.state.labs = stringy.substring(labStartPosition+8);
  }

  regEx()
  {

  }

  timeToNum = time => {
    // time parameter represents start time or end time of a class
    for (let i = 0; i < 61; i++)
      if (time === times.time[i].startTime) return times.time[i].num;
    return null;
  };

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  handleClose1() {
    this.setState({ show1: false });
  }

  handleShow1() {
    this.setState({ show1: true });
  }

  openRubiat() {
    this.setState({
      rubiat: true
    });
  }

  closeRubiat() {
    this.setState({
      rubiat: false
    });
  }

  colourRubiatO() {
    this.setState({
      colorS: true
    });
  }

  colourRubiatC() {
    this.setState({
      colorS: false
    });
  }

  openUpload() {
    this.setState({
      showUpload: true
    })
  }

  closeUpload() {
    this.setState({
      showUpload: false
    })
  }

  handleSelectedFile = event => {
    this.setState({
      uploadedFile: event.target.files[0]
    })
  }

  handleUpload = () => {
    var file = this.state.uploadedFile;
    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
      //console.log(reader.result);
      var JSONified = JSON.parse(reader.result);

      for (let i = 0; i < JSONified.length; i++) {
        document.getElementById("add-class1").value = JSONified[i].course;
        this.addClass();
      }

    }

    this.setState({
      showUpload: false
    })
    
  }

  downloadJson = () => {
    let courseArray = this.state.selectedCourses;
    let filename = "schedule.json";
    let contentType = "application/json;charset=utf-8;";

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      var blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(courseArray)))], { type: contentType });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      var file = document.createElement('a');
      file.download = filename;
      file.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(courseArray));
      file.target = '_blank';
      document.body.appendChild(file);
      file.click();
      document.body.removeChild(file);
    }
  }

  /*addClass(days_array) {
    document.getElementById("id");
  }*/
  
  toggleLoading() {
    this.setState({
      isLoading: !this.state.isLoading
    });
  }

  handleChangeComplete = color => {

    let courseNameInput = document.getElementById("colorChanger").value; //Get user input comp248
    let chosenClass; //class object

    for (let i = 0; i < this.state.classes.length; i++) {
      if (courseNameInput === this.state.classes[i].course) {
        chosenClass = this.state.classes[i];
        break;
      }
    }

    document.getElementById(chosenClass.course).style.backgroundColor = color.hex;

    let color1;

    for (let j = 0; j < this.state.colors.length; j++) {
      if (this.state.colors[j][0] == color) {
        this.state.colors[j][1] = 0;
        break;
      }
    }

  for(let j=0; j<chosenClass.days.length; j++) //added
    for (let i = 0; i < 61; i++) {
      let dayOfTheWeek = chosenClass.days[j] + "-";
      if (
        this.timeToNum(chosenClass.startTime) <= i &&
        this.timeToNum(chosenClass.endTime) >= i
      ) {
        color1 = document.getElementById(dayOfTheWeek + i).style.backgroundColor;
        document.getElementById(dayOfTheWeek + i).style.backgroundColor = color.hex; // (you can choose to select the return of a function)
      }
    }

    for(let k=0; k<chosenClass.ta.length; k++)
      for(let j=0; j<chosenClass.ta[k].days.length; j++){
        let dayOfTheWeek = chosenClass.ta[k].days[j] + "-";
        for (let i = 0; i < 61; i++) {
          if (
            this.timeToNum(chosenClass.ta[k].startTime) <= i &&
            this.timeToNum(chosenClass.ta[k].endTime) >= i
          ) {
            color1 = document.getElementById(dayOfTheWeek + i).style.backgroundColor;
            document.getElementById(dayOfTheWeek + i).style.backgroundColor = color.hex; // (you can choose to select the return of a function)
          }
        }
      }

    for (let j = 0; j < this.state.colors.length; j++) {
      if (this.state.colors[j][0] == color1) {
        this.state.colors[j][1] = 0;
        break;
      }
    }

  };

  addClass = () => {
    let array = this.state.selectedCourses; //Keep track of user selected classes
    let input = document.getElementById("add-class1").value; //Get user input (Course Code)
    let classList = this.state.courses; //Gets the whole list of courses of concordia
    let addedClass;
    let classExists = false;
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].course === input) {
        for (let j = 0; j < this.state.selectedCourses.length; j++) {
          if (this.state.selectedCourses[j].course === input) {
            document.getElementById("addStatus1").innerHTML =
              "This class is already added.";
            this.setState({ show2: "visible" });
            return;
          }
        }
        addedClass = classList[i];
        classExists = true;
        this.setState({ show2: "hidden" });
        break;
      }
    }

    if (classExists === false) {
      document.getElementById("addStatus1").innerHTML =
        "Invalid Class/Class Not Found";
      this.setState({ show2: "visible" });
      return;
    }



    let n = 1;
    let initial = this.timeToNum(addedClass.startTime);
    let final = this.timeToNum(addedClass.endTime);
    let middle = (initial + final)/2;
    let colorChosen;

    for (let j = 0; j < this.state.colors.length; j++) {
      if (this.state.colors[j][1] == 0) {
        colorChosen = this.state.colors[j][0];
        this.state.colors[j][1] = 1;
        break;
      }
    }

    if (colorChosen === null || colorChosen === undefined) {
      return;
    }

  for(let k=0; k<addedClass.ta.length; k++) {
    for(let j=0; j<addedClass.ta[k].days.length; j++){
      let dayOfTheWeek = addedClass.ta[k].days[j] + "-";
      let n = 1;
      let initial = this.timeToNum(addedClass.ta[k].startTime);
      let final = this.timeToNum(addedClass.ta[k].endTime);
      let middle = (initial + final)/2;
      for (let i = 0; i < 61; i++) {
        if (
          this.timeToNum(addedClass.ta[k].startTime) <= i &&
          this.timeToNum(addedClass.ta[k].endTime) >= i
        ) {
          document.getElementById(dayOfTheWeek + i).style.backgroundColor = colorChosen; // (you can choose to select the return of a function)
          if (i === middle - 2) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.course;
            n++;
          }else if (i === middle - 1) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.ta[k].type;
            n++;
          }else if(i === middle){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.ta[k].startTime;
            n++;
          }
          else if(i === middle + 1){
            document.getElementById(dayOfTheWeek + i).innerHTML = "to";
            n++;
          }
          else if(i === middle + 2){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.ta[k].endTime;
            n++;
          }else{
            document.getElementById(dayOfTheWeek + i).innerHTML = "<br />";
          }
        }
      }
    }
  }

    for(let j=0; j<addedClass.days.length; j++){
      for (let i = 0; i < 61; i++) {
        if (
          initial <= i &&
          final >= i
        ) {
          let dayOfTheWeek = addedClass.days[j] + "-";
          document.getElementById(dayOfTheWeek + i).style.backgroundColor = colorChosen; // (you can choose to select the return of a function)
          if (i === middle - 1) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.course;
            n++;
          }else if(i === middle){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.startTime;
            n++;
          }
          else if(i === middle + 1){
            document.getElementById(dayOfTheWeek + i).innerHTML = "to";
            n++;
          }
          else if(i === middle + 2){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.endTime;
            n++;
          }else{
            document.getElementById(dayOfTheWeek + i).innerHTML = "<br />";
          }
        }
      }
    }

    let oldColors = [];

    for (let o = 0; o < this.state.selectedCourses.length; o++) { // get list of all the colors in the selection menu before change
      oldColors[o] = document.getElementById(this.state.selectedCourses[o].course).style.backgroundColor;
    }

    oldColors.push(colorChosen); // add the color of new course to the list also
    this.setState({colorOfNewClass: oldColors}) // when rendering the selection menu it will render it with all the old colors + the newly added color

    array.push(addedClass);
    this.setState({
      selectedCourses: array
    });
  };

  addClass1 = () => {
    let array = this.state.selectedCourses; //Keep track of user selected classes
    let input = document.getElementById("add-class1").value; //Get user input (Course Code)
    let classList = this.state.courses2; //Gets the whole list of courses of concordia
    let addedClass;
    let classExists = false;
    for (let i = 0; i < classList.length; i++) {
      if (classList[i].course === input) {
        for (let j = 0; j < this.state.selectedCourses.length; j++) {
          if (this.state.selectedCourses[j].course === input) {
            document.getElementById("addStatus1").innerHTML =
              "This class is already added.";
            this.setState({ show2: "visible" });
            return;
          }
        }
        addedClass = classList[i];
        classExists = true;
        this.setState({ show2: "hidden" });
        break;
      }
    }

    if (classExists === false) {
      document.getElementById("addStatus1").innerHTML =
        "Invalid Class/Class Not Found";
      this.setState({ show2: "visible" });
      return;
    }

    let colorChosen;

    for (let j = 0; j < this.state.colors.length; j++) {
      if (this.state.colors[j][1] == 0) {
        colorChosen = this.state.colors[j][0];
        this.state.colors[j][1] = 1;
        break;
      }
    }

    if (colorChosen === null || colorChosen === undefined) {
      return;
    }

// right now it's hardcoded to always add the first lecture section of a new class "[0]"
// it doesn't verify if that section can actually fit in the table
    for(let j=0; j<addedClass.lecture[0].days.length; j++){ // add lecture

    let n = 1;
    let initial = this.timeToNum(addedClass.lecture[0].startTime);
    let final = this.timeToNum(addedClass.lecture[0].endTime);
    let middle = (initial + final)/2;

      for (let i = 0; i < 61; i++) {
        if (
          initial <= i &&
          final >= i
        ) {
          let dayOfTheWeek = addedClass.lecture[0].days[j] + "-";
          document.getElementById(dayOfTheWeek + i).style.backgroundColor = colorChosen; // (you can choose to select the return of a function)
          if (i === middle - 1) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.course;
            n++;
          }else if(i === middle){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.lecture[0].startTime;
            n++;
          }
          else if(i === middle + 1){
            document.getElementById(dayOfTheWeek + i).innerHTML = "to";
            n++;
          }
          else if(i === middle + 2){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.lecture[0].endTime;
            n++;
          }else{
            document.getElementById(dayOfTheWeek + i).innerHTML = "<br />";
          }
        }
      }
    }

    for (let k = 0; k < addedClass.tutorial[0].days.length; k++) { // add tutorial

      let n = 1;
      let initial = this.timeToNum(addedClass.tutorial[0].startTime);
      let final = this.timeToNum(addedClass.tutorial[0].endTime);
      let middle = (initial + final)/2;
  
      for (let i = 0; i < 61; i++) {
        if (
          initial <= i &&
          final >= i
        ) {
          let dayOfTheWeek = addedClass.tutorial[0].days[k] + "-";
          document.getElementById(dayOfTheWeek + i).style.backgroundColor = colorChosen; // (you can choose to select the return of a function)
          if (i === middle - 2) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.course;
            n++;
          }else if (i === middle - 1) {
            document.getElementById(dayOfTheWeek + i).innerHTML = "Tutorial";
            n++;
          }else if(i === middle){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.tutorial[0].startTime;
            n++;
          }
          else if(i === middle + 1){
            document.getElementById(dayOfTheWeek + i).innerHTML = "to";
            n++;
          }
          else if(i === middle + 2){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.tutorial[0].endTime;
            n++;
          }else{
            document.getElementById(dayOfTheWeek + i).innerHTML = "<br />";
          }
        }
      }
    }
  
    for (let l = 0; l < addedClass.tutorial[0].days.length; l++) { // add lab
  
      let n = 1;
      let initial = this.timeToNum(addedClass.lab[0].startTime);
      let final = this.timeToNum(addedClass.lab[0].endTime);
      let middle = (initial + final)/2;
  
      for (let i = 0; i < 61; i++) {
        if (
          initial <= i &&
          final >= i
        ) {
          let dayOfTheWeek = addedClass.lab[0].days[l] + "-";
          document.getElementById(dayOfTheWeek + i).style.backgroundColor = colorChosen; // (you can choose to select the return of a function)
          if (i === middle - 2) {
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.course;
            n++;
          }else if (i === middle - 1) {
            document.getElementById(dayOfTheWeek + i).innerHTML = "Lab";
            n++;
          }else if(i === middle){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.lab[0].startTime;
            n++;
          }
          else if(i === middle + 1){
            document.getElementById(dayOfTheWeek + i).innerHTML = "to";
            n++;
          }
          else if(i === middle + 2){
            document.getElementById(dayOfTheWeek + i).innerHTML = addedClass.lab[0].endTime;
            n++;
          }else{
            document.getElementById(dayOfTheWeek + i).innerHTML = "<br />";
          }
        }
      }
    }

    let oldColors = [];

    for (let o = 0; o < this.state.selectedCourses.length; o++) { // get list of all the colors in the selection menu before change
      oldColors[o] = document.getElementById(this.state.selectedCourses[o].course).style.backgroundColor;
    }

    oldColors.push(colorChosen); // add the color of new course to the list also
    this.setState({colorOfNewClass: oldColors}) // when rendering the selection menu it will render it with all the old colors + the newly added color

    array.push(addedClass);
    this.setState({
      selectedCourses: array
    });
  };

  remove = () => {
    let coursecode = document.getElementById("add-class1").value;
    let courseToRemove;

    for (let i = 0; i < this.state.selectedCourses.length; i++) {
      if (this.state.selectedCourses[i].course === coursecode) {
        courseToRemove = this.state.selectedCourses[i];
        break;
      }
    }



    if (courseToRemove === undefined || courseToRemove === null) {
      document.getElementById("addStatus1").innerHTML = "Invalid Course / Course Not Found";
      this.setState({show2: "visible"})
      return;
    }

    let color;

  for(let j=0; j<courseToRemove.days.length; j++)
    for (let i = 0; i < 61; i++) {
      let dayOfTheWeek = courseToRemove.days[j] + "-";
      if (
        this.timeToNum(courseToRemove.startTime) <= i &&
        this.timeToNum(courseToRemove.endTime) >= i
      ) {
        color = document.getElementById(dayOfTheWeek + i).style.backgroundColor;
        document.getElementById(dayOfTheWeek + i).style.backgroundColor = ""; // (you can choose to select the return of a function)
        document.getElementById(dayOfTheWeek + i).innerHTML = "-----------------";
      }
    }

    for(let k=0; k<courseToRemove.ta.length; k++)
      for(let j=0; j<courseToRemove.ta[k].days.length; j++){
        let dayOfTheWeek = courseToRemove.ta[k].days[j] + "-";
        for (let i = 0; i < 61; i++) {
          if (
            this.timeToNum(courseToRemove.ta[k].startTime) <= i &&
            this.timeToNum(courseToRemove.ta[k].endTime) >= i
          ) {
            document.getElementById(dayOfTheWeek + i).style.backgroundColor = ""; // (you can choose to select the return of a function)
            document.getElementById(dayOfTheWeek + i).innerHTML = "-----------------";
          }
        }
      }

    for (let j = 0; j < this.state.colors.length; j++) {
      if (this.state.colors[j][0] == color) {
        this.state.colors[j][1] = 0;
        break;
      }
    }

    let oldColors = [];

    for (let o = 0; o < this.state.selectedCourses.length; o++) { // get list of all the colors before change
      oldColors[o] = document.getElementById(this.state.selectedCourses[o].course).style.backgroundColor;
    }

    let oldColorsFiltered = oldColors.filter(data => color !== data); // filter out the color of the course that we just removed

    let array = this.state.selectedCourses.filter(
      data => coursecode !== data.course
    );
    this.setState({
      selectedCourses: array, show2: "hidden"
    });

    for (let p = 0; p < this.state.selectedCourses.length; p++) {// re-assign the old colors to the new table
      document.getElementById(this.state.selectedCourses[p].course).style.backgroundColor = oldColorsFiltered[p];
    }

  };

  render() {
    const styles = reactCSS({
      default: {
        popover: {
          position: "fixed",
          top: "23%",
          left: "38%",
          zIndex: "2"
        },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px"
        }
      }
    });

    let myAddedClasses = this.state.selectedCourses.map(theClass => (
      <option value={theClass.course}>{theClass.course}</option>
    ));



    let i = 0;

    let x = this.state.selectedCourses.map(element => (
      <tr id={element.course} style={{backgroundColor : this.state.colorOfNewClass[i++]}}>

        <td>
          <div>
            <input type="checkbox" checked /> &nbsp;
            <strong>{element.course}</strong>
            <br />
            <strong>{element.name}</strong>{" "}
            <select name="course-section">
              <option value="section1">section 1</option>
              <option value="section2">section 2</option>
              <option value="section3">section 3</option>
              <option value="section4">section 4</option>
              {element.lecture.map(element1 => (
                element1.tutorial.map(element2 => (
                <option>{element1.section + "-" + element2.section}</option>))
                ))}
            </select>
            <br />
            <p id="requirements">
              <strong>Requirement: </strong> related info goes here
            </p>
          </div>
        </td>
      </tr>
    ));

    let table = (
      <Table
        id="selected-course-table"
        className="rounded"
        striped
        bordered
        hover
        variant="dark"
      >
        {x}
      </Table>
    );

    let allOptions = this.state.courses.map(choice => (
      <option value={choice.course} />
    ));

    return (

      <div className="container">
        <Navbar />

        <div className="jumbotron j-greetings">
          <LoadingScreen
              loading={this.state.isLoading}
              bgColor='#f1f1f1'
              spinnerColor='#b30000'
              textColor='#676767'
              logoSrc='https://user-images.githubusercontent.com/36492119/52869487-bdcd5180-3113-11e9-93d4-155882376646.png'
              text='Receiving Courses'
          >

          </LoadingScreen>
          <h2 className="display-4">Course Selection Menu</h2>
          <hr color="#7e1530" />

          <div className="container">
                <div className="row bg-secondary text-white rounded">
                  <div className="col">
                    <label for="add-class1">
                      <h6 id="test">Select Course</h6>
                    </label>
                    <input
                      type="text"
                      list="add-class2"
                      id="add-class1"
                      className="btn btn-dark"
                      placeholder="Course Number"
                    />
                    <datalist id="add-class2">{allOptions}</datalist>
                  </div>
                  <div className="col">
                    <Button
                      text="Select"
                      onClick={this.addClass1}
                      style={{ float: "left" }}
                    />
                    <Button
                      text="Remove"
                      onClick={this.remove}
                      style={{ float: "left" }}
                    />
                    <Button
                      text="Add by Upload"
                      onClick={this.openUpload}
                      style={{ float: "left" }}
                    />
                  </div>
                </div>
              </div>

              <p
                id="addStatus1"
                style={{ color: "red", visibility: this.state.show2 }}
              />
              <div className="mt-4">{table}</div>
              <hr color="#7e1530" />
          <h2 className="display-5">
            {this.state.semester} {this.state.year} Semester
          </h2>
          <p className="lead" />





          <div>
            {" "}
            {/* Schedule */}
            <Table>
              <tbody>
                <tr>
                  <td>
                    <Table>
                      <tbody>
                        <th>Time</th>

                        <tr>
                          <td>
                            {times.time.map(element => (
                              <div>{element.startTime}</div>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </td>

                  {this.state.weekdays.map(days => (
                    <td>
                      <table>
                        <tbody>
                          <th>{days}</th>
                          <tr>
                            <td>
                              {times.time.map(element => {
                                let myID = days + "-" + element.num;
                                return (
                                  <div id={myID}>
                                    -----------------
                                  </div>
                                );
                              })}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  ))}
                </tr>
              </tbody>
            </Table>
          </div>

          {/* <Button text="Add A Class" onClick={this.handleShow} />
          <Button text="Remove A Class" onClick={this.handleShow1} /> */}
          <Button text="Color Selection" onClick={this.openRubiat} />
          <Button text="Download Schedule" onClick={this.downloadJson} />
          <Link to="/finalize-export-sem">
            <Button text="Finalize" />
          </Link>

          <Link to="/select-semester">
            <Button text="Back To Select Semester" />
          </Link>
        </div>

        {/* <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add A Course</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <p>Select A Course You'd Like To Add </p> <br />
            <Form inline style={{ textAlign: "center" }}>
              <input id="add-class" type="text" />
              <Button type="submit" text="Add Course" onClick={this.onAdd} />
            </Form>
            <p id="addStatus" style={{ color: "red" }} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handleClose}
              text="Close"
            />
            <Button variant="primary" text="Save Changes" />
          </Modal.Footer>
        </Modal> */}

        {/* <Modal show={this.state.show1} onHide={this.handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>Remove A Course</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <p>Select A Course You'd Like To Remove </p> <br />
            <Form inline style={{ textAlign: "center" }}>
              <FormControl
                type="text"
                placeholder="Search"
                className=" mr-sm-2"
                style={{ width: "100%", textAlign: "center" }}
              />
              <Button type="submit" text="Remove Course" />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handleClose1}
              text="Close"
            />
            <Button variant="primary" text="Save Changes" />
          </Modal.Footer>
      </Modal> */}

        <Modal show={this.state.rubiat} onHide={this.closeRubiat}>
          <Modal.Header closeButton>
            <Modal.Title>Course Colour Selection</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <p>Select A Course and Color </p> <br />
            <Form inline style={{ textAlign: "center" }}>
              <div className="container" style={{ width: "40%" }}>
                <select id="colorChanger">
                  {myAddedClasses}
                </select>
              </div>
              <Button text="Color Selection" onClick={this.colourRubiatO} />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeRubiat} text="Close" />
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.colorS} onHide={this.colourRubiatC}>
          <Modal.Header closeButton style={{ backgroundColor: "#82100d" }} >
            <Modal.Title>Color Selector</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }} >
            <p style={{ margin: "0px 0px 25% 0px" }}>
              Select a Color for Course (replace with course name)
            </p>
            <Form inline style={{ textAlign: "center" }}>
              <div className="container" style={{ width: "40%" }}>
                <div style={styles.popover}>
                  <CirclePicker
                    style={{ margin: "0px 0px 0px 0px" }}
                    onChangeComplete={this.handleChangeComplete}

                  />
                </div>
              </div>
            </Form>
          </Modal.Body>

          <Modal.Footer style={{ backgroundColor: "#82100d" }}>
            <Button
              variant="primary"
              onClick={this.colourRubiatC}
              text="Close"
            />
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.showUpload} onHide={this.closeUpload}>
          <Modal.Header closeButton>
            <Modal.Title>Add Via Upload</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center" }}>
            <div>
            <input type="file" name="filename" className="btn btn-dark" onChange={this.handleSelectedFile}/>
            <button className="btn btn-dark" value="upload" onClick={this.handleUpload}>Upload</button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeUpload} text="Close" />
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default CourseSelectionMenu;
