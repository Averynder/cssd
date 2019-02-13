import React from "react"
import Navbar from "./components/Navbar"
import Greetings from "./components/Greetings"
import ButtonContainer from "./components/ButtonContainer"
import Modal from "./components/Modal"
import Backdrop from "./components/Backdrop"
import Button from "./components/Button"
import {Link} from "react-router-dom"
import './App.css';

class App extends React.Component{
    constructor() {
        super();

        this.state = {
            users: [],
            isOpenStudent: false,
            isOpenTeacher: false
        }

        this.toggleStudent = this.toggleStudent.bind(this);
        this.toggleTeacher = this.toggleTeacher.bind(this);
    }

    /*
    componentDidMount() {
        fetch('/users')
        .then(res => res.json())
        .then(users => this.setState({ users }));
    }
    */

    toggleStudent(){
      this.setState({
        isOpenStudent: !this.state.isOpenStudent
      })
    }

    toggleTeacher(){
      this.setState({
        isOpenTeacher: !this.state.isOpenTeacher
      })
    }

    render(){
      return (
        <div className="bckgrnd container">
          <Navbar />
          <Greetings />
        {this.state.users.map(user =>
            <div key={user.id}>{user.username}</div>
        )}
          <ButtonContainer>
             <Button text="I Am A Student" onClick={this.toggleStudent}/>
             <Button text="I Am A Professor" onClick={this.toggleTeacher}/>

             <Link to="/select-semester">
               <Button text="I Am New To This Website" />
             </Link>

             <Link to="/AndreAppTest">
              <Button text="Andre App Test Button" />
             </Link>
           </ButtonContainer>

          <Backdrop show={this.state.isOpenStudent} onClose={this.toggleStudent}>
            <Modal show={this.state.isOpenStudent} onClose={this.toggleStudent} userType="Student" />
          </Backdrop>

          <Backdrop show={this.state.isOpenTeacher} onClose={this.toggleTeacher}>
            <Modal show={this.state.isOpenTeacher} onClose={this.toggleTeacher} userType="Teacher" />
          </Backdrop>
        </div>
      )
    }

}

export default App
